from core import RequestHandler, ResultWithData, Mediator
from application.models import OrganizationDto
from application.utils import valid_uuid
from domain.entities import User
from infrastructure import UnitOfWork
from .query import GetUserOrgQuery

@Mediator.register_handler(GetUserOrgQuery)
class GetUserOrgHandler(RequestHandler[GetUserOrgQuery, ResultWithData[OrganizationDto]]):
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def handle(self, req: GetUserOrgQuery) -> ResultWithData[OrganizationDto]:
        user_repo = self.uow.get_repository(User)
        
        if valid_uuid(req.id):
            user = user_repo.get_one(User.id == req.id)
        else:
            user = user_repo.get_one(User.email == req.id)

        if not user:
            return ResultWithData.fail(f"User with ID '{req.id}' not found")
        
        if not user.organization:
            return ResultWithData.fail("User does not belong to any organization")
        
        return ResultWithData.succeed(OrganizationDto.from_entity(user.organization))
