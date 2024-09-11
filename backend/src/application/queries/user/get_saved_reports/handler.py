from core import RequestHandler, ResultWithArray, Mediator
from application.models import ReportDto
from domain.entities import User
from infrastructure import UnitOfWork
from .query import GetUserBookmarkedReportsQuery


@Mediator.register_handler(GetUserBookmarkedReportsQuery)
class GetUserBookmarkedReportsHandler(RequestHandler[GetUserBookmarkedReportsQuery, ResultWithArray[ReportDto]]):
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def handle(self, req: GetUserBookmarkedReportsQuery) -> ResultWithArray[ReportDto]:
        user_repo = self.uow.get_repository(User)
        user = user_repo.get_one(User.id == req.user_id)

        if not user:
            return ResultWithArray.fail(f"User with ID {req.user_id} not found")
        
        reports_dto = [ReportDto.from_entity(report) for report in user.bookmarked_reports]

        return ResultWithArray[ReportDto].succeed(reports_dto)
