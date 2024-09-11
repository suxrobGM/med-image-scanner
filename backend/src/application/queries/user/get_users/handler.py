from core import RequestHandler, PagedResult, Mediator
from application.models import UserDto
from application.utils import build_user_filter_query
from domain.entities import User
from infrastructure import UnitOfWork
from .query import GetUsersQuery


@Mediator.register_handler(GetUsersQuery)
class GetUsersHandler(RequestHandler[GetUsersQuery, PagedResult[UserDto]]):
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def handle(self, req: GetUsersQuery) -> PagedResult[UserDto]:
        user_repo = self.uow.get_repository(User)
        filter_statement = build_user_filter_query(req.search, req.organization_name, req.organization_id)

        users = user_repo.get_list(
            filter=filter_statement,
            page=req.page,
            page_size=req.page_size,
            order_by=req.order_by,
        )

        items_count = user_repo.count(
            filter=filter_statement,
        )

        users_dto = [UserDto.from_entity(user) for user in users]

        return PagedResult[UserDto].succeed(
            data=users_dto,
            page_index=req.page,
            page_size=req.page_size,
            items_count=items_count,
        )

