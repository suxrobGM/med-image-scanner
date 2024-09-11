from core import RequestHandler, ResultWithData, Mediator
from application.models import ReportDto
from domain.entities import Report
from infrastructure import UnitOfWork
from .query import GetReportQuery


@Mediator.register_handler(GetReportQuery)
class GetReportHandler(RequestHandler[GetReportQuery, ResultWithData[ReportDto]]):
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def handle(self, req: GetReportQuery) -> ResultWithData[ReportDto]:
        report_repo = self.uow.get_repository(Report)
        
        report = report_repo.get_one(Report.id == req.id)

        if report is None:
            return ResultWithData.fail(f"No report found with the ID {req.id}")
        
        report_dto = ReportDto.from_entity(report)
        return ResultWithData[ReportDto].succeed(report_dto)
