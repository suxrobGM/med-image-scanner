from core import Command, Result

class InviteToOrgCommand(Command[Result]):
    email: str
    role: str | None = None
    organization: str
