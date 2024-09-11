from core import Command, Result
from domain.enums import MLModelType

class PredictSeriesCommand(Command[Result]):
    organization: str
    study_instance_uid: str
    series_instance_uid: str
    model_type: MLModelType
    body_part: str | None = None
    predict_again: bool = False
    """If series has already been predicted, then predict again"""
