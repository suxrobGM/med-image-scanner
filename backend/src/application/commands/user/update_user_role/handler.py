from core import RequestHandler, Result, Mediator
from domain.entities import User, UserRole, Organization
from domain.enums import UserRoleType
from infrastructure import UnitOfWork
from .command import UpdateUserRoleCommand

@Mediator.register_handler(UpdateUserRoleCommand)
class UpdateUserRoleHandler(RequestHandler[UpdateUserRoleCommand, Result]):
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def handle(self, req: UpdateUserRoleCommand) -> Result:
        user_repo = self.uow.get_repository(User)
        organization_repo = self.uow.get_repository(Organization)

        user = user_repo.get_one(User.id == req.user_id)

        if not user:
            return Result.fail(f"User with ID '{req.user_id}' not found")
        
        if user.role and user.role.role_type == UserRoleType.SUPER_ADMIN:
            return Result.fail("Cannot update role for super admin")
        
        update_role_result = self._update_role(user, req.role)

        if not update_role_result.success:
            return update_role_result

        if req.organization and user.role:
            organization = organization_repo.get_one(Organization.name == req.organization)

            if not organization:
                return Result.fail(f"Organization with name '{req.organization}' not found")
            
            user.role.organization = organization

        user_repo.update(user)
        self.uow.commit()
        return Result.succeed()
    
    def _update_role(self, user: User, role: str | None) -> Result:
        if not role and user.role:
            user_role_repo = self.uow.get_repository(UserRole)
            user_role_repo.delete_by_id(user.role.id)
            return Result.succeed()
        elif role and not UserRoleType.has_value(role):
            return Result.fail("Invalid user role")
        else:
            role_type = UserRoleType(role)
            
            if user.role:
                user.role.role_type = role_type
            else:
                user.role = UserRole(user_id=user.id, role_type=role_type)

        return Result.succeed()
