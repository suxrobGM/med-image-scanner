from pydantic import BaseModel as PydanticBaseModel
from application.models import UserDto


class SignInResult(PydanticBaseModel):
    access_token: str
    token_type: str
    user: UserDto | None = None
