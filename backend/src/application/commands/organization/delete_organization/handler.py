from core import RequestHandler, Result, Mediator
from domain.entities import Organization
from infrastructure import UnitOfWork
from .command import DeleteOrganizationCommand


@Mediator.register_handler(DeleteOrganizationCommand)
class DeleteOrganizationHandler(RequestHandler[DeleteOrganizationCommand, Result]):
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def handle(self, req: DeleteOrganizationCommand) -> Result:
        org_repo = self.uow.get_repository(Organization)

        organization = org_repo.get_one(Organization.id == req.id)

        if not organization:
            return Result.fail(f"Organization with id '{req.id}' not found")
        
        org_repo.delete_by_id(organization.id)
        self.uow.commit()
        return Result.succeed()
