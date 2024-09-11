from core import RequestHandler, ResultWithArray, Mediator
from application.models import SeriesDto
from application.services import OrganizationService
from application.services.dicom import DicomService
from application.utils import valid_uuid
from domain.entities import Series, Organization
from infrastructure import UnitOfWork
from .query import GetStudySeriesQuery


@Mediator.register_handler(GetStudySeriesQuery)
class GetStudySeriesHandler(RequestHandler[GetStudySeriesQuery, ResultWithArray[SeriesDto]]):
    def __init__(
        self,
        uow: UnitOfWork,
        dicom_service: DicomService,
        org_service: OrganizationService
    ) -> None:
        self.uow = uow
        self.dicom_service = dicom_service
        self.org_service = org_service

    def handle(self, req: GetStudySeriesQuery) -> ResultWithArray[SeriesDto]:
        organization = self.org_service.get_organization(req.organization)

        if not organization:
            return ResultWithArray.fail("Organization with ID '{req.organization}' not found")

        # First, try to get series from the database
        series_from_db = self.get_series_from_db(req.study_id)
        
        # Then, try to get series from the DICOM server
        series_from_dicom_result = self.get_series_from_dicom(req.study_id, organization)

        if not series_from_dicom_result.success or not series_from_dicom_result.data:
            return ResultWithArray.fail(series_from_dicom_result.error)
        
        merged_series = self.merge_series(series_from_db, series_from_dicom_result.data)
        return ResultWithArray.succeed(merged_series)
    
    def merge_series(self, series_from_db: list[SeriesDto], series_from_dicom: list[SeriesDto]) -> list[SeriesDto]:
        unique_series: dict[str, SeriesDto] = {}

        # Add series from the database to the dictionary
        for series in series_from_db:
            unique_series[series.series_instance_uid] = series

        # Add series from the DICOM server to the dictionary if not already present
        for series in series_from_dicom:
            if series.series_instance_uid not in unique_series:
                unique_series[series.series_instance_uid] = series

        # Convert the dictionary values back to a list
        merged_series = list(unique_series.values())
        return merged_series
    
    def get_series_from_db(self, study_id: str) -> list[SeriesDto]:
        series_repo = self.uow.get_repository(Series)

        if valid_uuid(study_id):
            series = series_repo.get_list(Series.study_id == study_id)
        else:
            series = series_repo.get_list(Series.study_instance_uid == study_id)

        series_dto = [SeriesDto.from_entity(series) for series in series]
        return series_dto
    
    def get_series_from_dicom(self, study_instance_uid: str, organization: Organization) -> ResultWithArray[SeriesDto]:
        if not organization.dicom_url:
            return ResultWithArray.fail("Organization does not have a DICOM URL")

        result = self.dicom_service.get_series(organization.dicom_url, study_instance_uid)

        if not result.success:
            return ResultWithArray.fail(result.error)
        
        if not result.data or len(result.data) == 0:
            return ResultWithArray.fail(f"No series found for study with ID '{study_instance_uid}' in the DICOM server")
        
        series_dto = [SeriesDto.from_dicom_series(series) for series in result.data]
        return ResultWithArray.succeed(series_dto)
