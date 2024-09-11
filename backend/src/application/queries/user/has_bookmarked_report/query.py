from core import Query, ResultWithData


class UserHasBookmarkedReportQuery(Query[ResultWithData[bool]]):
    user_id: str
    report_id: str
