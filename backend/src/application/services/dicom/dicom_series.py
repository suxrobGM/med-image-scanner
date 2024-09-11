from datetime import date
from pydantic import BaseModel

class DicomSeries(BaseModel):
    series_instance_uid: str
    study_instance_uid: str
    series_number: int
    modality: str
    description: str | None = None
    body_part: str | None = None
    instances: int
    series_date: date | None = None
