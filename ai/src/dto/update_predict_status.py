from .base_model import BaseModel
from .ml_model_type import MLModelType
from .prediction_status import PredictionStatus


class UpdatePredictStatus(BaseModel):
    """Notify the backend about the status of a prediction"""
    model_type: MLModelType
    status: PredictionStatus
    result: dict | None = None
