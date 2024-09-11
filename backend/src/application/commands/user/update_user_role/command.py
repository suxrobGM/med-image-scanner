from core import Command, Result

class UpdateUserRolePayload(Command[Result]):
    role: str | None = None
    organization: str | None = None

class UpdateUserRoleCommand(UpdateUserRolePayload):
    user_id: str
