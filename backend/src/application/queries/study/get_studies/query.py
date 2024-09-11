from core import Query, ResultWithArray
from application.models import StudyDto


class GetStudiesQuery(Query[ResultWithArray[StudyDto]]):
    patient_id: str
    organization: str
