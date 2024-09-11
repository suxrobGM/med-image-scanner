from datetime import date
from application.models import PatientDto
from application.services.dicom import DicomStudy
from domain.entities import Study
from .base_model import BaseModel


class StudyDto(BaseModel):
    id: str
    study_instance_uid: str
    accession_number: str | None = None
    study_date: date | None = None
    description: str | None = None
    modalities: str | None = None
    series_count: int 
    instances_count: int 
    patient: PatientDto

    @staticmethod
    def from_entity(entity: Study) -> "StudyDto":
        return StudyDto(
            id=str(entity.id),
            study_instance_uid=entity.study_instance_uid,
            accession_number=entity.accession_number,
            study_date=entity.study_date,
            description=entity.description,
            modalities=entity.modalities,
            series_count=entity.series_count,
            instances_count=entity.instances_count,
            patient=PatientDto.from_entity(entity.patient)
        )
    
    @staticmethod
    def from_dicom_study(dicom_study: DicomStudy) -> "StudyDto":
        return StudyDto(
            id="",
            study_instance_uid=dicom_study.study_instance_uid,
            accession_number=dicom_study.accession_number,
            study_date=dicom_study.study_date,
            description=dicom_study.description,
            modalities=dicom_study.modalities,
            series_count=dicom_study.series,
            instances_count=dicom_study.instances,
            patient=PatientDto.from_dicom_patient(dicom_study.patient)
        )
