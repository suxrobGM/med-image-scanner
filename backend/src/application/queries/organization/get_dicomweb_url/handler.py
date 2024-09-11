from core import RequestHandler, ResultWithData, Mediator
from application.models import DicomWebUrlDto
from application.services import OrganizationService
from .query import GetOrgDicomWebUrlQuery


@Mediator.register_handler(GetOrgDicomWebUrlQuery)
class GetOrgDicomWebUrlHandler(RequestHandler[GetOrgDicomWebUrlQuery, ResultWithData[DicomWebUrlDto]]):
    def __init__(self, org_service: OrganizationService):
        self.org_service = org_service

    def handle(self, req: GetOrgDicomWebUrlQuery) -> ResultWithData[DicomWebUrlDto]:
        organization = self.org_service.get_organization(req.org_id)

        if not organization:
            return ResultWithData.fail(f"Organization with ID '{req.org_id}' not found")

        dicom_web_url = DicomWebUrlDto(
            qido_root=organization.dicom_url,
            wado_root=organization.dicom_url,
            wado_uri_root=organization.dicom_url,
        )
        return ResultWithData.succeed(dicom_web_url)
        
