from core import RequestHandler, Result, Mediator
from application.services import UserService
from domain.entities import User
from infrastructure import UnitOfWork
from .command import UpdateUserPasswordCommand

@Mediator.register_handler(UpdateUserPasswordCommand)
class UpdateUserPasswordHandler(RequestHandler[UpdateUserPasswordCommand, Result]):
    def __init__(self, uow: UnitOfWork, user_service: UserService):
        self.uow = uow
        self.user_service = user_service

    def handle(self, req: UpdateUserPasswordCommand) -> Result:
        user_repo = self.uow.get_repository(User)

        user = user_repo.get_one(User.id == req.user_id)

        if not user:
            return Result.fail(f"User with ID '{req.user_id}' not found")
        
        if not self.user_service.verify_password(user, req.old_password):
            return Result.fail("Old password is incorrect")
        
        if not self.user_service.check_password_strength(req.new_password):
            return Result.fail("New password is too weak")
        
        user = self.user_service.set_password(user, req.new_password)

        user_repo.update(user)
        self.uow.commit()
        return Result.succeed()
