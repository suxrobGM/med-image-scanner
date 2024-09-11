from core import Command, Result
from domain.enums import PredictionStatus, MLModelType

class UpdatePredictStatusPayload(Command[Result]):
    status: PredictionStatus
    model_type: MLModelType
    result: dict | None = None

class UpdatePredictionStatusCommand(UpdatePredictStatusPayload):
    series_id: str
