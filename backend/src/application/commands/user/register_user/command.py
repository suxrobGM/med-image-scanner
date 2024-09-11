from datetime import date
from core import Command, Result

class RegisterUserCommand(Command[Result]):
    token: str
    first_name: str
    last_name: str
    birth_date: date | None = None
    country: str
    timezone: str
    gender: str | None = None
    password: str
    work_phone: str | None = None
    mobile_phone: str | None = None
