from datetime import date
from application.services.dicom import DicomSeries
from domain.entities import Series
from domain.enums import PredictionStatus, MLModelType
from .base_model import BaseModel


class SeriesDto(BaseModel):
    id: str
    study_instance_uid: str
    series_instance_uid: str
    series_number: int
    modality: str
    description: str | None = None
    body_part: str | None = None
    instances_count: int
    series_date: date | None = None
    report_id: str | None = None
    prediction_model: MLModelType | None = None
    prediction_status: PredictionStatus = PredictionStatus.NOT_STARTED
    prediction_result: dict | None = None

    @staticmethod
    def from_entity(entity: Series) -> "SeriesDto":
        return SeriesDto(
            id=str(entity.id),
            study_instance_uid=entity.study.study_instance_uid,
            series_instance_uid=entity.series_instance_uid,
            series_number=entity.series_number,
            modality=entity.modality,
            description=entity.description,
            body_part=entity.body_part,
            instances_count=entity.instances_count,
            series_date=entity.series_date,
            report_id=str(entity.report.id) if entity.report else None,
            prediction_status=entity.prediction_status,
            prediction_model=entity.prediction_model,
            prediction_result=entity.prediction_result,
        )
    
    @staticmethod
    def from_dicom_series(dicom_series: DicomSeries) -> "SeriesDto":
        return SeriesDto(
            id=dicom_series.series_instance_uid,
            study_instance_uid=dicom_series.study_instance_uid,
            series_instance_uid=dicom_series.series_instance_uid,
            series_number=dicom_series.series_number,
            modality=dicom_series.modality,
            description=dicom_series.description,
            body_part=dicom_series.body_part,
            instances_count=dicom_series.instances,
            series_date=dicom_series.series_date,
        )
