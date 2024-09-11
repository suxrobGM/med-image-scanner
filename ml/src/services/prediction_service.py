import requests
import logging
import os
import shutil
import cxr
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from fastapi import UploadFile
from uuid import UUID, uuid4
from zipfile import ZipFile
from dto import Result, UpdatePredictStatus
from dto.prediction_status import PredictionStatus
from dto.ml_model_type import MLModelType
from utils.dicom_utils import dicom_to_png
from utils.env_utils import getenv_required
from lit_serve.enums import DLModelEndpoint
from pathlib import Path

class PredictionService:
    _backend_url = getenv_required("BACKEND_URL")
    _logger = logging.getLogger(__name__)
    _temp_dir = Path("./temp")

    def __init__(self) -> None:
        self._temp_dir.mkdir(exist_ok=True, parents=True)

    def save_upload_file(self, file: UploadFile) -> str:
        """
        Save the uploaded file to the temp directory.
        Args:
            file: The upload file to save.
        Returns:
            str: The path to the saved file.
        """
        filename = file.filename or f"temp_{str(uuid4())}"
        file_path = self._temp_dir / filename

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return str(file_path.resolve())


    def process_zip_file(self, zip_filepath: str, convert_dicom_to_png=True) -> tuple | str | None:
        """Extracts a zip file then processes DICOM files to PNG.

        Args:
            zip_filepath (str): The path to the zip file to be extracted.

        Returns:
            str: The full path of the converted PNG images folder.
        """

        # Convert paths to pathlib.Path objects
        zip_filepath:Path = Path(zip_filepath)
        temp_dir = Path(self._temp_dir)

        # Extract folder name based on zip file name (without extension)
        extract_folder = zip_filepath.stem
        extract_path:Path = temp_dir / extract_folder
        extract_path.mkdir(exist_ok=True, parents=True)

        # Remove the existing folder if it exists
        if extract_path.exists():
            shutil.rmtree(extract_path)

        try:
            # Extract the zip file
            with ZipFile(zip_filepath, "r") as zip_ref:
                zip_ref.extractall(extract_path)

            if convert_dicom_to_png:
                # Process the DICOM files in the extracted folder
                dicom_files = extract_path.iterdir()
                spacing = None
                images_folder = extract_path / "images"
                for dicom_file in dicom_files:
                    file_path, spacing = dicom_to_png(dicom_file, images_folder, calc_pixel_spacing=spacing is None)

                return str(images_folder.resolve()), spacing
            else:
                return str(extract_folder.resolve())
            
        except Exception as e:
            self._logger.error(f"Error processing the zip file: {e}")
            self._logger.info(f"Cleaning up the extracted folder {extract_path}, and the zip file {zip_filepath}")
            zip_filepath.unlink()
            shutil.rmtree(extract_path)
            return None

    def predict(
            self, 
            model_type: MLModelType,
            series_id: UUID,
            modality: str,
            body_part: str | None,
            zip_file: str,
            accuracy_threshold: float = 0.7
        ) -> None:
        """
        Predict the images in the series using the specified ML model.
        Args:
            model_type: The type of the ML model to use for prediction.
            series_id: The ID of the series.
            modality: The modality of the series.
            body_part: The body part of the series.
            zip_file: The zip file containing the DICOM images.
        """
        
        if any(model_type == e for e in MLModelType):
            self.call_dl_model_api(model_type, zip_file, accuracy_threshold, series_id, modality, body_part)
        else:
            self._logger.error(f"Model type not supported: {model_type}")
            self._send_prediction_status(series_id, UpdatePredictStatus(model_type=model_type, status=PredictionStatus.FAILED))


    def get_model_endpoint(self, model_type: MLModelType) -> DLModelEndpoint:
        if model_type == MLModelType.CHEST_XRAY_CLASSIFICATION: 
            return DLModelEndpoint.CHEST_XRAY
        
        elif model_type == MLModelType.LUNG_TUMOR_SEGMENTATION:
            return DLModelEndpoint.LUNG_CT

        elif model_type == MLModelType.BRAIN_TUMOR_SEGMENTATION:
            return DLModelEndpoint.BRAIN_MRI

        elif model_type == MLModelType.ABDOMINAL_ORGANS_SEGMENTATION:
            return DLModelEndpoint.ABDOMINAL_ORGANS_SEGMENTATION

        else:
            types = [x.value for x in MLModelType]
            raise ValueError(f"Model Type must be one of these {types}")
        
    def call_dl_model_api(
            self,
            model_type: MLModelType,
            zip_filepath: str,
            accuracy_threshold: float,
            series_id: UUID,
            modality: str,
            body_part: str | None,
        ) -> None:
        """
        Predict the X-ray images in the series.
        Args:
            series_id: The ID of the series.
            modality: The modality of the series.
            body_part: The body part of the series.
            zip_filepath: The path to the zip file containing the DICOM images.
        """
        self._logger.info(f"Started predicting series: {series_id}, modality: {modality}, body_part: {body_part}, zip_filepath: {zip_filepath}")
        detected_diseases: dict[str, float] = {}        

        try:
            model_endpoint = self.get_model_endpoint(model_type)
            convert_dicom_to_png = (model_endpoint != DLModelEndpoint.ABDOMINAL_ORGANS_SEGMENTATION)
            result = self.process_zip_file(zip_filepath, convert_dicom_to_png=convert_dicom_to_png)
            if result is None:
                raise ValueError("images_folder doesn't exist and is None.")
            
            if convert_dicom_to_png: 
                images_folder, spacing = result
            else:
                images_folder = result

            payload = {'folder_path':images_folder, 'accuracy_threshold':accuracy_threshold, 'pixel_spacing':spacing}
            response = requests.post(model_endpoint.value, json=payload)
            
            predict_status = UpdatePredictStatus(
                model_type=model_type,
                status=PredictionStatus.COMPLETED,
                result=response.json(),
            )
            self._send_prediction_status(series_id, predict_status)
            self._logger.info(f"Prediction completed for series: {series_id}, modality: {modality}, predicted images: {len(detected_diseases)}")
        except Exception as e:
            self._logger.error(f"Prediction failed for series: {series_id}, modality: {modality}, error: {e}")
            predict_status = UpdatePredictStatus(
                model_type=model_type,
                status=PredictionStatus.FAILED,
            )
            self._send_prediction_status(series_id, predict_status)
        
    def _send_prediction_status(self, series_id: UUID, status: UpdatePredictStatus) -> Result:
        """
        Send the prediction status to the backend.
        Args:
            series_id: The ID of the series.
            status: The prediction status with the result.
        Returns:
            Result: The result of request.
        """
        url = f"{self._backend_url}/api/studies/series/{series_id}/status"
        headers = {"Content-Type": "application/json"}
        data = status.model_dump_json(by_alias=True)

        try:
            self._logger.info(f"Sending prediction status to the backend, series_id: {series_id}, data: {data}")
            response = requests.put(url, headers=headers, data=data)
            response.raise_for_status()
            self._logger.info("Prediction status sent to the backend successfully")
        except requests.HTTPError as e:
            self._logger.error(f"Failed to send prediction status to the backend: {e}")
            return Result.fail(str(e))
        return Result.succeed()
