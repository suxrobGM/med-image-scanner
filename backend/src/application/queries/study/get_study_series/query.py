from core import Query, ResultWithArray
from application.models import SeriesDto

class GetStudySeriesParams(Query[ResultWithArray[SeriesDto]]):
    organization: str

class GetStudySeriesQuery(GetStudySeriesParams):
    study_id: str
    organization: str
