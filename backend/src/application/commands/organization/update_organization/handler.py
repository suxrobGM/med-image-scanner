from core import RequestHandler, Result, Mediator
from application.services.dicom import DicomService
from application.utils.validators import valid_email, valid_url, valid_org_name
from domain.entities import Organization
from infrastructure import UnitOfWork
from .command import UpdateOrganizationCommand


@Mediator.register_handler(UpdateOrganizationCommand)
class UpdateOrganizationHandler(RequestHandler[UpdateOrganizationCommand, Result]):
    def __init__(self, uow: UnitOfWork, dicom_service: DicomService):
        self.uow = uow
        self.dicom_service = dicom_service

    def handle(self, req: UpdateOrganizationCommand) -> Result:
        org_repo = self.uow.get_repository(Organization)
        organization = org_repo.get_one(Organization.id == req.id)

        if not organization:
            return Result.fail(f"Organization with ID '{req.id}' not found")
        
        if req.name and req.name != organization.name:
            if not valid_org_name(req.name):
                return Result.fail("Invalid organization name")

            if org_repo.exists(Organization.name == req.name):
                return Result.fail("Organization with the same name already exists")

            organization.name = req.name

        if req.display_name and req.display_name != organization.display_name:
            organization.display_name = req.display_name

        if req.website and req.website != organization.website:
            if not valid_url(req.website):
                return Result.fail("Invalid website URL")
            organization.website = req.website

        if req.phone and req.phone != organization.phone:
            organization.phone = req.phone
        
        if req.email and req.email != organization.email:
            if not valid_email(req.email):
                return Result.fail("Invalid email address")
            organization.email = req.email

        if req.address and req.address != organization.address:
            organization.address = req.address

        if req.dicom_url and req.dicom_url != organization.dicom_url:
            if not valid_url(req.dicom_url):
                return Result.fail("Invalid DICOM URL")
            
            if not self.dicom_service.verify_qido_support(req.dicom_url):
                return Result.fail("The DICOM server does not support QIDO-RS, make sure the provided URL is accessible by /studies endpoint")
            
            organization.dicom_url = req.dicom_url

        org_repo.update(organization)
        self.uow.commit()
        return Result.succeed()
