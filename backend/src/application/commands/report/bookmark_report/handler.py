from core import RequestHandler, Result, Mediator
from domain.entities import Report, User
from infrastructure import UnitOfWork
from .command import BookmarkReportCommand

@Mediator.register_handler(BookmarkReportCommand)
class SaveReportHandler(RequestHandler[BookmarkReportCommand, Result]):
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def handle(self, req: BookmarkReportCommand) -> Result:
        report_repo = self.uow.get_repository(Report)
        report = report_repo.get_one(Report.id == req.report_id)

        if not report:
            return Result.fail(f"Report with ID {req.report_id} not found")
        
        user_repo = self.uow.get_repository(User)
        user = user_repo.get_one(User.id == req.user_id)

        if not user:
            return Result.fail(f"User with ID {req.user_id} not found")
        
        if user not in report.bookmarked_users:
            report.bookmarked_users.append(user)
            self.uow.commit()

        if req.unbookmark:
            report.bookmarked_users.remove(user)
            self.uow.commit()
                
        return Result.succeed()
