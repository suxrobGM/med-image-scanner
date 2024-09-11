from pathlib import Path
import litserve as ls
import cv2
import numpy as np
import torch
import tensorflow as tf
from collections import Counter
from tensorflow.keras.models import load_model
from enums import DLModelEndpoint, DLModelWeights, LLMPPrompt
import requests

class BrainMRIAPI(ls.LitAPI):

    def load_segmentation_model(self) -> tf.keras.Model:
        """
        Loads the brain MRI segmentation model.
        The expected input shape for the model is: 
        `(1, 4, 240, 240, 160)`.

        Returns:
        - Loaded segmentation model.
        """
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model_path = DLModelWeights.BRAIN_MRI_SEGMENTATION.value
        with tf.device('/GPU:0'): 
            model = load_model(self.model_path, compile=False)
            print("[INFO]: Segmentation Model loaded")
            return model

    def setup(self, device: str):
        # Load the segmentation model on GPU and the classification model on CPU
        self.model = self.load_segmentation_model()
        with tf.device('/cpu:0'): 
            self.tf_model = load_model(DLModelWeights.BRAIN_MRI_CLASSIFICATION.value)
        print("[INFO]: Classification Model loaded")
        print('DEVICE: ', self.device)

    def normalize(self, data: np.ndarray) -> np.ndarray:
        """
        Normalizes the input data to a range of [0, 1].

        Parameters:
        - data: Input numpy array to normalize.

        Returns:
        - Normalized numpy array.
        """
        return data.astype(np.float32) / np.max(data)

    def grab_and_resize_images(self, folder_path: str, img_size: tuple = (256, 256)) -> tuple:
        """
        Grabs all images from a folder, resizes them, and returns the list of images and the original shape.

        Parameters:
        - folder_path: Path to the folder containing the images.
        - img_size: Tuple specifying the resize dimensions (default: (256, 256)).

        Returns:
        - A tuple containing a list of resized images and the original image shape.
        """
        all_images: list = []
        org_shape = None
        for img_path in sorted(Path(folder_path).glob('*')):
            if img_path.suffix.lower() not in ['.png', '.jpeg', '.jpg']: continue
            img: np.ndarray = cv2.imread(str(img_path), cv2.IMREAD_GRAYSCALE)
            if org_shape is None: org_shape = img.shape[:2]
            img = cv2.resize(img, img_size)
            all_images.append(img)
        
        return all_images, org_shape

    def prepare_input(self, folder_path: str) -> tuple:
        """
        Prepares the input data for the model by loading and resizing the images,
        and normalizing the image array.

        Parameters:
        - folder_path: Path to the folder containing the images.

        Returns:
        - A tuple containing the normalized image array and the original image shape.
        """
        all_images, org_image_shape = self.grab_and_resize_images(folder_path)
        arr: np.ndarray = np.array(all_images, dtype=np.float64)
        img = np.expand_dims(arr, axis=-1)
        img = self.normalize(img)
        
        return img, org_image_shape

    def process_file(self, folder_path: str, accuracy_threshold: float) -> tuple:
        """
        Processes the input images, predicts the segmentation mask, and applies the accuracy threshold.

        Parameters:
        - folder_path: Path to the folder containing the images.
        - accuracy_threshold: Threshold for model prediction accuracy.

        Returns:
        - A tuple containing the input images, binary mask, and original image shape.
        """
        with torch.no_grad():
            input_feed, org_image_shape = self.prepare_input(folder_path)
            print("Input loaded:", input_feed.shape)

            output = self.model.predict(input_feed)
            mask_binary = (output > accuracy_threshold).astype(np.uint8)
            print("Output computed:", mask_binary.shape)

            return input_feed, mask_binary, org_image_shape
        
    def decode_request(self, request: dict) -> tuple:
        """
        Decodes the incoming request to extract folder path, accuracy threshold, and pixel spacing.

        Parameters:
        - request: Dictionary containing the request parameters.

        Returns:
        - A tuple containing folder path, accuracy threshold, and pixel spacing.
        """
        return request["folder_path"], request.get("accuracy_threshold", 0.85), request.get('pixel_spacing', [0.5,0.5])  # in mm

    def filter_slices(self, numpy_array: np.ndarray) -> list:
        """
        Filters the slices based on the area of the detected tumor segmentation.

        Parameters:
        - numpy_array: Numpy array containing the segmentation masks.

        Returns:
        - A list of indices for slices with sufficient tumor area.
        """
        wanted_slices = []
        for i in range(numpy_array.shape[0]):
            target_slice = numpy_array[i].squeeze()
            x = np.count_nonzero(target_slice)
            mul = target_slice.shape[0] * target_slice.shape[1]
            if round(x/mul, 2) >= 0.015:
                wanted_slices.append(i)

        return wanted_slices
    
    def classify(self, normalized_input: np.ndarray, wanted_slices_indx: list, 
                 names: list = ["Glioma Tumor", "No Tumor", "Meningioma Tumor", "Pituitary Tumor"]) -> list:
        """
        Classifies the tumor types based on the slices from the segmentation model.

        Parameters:
        - normalized_input: Normalized input images.
        - wanted_slices_indx: List of slice indices to classify.
        - names: List of possible classification labels.

        Returns:
        - List of classification results for each slice.
        """
        slices = normalized_input[wanted_slices_indx].squeeze()
        predictions = []
        for indx, img in enumerate(slices):
            norm_channel = cv2.normalize(img, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
            opencvImage = cv2.cvtColor(norm_channel, cv2.COLOR_GRAY2RGB)
            img = cv2.resize(opencvImage,(150,150))
            img = img.reshape(1,150,150,3)
            p = self.tf_model.predict(img)
            p = np.argmax(p,axis=1)[0]

            res = names[p]
            predictions.append(res)
            print(f'Slice #{indx:2d}: The model predicts that there is {res}')

        return predictions
    
    def calculate_biggest_tumor_area(self, masks_array: np.ndarray, org_image_shape: tuple, pixel_spacing: list) -> float:
        """
        Calculates the area of the largest detected tumor in the MRI images.

        Parameters:
        - masks_array: Numpy array of segmentation masks.
        - org_image_shape: Tuple of the original image shape.
        - pixel_spacing: List of pixel spacing values.

        Returns:
        - The area of the largest tumor in mm².
        """
        flattened_masks = masks_array.squeeze(-1)
        non_zero_counts = np.count_nonzero(flattened_masks, axis=(1, 2))

        max_index = np.argmax(non_zero_counts)
        print(f"Index of the mask with the largest non-zero values: {max_index}")

        target_mask = masks_array[max_index].squeeze()
        y_factor = target_mask.shape[0] / org_image_shape[0]
        x_factor = target_mask.shape[1] / org_image_shape[1]
        cnts = cv2.findContours(target_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[-2]
        biggest_contour = max(cnts, key = cv2.contourArea)
        area = cv2.contourArea(biggest_contour)

        real_area = (area * x_factor * y_factor) * (pixel_spacing[0] * pixel_spacing[1])

        return round(real_area, 2)
    
    def call_llm(self, classifications: list, tumor_area: float) -> str:
        """
        Calls the LLM to generate a response based on the classifications and tumor area.

        Parameters:
        - classifications: List of tumor classifications.
        - tumor_area: Calculated area of the tumor.

        Returns:
        - Response from the LLM.
        """
        print('[INFO]: Calling LLM...')

        string_counts = Counter([cls for cls in classifications if cls != "No Tumor"])
        top_cls = string_counts.most_common(1)
        if not top_cls: return ""

        most_common_string, frequency = top_cls[0]
        prompt = LLMPPrompt.BRAIN_TUMOR.value.format(disease=most_common_string, tumor_area=tumor_area)

        json_data = {'input': prompt}

        response = requests.post(DLModelEndpoint.LLM.value, json=json_data)

        return response.json()['output']

    def predict(self, payload: tuple) -> tuple:
        """
        Predicts the tumor segmentation and classification.

        Parameters:
        - payload: A tuple containing folder path, accuracy threshold, and pixel spacing.

        Returns:
        - A tuple containing saved path, wanted slice indices, classifications, and LLM response.
        """
        folder_path, accuracy_threshold, pixel_spacing = payload
        input_feed, masks_array, org_image_shape = self.process_file(folder_path, accuracy_threshold)
        tumor_area = self.calculate_biggest_tumor_area(masks_array, org_image_shape, pixel_spacing)

        wanted_slices_indx = self.filter_slices(masks_array)
        print('wanted_slices_indx: ', wanted_slices_indx)
        save_path = 'brain_tumor_masks.npy'
        np.save(save_path, masks_array)
        classifications = self.classify(input_feed, wanted_slices_indx)

        llm_response = self.call_llm(classifications, tumor_area)
            
        return save_path, wanted_slices_indx, classifications, llm_response

    def encode_response(self, output: tuple) -> dict:
        """
        Encodes the response for the API.

        Parameters:
        - output: Tuple containing the saved path, slice indices, classifications, and LLM response.

        Returns:
        - Dictionary containing the encoded response.
        """
        save_path, wanted_slices_indx, classifications, llm_response = output
        prediction = [{"slice": indx, "classification": tumor} for (indx, tumor) in zip(wanted_slices_indx, classifications)]
        if not prediction: 
            save_path = None
        return {"output": save_path, "predictions": prediction, 'llm': llm_response}

if __name__ == "__main__":
    port, api_path = DLModelEndpoint.BRAIN_MRI.strip().split(":")[-1].split("/")
    server = ls.LitServer(BrainMRIAPI(), accelerator='cuda', devices=1, max_batch_size=1, api_path=f'/{api_path}')
    server.run(port=port)
