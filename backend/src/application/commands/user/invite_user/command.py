from core import Command, Result

class InviteUserCommand(Command[Result]):
    email: str
    role: str | None = None
    organization: str | None = None
