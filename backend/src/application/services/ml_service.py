import logging
import requests
from core import DIContainer, Result
from application.utils import getenv_required
from domain.entities import Series
from domain.enums import MLModelType

@DIContainer.register_singleton()
class MLService:
    _logger = logging.getLogger(__name__)
    _ml_app_url = getenv_required("ML_APP_URL")

    def send_for_prediction(self, series: Series, model_type: MLModelType, series_zip_file: str) -> Result:
        """
        Send a zipped series to the ML service for prediction.
        Args:
            series (Series): The series to send for prediction.
            model_type (MLModelType): The type of the model to use for prediction.
            series_zip_file (str): The path to the zipped series to send.
        Returns:
            Result: The result of the operation.
        """
        
        try:
            with open(series_zip_file, "rb") as file:
                files = {"file": file}
                url = f"{self._ml_app_url}/predict?seriesId={str(series.id)}&modality={series.modality}&modelType={model_type.value}&bodyPart={series.body_part}"

                self._logger.info(f"Sending series '{series.id}' for prediction to URL: {url}")
                response = requests.post(url, files=files)

                if response.status_code != 200:
                    self._logger.error(f"Failed to send series for prediction: {response.text}")
                    return Result.fail(f"Failed to send series for prediction: {response.text}")
                
                self._logger.info(f"Series '{series.id}' sent for prediction")
                return Result.succeed()
        except Exception as e:
            self._logger.error(f"Failed to send series for prediction: {str(e)}")
            return Result.fail(f"Failed to send series for prediction: {str(e)}")

