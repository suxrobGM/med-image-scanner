from core import Query, ResultWithData
from application.models import ReportDto


class GetReportQuery(Query[ResultWithData[ReportDto]]):
    id: str
