from pathlib import Path
import litserve as ls
import requests
import torch
import numpy as np
from enums import DLModelEndpoint, DLModelWeights, LLMPPrompt
import cv2
from ultralytics import YOLO

# Define LitServe API for Chest CT
class ChestCTAPI(ls.LitAPI):
    def setup(self, device: str):
        """
        Setup the YOLO model for lung CT detection.

        Parameters:
        - device: The device on which the model will be loaded (e.g., 'cuda' or 'cpu').
        """
        # Load the model globally
        weights = DLModelWeights.LUNG_CT.value
        print("Loading YOLOv8 model...")
        model = YOLO(weights)
        if torch.cuda.is_available():
            model = model.cuda()
        
        print(f"YOLOv8 Model Loaded In {model.device.type.upper()}.")
        self.model = model

    def decode_request(self, request: dict) -> tuple:
        """
        Decodes the incoming request to extract folder path, accuracy threshold, and pixel spacing.

        Parameters:
        - request: Dictionary containing the request parameters.

        Returns:
        - A tuple containing folder path, accuracy threshold, and pixel spacing.
        """
        return request["folder_path"], request.get("accuracy_threshold", 0.5), request.get('pixel_spacing', [0.5, 0.5])  # in mm

    def predict(self, payload: tuple) -> tuple:
        """
        Run the YOLO model prediction.

        Parameters:
        - payload: A tuple containing folder path, accuracy threshold, and pixel spacing.

        Returns:
        - A tuple containing the prediction results and pixel spacing.
        """
        folder_path, accuracy_threshold, pixel_spacing = payload
        results = self.model.predict(folder_path, conf=accuracy_threshold, stream=True)  # list of Results objects
        return results, pixel_spacing

    def encode_response(self, payload: tuple) -> dict:
        """
        Encodes the response after model prediction.

        Parameters:
        - payload: A tuple containing the model output and pixel spacing.

        Returns:
        - Dictionary containing the generated mask, confidences, and LLM response.
        """
        masks = []
        confidences = []
        save_folder = None
        output, pixel_spacing = payload
        areas = []
        for result in output:
            gen_mask = np.zeros(result.orig_shape, dtype=np.uint8)
            if save_folder is None:
                save_folder = Path(result.path).parent
            if result.masks is not None:
                for mask in result.masks:
                    points = np.array(mask.xy, dtype=int)
                    cv2.drawContours(gen_mask, [points], -1, 255, -1)
                    areas.append(cv2.contourArea(points))

            # Resize the generated masks to have the same shape so that we can stack them in a single numpy array
            gen_mask = cv2.resize(gen_mask, (640, 640))
            masks.append(gen_mask)
            if result.boxes is not None and len(result.boxes) > 0:
                confidences.extend(result.boxes.conf.cpu().numpy().tolist())
            else:
                confidences.append(-1)
        if not areas:
            llm_response = ""
        else:
            print('[INFO]: Calling LLM...')
            max_area = max(areas)
            real_area = max_area * (pixel_spacing[0] * pixel_spacing[1])  # in mm²
            real_area = round(real_area, 2)
            prompt = LLMPPrompt.LUNG_TUMOR.value.format(tumor_area=real_area)
            json_data = {'input': prompt}
            llm_response = requests.post(DLModelEndpoint.LLM.value, json=json_data).json()['output']
        
        masks_array = np.array(masks, dtype=np.uint8)
        save_path = save_folder / 'chest_ct_masks.npy'
        save_path = str(save_path.resolve())
        np.save(save_path, masks_array)
        print('llm_response: ', llm_response)
        
        return {
            "output": save_path,
            "accuracy": confidences,
            'llm': llm_response
        }

if __name__ == "__main__":
    # Run the server with specified parameters
    port, api_path = DLModelEndpoint.LUNG_CT.strip().split(":")[-1].split("/")
    server = ls.LitServer(ChestCTAPI(), accelerator='cuda', devices=1, max_batch_size=1, api_path=f'/{api_path}')
    server.run(port=port)