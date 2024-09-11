from core import Command, Result

class UpdateUserOrgPayload(Command[Result]):
    organization: str | None = None

class UpdateUserOrgCommand(UpdateUserOrgPayload):
    user_id: str
