from uuid import UUID
from .base_model import BaseModel
from .ml_model_type import MLModelType

class PredictSeriesQuery(BaseModel):
    series_id: UUID
    modality: str # CT, PT, MR, etc.
    model_type: MLModelType
    body_part: str | None # Optional, Neck, Chest, Abdomen, None
