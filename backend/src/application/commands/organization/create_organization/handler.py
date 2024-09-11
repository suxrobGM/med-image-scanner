from core import RequestHandler, Result, Mediator
from application.services.dicom import DicomService
from application.utils.validators import valid_email, valid_url, valid_org_name
from domain.entities import Organization
from infrastructure import UnitOfWork
from .command import CreateOrganizationCommand

@Mediator.register_handler(CreateOrganizationCommand)
class CreateOrganizationHandler(RequestHandler[CreateOrganizationCommand, Result]):
    def __init__(self, uow: UnitOfWork, dicom_service: DicomService):
        self.uow = uow
        self.dicom_service = dicom_service

    def handle(self, req: CreateOrganizationCommand) -> Result:
        org_repo = self.uow.get_repository(Organization)

        if not valid_org_name(req.name):
            return Result.fail("Invalid organization name")

        if org_repo.exists(Organization.name == req.name):
            return Result.fail("Organization with the same name already exists")
        
        if not valid_url(req.dicom_url):
            return Result.fail("Invalid DICOM URL")
        
        if not self.dicom_service:
            return Result.fail("The DICOM server does not support QIDO-RS, make sure the provided URL is accessible by /studies endpoint")
        
        if req.website and not valid_url(req.website):
            return Result.fail("Invalid website URL")
        
        if req.email and not valid_email(req.email):
            return Result.fail("Invalid email address")

        if org_repo.exists(Organization.name == req.name):
            return Result.fail("Organization with the same name already exists")

        organization = Organization(
            name=req.name,
            display_name=req.display_name,
            website=req.website,
            phone=req.phone,
            email=req.email,
            address=req.address,
            dicom_url=req.dicom_url,
        )

        org_repo.add(organization)
        self.uow.commit()
        return Result.succeed()
