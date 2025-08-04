from collections import Counter
from pathlib import Path
import litserve as ls
import requests
import torch
import torchxrayvision as xrv
import numpy as np
import skimage
from enums import DLModelEndpoint, DLModelWeights, LLMPPrompt


# Define LitServe API for processing chest X-ray images
class ChestXRayAPI(ls.LitAPI):

    def predict_skimage(self, folder_path: str, accuracy_threshold: float) -> tuple:
        """
        Predicts the presence of pathologies in X-ray images from a given folder.
        Takes the folder path containing the images and an accuracy threshold.
        Returns a list of dictionaries, each containing slice index, classification, and accuracy.
        """
        img: np.ndarray = self.preprocess(folder_path)  # Preprocess images from the folder

        with torch.no_grad():  # Disable gradient calculation for inference
            img = torch.from_numpy(img)  # Convert numpy array to torch tensor
            
            if len(img.shape) == 3:  # Check if the image has 3 dimensions (H, W, C)
                img = img.unsqueeze(0)  # Add a batch dimension

            if torch.cuda.is_available():  # Check if CUDA (GPU) is available
                img = img.cuda()  # Move image tensor to GPU

            preds: torch.Tensor = self.model(img).cpu()  # Get model predictions and move them to CPU
            return self.postprocess(preds, accuracy_threshold)  # Postprocess predictions

    def grab_and_resize_images(self, folder_path: str, img_size: tuple = (224, 224)) -> list:
        """
        Grab all the images in the given folder name, then resize each image to the specified `img_size`.
        """
        all_images: list = []  # Initialize list to store images
        for img_path in Path(folder_path).glob('*'):  # Iterate over all files in the folder
            if img_path.suffix.lower() not in ['.png', '.jpeg', '.jpg']: 
                continue  # Filter images by extension
            img: np.ndarray = skimage.io.imread(img_path, as_gray=True)  # Read image as grayscale
            img = skimage.transform.resize(img, img_size, anti_aliasing=True)  # Resize image to 224x224
            img = img[None, :, :]  # Add color channel as 1 (for grayscale)
            all_images.append(img)  # Append processed image to list
        
        return all_images
    
    def preprocess(self, folder_path: str) -> np.ndarray:
        """
        Preprocesses all images in the specified folder.
        Converts images to grayscale, resizes them, and normalizes the pixel values.
        Returns the processed images as a numpy array.
        """
        all_images = self.grab_and_resize_images(folder_path)
        arr: np.ndarray = np.array(all_images, dtype=np.uint8)  # Convert list to numpy array
        arr = xrv.datasets.normalize(arr, 255)  # Normalize the array values
        return arr  # Return the preprocessed images as numpy array
    
    def call_llm(self, classifications: list[str]) -> str:
        """
        Calls the LLM to provide an output based on the classified pathologies.

        Parameters:
        - classifications: List of classified pathologies.

        Returns:
        - The LLM's response as a string.
        """
        print('[INFO]: Calling LLM...')
        
        # Count the occurrences of each classification string
        string_counts = Counter([cls for cls in classifications])
    
        # Find the most common classification
        top_cls = string_counts.most_common(1)
        if not top_cls: 
            return ""

        most_common_string, frequency = top_cls[0]
        prompt = LLMPPrompt.CHEST_XRAY.value.format(disease=most_common_string)

        json_data = {'input': prompt}
        response = requests.post(DLModelEndpoint.LLM.value, json=json_data)

        return response.json()['output']

    def postprocess(self, model_output_tensor: torch.Tensor, accuracy_threshold: float) -> tuple:
        """
        Postprocesses the output of the model by extracting and filtering predictions.
        Each prediction is associated with a pathology and its accuracy.
        Returns a list of dictionaries with slice index, classification, and accuracy.
        """
        output: list = []  # Initialize output list
        pathologies: list = self.model.pathologies  # Get the list of pathologies from the model
        all_predictions: np.ndarray = model_output_tensor.detach().numpy()  # Convert tensor to numpy array
        top_ones = []
        
        for indx, item in enumerate(all_predictions):  # Iterate over all predictions
            res: list = sorted(zip(pathologies, item.tolist()), key=lambda x: x[1], reverse=True)  # Sort predictions by accuracy
            top_prediction, top_accuracy = res[0]  # Get the top prediction and its accuracy
            top_ones.append(top_prediction)
            
            if top_accuracy < accuracy_threshold:  # Filter out predictions below the accuracy threshold
                continue

            output.append({  # Append the prediction to the output list
                'slice': indx,  # Image slice index
                "classification": f"{top_prediction} | {res[1][0]}",  # Top 2 predictions
                "accuracy": top_accuracy  # Accuracy of the top prediction
            })
        
        llm_res = self.call_llm(top_ones)
        return output, llm_res  # Return the final output list

    def setup(self, device: str) -> None:
        """
        Sets up the model for inference by loading the pre-trained weights.
        If a GPU is available, the model is moved to the GPU.
        """
        weights: str = DLModelWeights.CHEST_XRAY.value  # Define the weights to be loaded
        model: torch.nn.Module = xrv.models.get_model(weights)  # Load the model with the specified weights
        if torch.cuda.is_available():  # Check if CUDA (GPU) is available
            model = model.cuda()  # Move the model to GPU
        
        print("[INFO]: X-Ray Model Loaded")  # Print a loading confirmation message
        self.model: torch.nn.Module = model  # Store the model as a class attribute

    def decode_request(self, request: dict) -> tuple:
        """
        Decodes the incoming request to extract necessary parameters.
        Returns a tuple containing the folder path and accuracy threshold.
        """
        return (request["folder_path"], request.get('accuracy_threshold', 0.6))  # Extract and return parameters

    def predict(self, params: tuple) -> tuple:
        """
        Receives the parameters and calls the prediction method.
        Returns the prediction results as a list of dictionaries.
        """
        folder_path, accuracy_threshold = params  # Unpack parameters
        return self.predict_skimage(folder_path, accuracy_threshold)  # Make predictions and return the result

    def encode_response(self, payload: tuple) -> dict:
        """
        Encodes the prediction results into a response dictionary.
        Returns the dictionary containing the output list.
        """
        output, llm_res = payload
        return {"output": output, 'llm': llm_res}  # Return the output wrapped in a dictionary

# Start the server
if __name__ == "__main__":
    port, api_path = DLModelEndpoint.CHEST_XRAY.strip().split(":")[-1].split("/")
    server: ls.LitServer = ls.LitServer(ChestXRayAPI(), accelerator='cuda', devices=1, max_batch_size=1, api_path=f'/{api_path}')  # Initialize and configure the server
    server.run(port=port)
