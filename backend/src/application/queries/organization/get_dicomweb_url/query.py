from core import Query, ResultWithData
from application.models import DicomWebUrlDto


class GetOrgDicomWebUrlQuery(Query[ResultWithData[DicomWebUrlDto]]):
    org_id: str
