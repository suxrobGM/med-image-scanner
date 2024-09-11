from core import RequestHandler, Result, Mediator
from application.services import TokenService, UserService, OrganizationService
from application.utils import valid_email
from domain.entities import User
from domain.entities.user_role import UserRole
from domain.enums.user_role_type import UserRoleType
from infrastructure import UnitOfWork
from .command import RegisterUserCommand

@Mediator.register_handler(RegisterUserCommand)
class RegisterUserHandler(RequestHandler[RegisterUserCommand, Result]):
    def __init__(
        self,
        uow: UnitOfWork,
        user_service: UserService,
        org_service: OrganizationService,
        token_service: TokenService,
    ) -> None:
        self._uow = uow
        self.user_service = user_service
        self.org_service = org_service
        self.token_service = token_service

    def handle(self, req: RegisterUserCommand) -> Result:
        token_result = self.token_service.try_decode_token(req.token)

        if not token_result.success or not token_result.data:
            return Result.fail(token_result.error)
        
        email = token_result.data.get("email")
        role_type = token_result.data.get("role")
        organization_id = token_result.data.get("organization")

        if email is None:
            return Result.fail("Email not found in token")
        
        if not valid_email(email):
            return Result.fail("Invalid email address")
        
        if self.user_service.check_password_strength(req.password) is False:
            return Result.fail("Password is too weak")
        
        user_repo = self._uow.get_repository(User)
        user = User(
            first_name=req.first_name,
            last_name=req.last_name,
            email=email,
            country=req.country,
            timezone=req.timezone,
            work_phone=req.work_phone,
            mobile_phone=req.mobile_phone,
        )

        # Set the organization if provided
        if organization_id:
            organization = self.org_service.get_organization(organization_id)

            if not organization:
                return Result.fail(f"Organization with ID '{organization_id}' not found")

            user.organization = organization

        # Set the role if provided
        if role_type:
            if not UserRoleType.has_value(role_type):
                return Result.fail("Invalid user role")
            
            user.role = UserRole(
                role_type=role_type,
                user_id=user.id,
                organization=user.organization
            )

        self.user_service.set_password(user, req.password)
        user_repo.add(user)
        self._uow.commit()
        return Result.succeed()
