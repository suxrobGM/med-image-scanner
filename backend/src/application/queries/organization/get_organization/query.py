from core import Query, ResultWithData
from application.models import OrganizationDto


class GetOrganizationQuery(Query[ResultWithData[OrganizationDto]]):
    id: str
