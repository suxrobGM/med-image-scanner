from core import RequestHandler, ResultWithArray, Mediator
from application.models import StudyDto
from application.services import OrganizationService, PatientService
from application.services.dicom import DicomService
from domain.entities import Organization
from infrastructure import UnitOfWork
from .query import GetStudiesQuery


@Mediator.register_handler(GetStudiesQuery)
class GetStudiesHandler(RequestHandler[GetStudiesQuery, ResultWithArray[StudyDto]]):
    def __init__(
        self,
        uow: UnitOfWork,
        dicom_service: DicomService,
        org_service: OrganizationService,
        patient_service: PatientService,
    ) -> None:
        self.uow = uow
        self.dicom_service = dicom_service
        self.org_service = org_service
        self.patient_service = patient_service

    def handle(self, req: GetStudiesQuery) -> ResultWithArray[StudyDto]:
        organization = self.org_service.get_organization(req.organization)

        if not organization:
            return ResultWithArray.fail("Organization with ID '{req.organization}' not found")

        # First, try to get studies from the database
        studies_from_db = self.get_studies_from_db(req.patient_id, organization)
        
        # Then, try to get studies from the DICOM server
        studies_from_dicom_result = self.get_studies_from_dicom(req.patient_id, organization)

        if not studies_from_dicom_result.success or not studies_from_dicom_result.data:
            return ResultWithArray.fail(studies_from_dicom_result.error)

        merged_studies = self.merge_studies(studies_from_db, studies_from_dicom_result.data)
        return ResultWithArray.succeed(merged_studies)

    def merge_studies(self, studies_from_db: list[StudyDto], studies_from_dicom: list[StudyDto]) -> list[StudyDto]:
        unique_studies: dict[str, StudyDto] = {}

        # Add studies from the database to the dictionary
        for study in studies_from_db:
            unique_studies[study.study_instance_uid] = study

        # Add studies from the DICOM server to the dictionary if not already present
        for study in studies_from_dicom:
            if study.study_instance_uid not in unique_studies:
                unique_studies[study.study_instance_uid] = study

        # Convert the dictionary values back to a list
        merged_studies = list(unique_studies.values())
        return merged_studies   

    def get_studies_from_db(self, patient_id: str, organization: Organization) -> list[StudyDto]:
        studies = self.patient_service.get_patient_studies(patient_id, organization.id)
        studies_dto = [StudyDto.from_entity(study) for study in studies]
        return studies_dto 
    
    def get_studies_from_dicom(self, patient_id: str, organization: Organization) -> ResultWithArray[StudyDto]:
        if not organization.dicom_url:
            return ResultWithArray.fail("Organization does not have a DICOM URL")

        result = self.dicom_service.get_studies(organization.dicom_url, patient_id)

        if not result.success:
            return ResultWithArray.fail(result.error)
        
        if not result.data or len(result.data) == 0:
            return ResultWithArray.fail(f"No studies found for patient with ID '{patient_id}'")
        
        studies_dto = [StudyDto.from_dicom_study(study) for study in result.data]
        return ResultWithArray.succeed(studies_dto)
