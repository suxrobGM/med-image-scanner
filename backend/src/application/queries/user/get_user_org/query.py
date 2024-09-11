from core import Query, ResultWithData
from application.models import OrganizationDto


class GetUserOrgQuery(Query[ResultWithData[OrganizationDto]]):
    id: str
