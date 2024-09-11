from core import RequestHandler, Result, Mediator
from application.services import OrganizationService
from domain.entities import User, Organization
from domain.entities.user_role import UserRole
from infrastructure import UnitOfWork
from .command import UpdateUserOrgCommand

@Mediator.register_handler(UpdateUserOrgCommand)
class UpdateUserOrgHandler(RequestHandler[UpdateUserOrgCommand, Result]):
    def __init__(
            self, 
            uow: UnitOfWork,
            org_service: OrganizationService,
        ) -> None:
        self.uow = uow
        self.org_service = org_service

    def handle(self, req: UpdateUserOrgCommand) -> Result:
        user_repo = self.uow.get_repository(User)
        user = user_repo.get_one(User.id == req.user_id)

        if not user:
            return Result.fail(f"User with ID '{req.user_id}' not found")
        
        # Update organization for user
        if req.organization:
            organization = self.org_service.get_organization(req.organization)

            if not organization:
                return Result.fail(f"Organization with ID '{req.organization}' not found")
            
            user.organization = organization
        
        # Remove organization from user if it exists
        if user.organization and not req.organization:
            self._remove_user_role(user)
            user.organization = None

        self.uow.commit()
        return Result.succeed()
    
    def _remove_user_role(self, user: User) -> None:
        """Remove user organization role if it exists"""
        if not user.role:
            return

        if user.role.organization_id:
            self.uow.get_repository(UserRole).delete_by_id(user.role.id)
            user.role = None

