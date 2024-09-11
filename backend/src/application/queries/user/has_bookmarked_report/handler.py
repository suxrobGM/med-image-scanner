from core import RequestHandler, ResultWithData, Mediator
from domain.entities import BookmarkReport
from infrastructure import UnitOfWork
from .query import UserHasBookmarkedReportQuery


@Mediator.register_handler(UserHasBookmarkedReportQuery)
class UserHasBookmarkedReportHandler(RequestHandler[UserHasBookmarkedReportQuery, ResultWithData[bool]]):
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def handle(self, req: UserHasBookmarkedReportQuery) -> ResultWithData[bool]:
        bookmark_report_repo = self.uow.get_repository(BookmarkReport) # type: ignore
        exists_report = bookmark_report_repo.exists(BookmarkReport.user_id == req.user_id and BookmarkReport.report_id == req.report_id)

        return ResultWithData[bool].succeed(exists_report)
