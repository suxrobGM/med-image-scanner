from datetime import date
from pydantic import BaseModel
from .dicom_patient import DicomPatient

class DicomStudy(BaseModel):
    study_instance_uid: str
    patient: DicomPatient
    description: str | None = None
    accession_number: str | None = None
    study_date: date | None = None
    modalities: str
    series: int
    instances: int
