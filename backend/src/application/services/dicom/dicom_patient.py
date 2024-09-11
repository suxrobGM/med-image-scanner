
from datetime import date
from pydantic import BaseModel
from domain.enums import Gender

class DicomPatient(BaseModel):
    id: str
    name: str
    gender: Gender | None = None
    birth_date: date | None = None
