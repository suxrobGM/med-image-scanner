from core import RequestHandler, ResultWithData, Mediator
from application.models import OrganizationDto
from application.services import OrganizationService
from .query import GetOrganizationQuery


@Mediator.register_handler(GetOrganizationQuery)
class GetOrganizationHandler(RequestHandler[GetOrganizationQuery, ResultWithData[OrganizationDto]]):
    def __init__(self, org_service: OrganizationService):
        self.org_service = org_service

    def handle(self, req: GetOrganizationQuery) -> ResultWithData[OrganizationDto]:
        organization = self.org_service.get_organization(req.id)

        if not organization:
            return ResultWithData.fail(f"Organization with ID '{req.id}' not found")

        organization_dto = OrganizationDto.from_entity(organization)
        return ResultWithData.succeed(organization_dto)
        
