from datetime import date
from application.services.dicom import DicomPatient
from domain.entities import Patient
from .base_model import BaseModel


class PatientDto(BaseModel):
    id: str
    mrn: str
    name: str
    gender: str | None = None
    birth_date: date | None = None

    @staticmethod
    def from_entity(entity: Patient) -> "PatientDto":
        return PatientDto(
            id=str(entity.id),
            mrn=entity.mrn,
            name=entity.name,
            birth_date=entity.birth_date,
            gender=entity.gender,
        )
    
    @staticmethod
    def from_dicom_patient(dicom_patient: DicomPatient) -> "PatientDto":
        return PatientDto(
            id="",
            mrn=dicom_patient.id,
            name=dicom_patient.name,
            gender=dicom_patient.gender,
            birth_date=dicom_patient.birth_date,
        )
