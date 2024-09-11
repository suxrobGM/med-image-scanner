from core import Query, ResultWithArray
from application.models import ReportDto


class GetUserBookmarkedReportsQuery(Query[ResultWithArray[ReportDto]]):
    user_id: str
