from core import Command, Result

class UpdateUserProfilePayload(Command[Result]):
    first_name: str | None
    last_name: str | None
    work_phone: str | None
    mobile_phone: str | None
    country: str | None
    timezone: str | None

class UpdateUserProfileCommand(UpdateUserProfilePayload):
    user_id: str
