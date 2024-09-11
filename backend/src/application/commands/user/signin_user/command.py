from core import Command, ResultWithData
from application.models import UserDto


class SignInUserCommand(Command[ResultWithData[UserDto]]):
    email: str
    password: str
