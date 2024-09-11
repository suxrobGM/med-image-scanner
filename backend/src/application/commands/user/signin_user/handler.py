from core import RequestHandler, ResultWithData, Mediator
from application.models import UserDto
from application.services import UserService
from domain.entities import User
from infrastructure import UnitOfWork
from .command import SignInUserCommand

@Mediator.register_handler(SignInUserCommand)
class SignInUserHandler(RequestHandler[SignInUserCommand, ResultWithData[UserDto]]):
    def __init__(self, uow: UnitOfWork, user_service: UserService):
        self.uow = uow
        self.user_service = user_service

    def handle(self, req: SignInUserCommand) -> ResultWithData[UserDto]:
        user_repo = self.uow.get_repository(User)
        user = user_repo.get_one(User.email == req.email)

        if user is None:
            return ResultWithData[UserDto].fail("User not found")

        if not self.user_service.verify_password(user, req.password):
            return ResultWithData[UserDto].fail("Invalid password")
        
        return ResultWithData[UserDto].succeed(UserDto.from_entity(user))
