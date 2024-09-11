from core import RequestHandler, ResultWithData, Mediator
from application.models import UserDto
from application.utils import valid_uuid
from domain.entities import User
from infrastructure import UnitOfWork
from .query import GetUserQuery

@Mediator.register_handler(GetUserQuery)
class GetUserHandler(RequestHandler[GetUserQuery, ResultWithData[UserDto]]):
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def handle(self, req: GetUserQuery) -> ResultWithData[UserDto]:
        user_repo = self.uow.get_repository(User)
        
        if valid_uuid(req.id):
            user = user_repo.get_one(User.id == req.id)
        else:
            user = user_repo.get_one(User.email == req.id)

        if user is None:
            return ResultWithData.fail(f"User with ID '{req.id}' not found")

        return ResultWithData.succeed(UserDto.from_entity(user))
