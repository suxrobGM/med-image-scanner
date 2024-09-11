import logging
import os
from core import RequestHandler, Result, Mediator
from application.services import OrganizationService, MLService, PatientService
from application.services.dicom import DicomService
from domain.entities import Series, Study, Organization
from domain.enums import PredictionStatus, MLModelType
from infrastructure import UnitOfWork
from .command import PredictSeriesCommand

@Mediator.register_handler(PredictSeriesCommand)
class PredictSeriesHandler(RequestHandler[PredictSeriesCommand, Result]):
    def __init__(
            self,
            uow: UnitOfWork,
            dicom_service: DicomService,
            org_service: OrganizationService,
            patient_service: PatientService,
            ml_service: MLService,
        ) -> None:
        self.uow = uow
        self.dicom_service = dicom_service
        self.org_service = org_service
        self.ml_service = ml_service
        self.patient_service = patient_service
        self.logger = logging.getLogger(__name__)

    def handle(self, req: PredictSeriesCommand) -> Result:
        if not MLModelType.has_value(req.model_type):
            return Result.fail("Invalid model type")

        organization = self.org_service.get_organization(req.organization)

        if not organization:
            return Result.fail("Organization with ID '{req.organization}' not found")

        series = self.get_series_from_db(req)

        if series and series.prediction_status == PredictionStatus.COMPLETED and not req.predict_again:
            return Result.succeed()

        # Download the DICOM instances and zip them
        download_result = self.dicom_service.download_and_zip_instances(organization.dicom_url, req.study_instance_uid, req.series_instance_uid)

        if not download_result.success and download_result.error:
            return Result.fail(download_result.error)
        
        if not download_result.data:
            return Result.fail("Could not download DICOM instances and zip them")
        
        self.logger.info(f"Downloaded and zipped DICOM instances for series with ID '{req.series_instance_uid}'")
        
        # Create a new series if it does not exist
        if not series:
            series = self.create_series(req, organization)

        # Send the zip file of the series to the ML service for prediction
        send_result = self.ml_service.send_for_prediction(series, req.model_type, download_result.data)

        if not send_result.success and send_result.error:
            self.update_predict_status(series, PredictionStatus.FAILED)
            self.remove_file(download_result.data, req.series_instance_uid)
            return Result.fail(send_result.error)
        
        self.update_predict_status(series, PredictionStatus.IN_PROGRESS)
        self.remove_file(download_result.data, req.series_instance_uid)
        self.logger.info(f"Prediction started for series with ID '{req.series_instance_uid}'")
        return Result.succeed()
    
    def create_series(self, req: PredictSeriesCommand, organization: Organization) -> Series:
        study_repo = self.uow.get_repository(Study)
        study = study_repo.get_one(Study.study_instance_uid == req.study_instance_uid)

        # Create a new study if it does not exist
        if not study:
            study = self.patient_service.create_study(req.study_instance_uid, organization)
            self.logger.info(f"Created study with ID '{req.study_instance_uid}' for organization '{organization.id}'")

        series = self.patient_service.create_series(req.series_instance_uid, study, organization)
        self.logger.info(f"Created series with ID '{req.series_instance_uid}' for study '{req.study_instance_uid}'")
        return series
    
    def update_predict_status(self, series: Series, status: PredictionStatus) -> None:
        series.prediction_status = status
        series_repo = self.uow.get_repository(Series)
        series_repo.update(series)
        self.uow.commit()
        self.logger.info(f"Updated prediction status for series with ID '{series.series_instance_uid}' to '{status}'")
    
    def get_series_from_db(self, req: PredictSeriesCommand) -> Series | None:
        series_repo = self.uow.get_repository(Series)
        series = series_repo.get_one(
            Series.study_instance_uid == req.study_instance_uid and 
            Series.series_instance_uid == req.series_instance_uid
        )
        return series
    
    def remove_file(self, file_path: str, series_instance_uid: str) -> None:
        if os.path.exists(file_path):
            os.remove(file_path)
            self.logger.info(f"Removed zip file for series with ID '{series_instance_uid}'")
