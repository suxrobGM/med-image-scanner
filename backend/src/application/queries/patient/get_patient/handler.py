from core import RequestHandler, ResultWithData, Mediator
from application.models import PatientDto
from application.services import OrganizationService, PatientService
from application.services.dicom import DicomService
from domain.entities import Organization
from infrastructure import UnitOfWork
from .query import GetPatientQuery


@Mediator.register_handler(GetPatientQuery)
class GetPatientHandler(RequestHandler[GetPatientQuery, ResultWithData[PatientDto]]):
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

    def handle(self, req: GetPatientQuery) -> ResultWithData[PatientDto]:
        organization = self.org_service.get_organization(req.organization)

        if not organization:
            return ResultWithData.fail("Organization with ID '{req.organization}' not found")

        # First, try to get patient from the database
        patient_from_db = self.get_patient_from_db(req.patient_id, organization)

        if patient_from_db.success:
            return patient_from_db
        
        # If no patient was found in the database, try to get them from the DICOM server
        return self.get_patient_from_dicom(req.patient_id, organization)
    
    def get_patient_from_db(self, patient_id: str, organization: Organization) -> ResultWithData[PatientDto]:
        patient = self.patient_service.get_patient(patient_id, organization.id)

        if not patient:
            return ResultWithData.fail(f"Patient with ID '{patient_id}' not found")

        return ResultWithData.succeed(PatientDto.from_entity(patient))
    
    def get_patient_from_dicom(self, patient_id: str, organization: Organization) -> ResultWithData[PatientDto]:
        if not organization.dicom_url:
            return ResultWithData.fail("Organization does not have a DICOM URL")

        result = self.dicom_service.get_patient(organization.dicom_url, patient_id)

        if not result.success and result.error:
            return ResultWithData.fail(result.error)
        
        if not result.data:
            return ResultWithData.fail(f"Patient with ID '{patient_id}' not found")

        return ResultWithData.succeed(PatientDto.from_dicom_patient(result.data))
