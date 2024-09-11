from core import RequestHandler, Result, Mediator
from application.services import OrganizationService, TokenService, UserService
from domain.entities import User
from infrastructure import UnitOfWork
from .command import JoinOrganizationCommand

@Mediator.register_handler(JoinOrganizationCommand)
class JoinOrganizationHandler(RequestHandler[JoinOrganizationCommand, Result]):
    def __init__(
            self,
            uow: UnitOfWork,
            token_service: TokenService,
            org_service: OrganizationService,
            user_service: UserService,
        ) -> None:
        self.uow = uow
        self.token_service = token_service
        self.org_service = org_service
        self.user_service = user_service

    def handle(self, req: JoinOrganizationCommand) -> Result:
        token_result = self.token_service.try_decode_token(req.token)

        if not token_result.success or not token_result.data:
            return Result.fail(token_result.error)
        
        email = token_result.data.get("email")
        role_type = token_result.data.get("role")
        organization_id = token_result.data.get("organization")

        if not email:
            return Result.fail("Email not found in token")
        
        if not organization_id:
            return Result.fail("Organization not found in token")

        organization = self.org_service.get_organization(organization_id)

        if not organization:
            return Result.fail(f"Organization with ID '{organization_id}' not found")
        
        user_repo = self.uow.get_repository(User)
        user = self.user_service.find_user_by_email(email)

        if not user:
            return Result.fail(f"User with email '{email}' not found")
        
        user.organization_id = organization.id
        user.organization = organization

        if role_type:
            update_role_result = self.user_service.update_user_role(user, role_type)

            if not update_role_result.success:
                return Result.fail(update_role_result.error)
        
        user_repo.update(user)
        self.uow.commit()
        return Result.succeed()
