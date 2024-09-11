from core import Query, ResultWithData
from application.models import UserDto


class GetUserQuery(Query[ResultWithData[UserDto]]):
    id: str
