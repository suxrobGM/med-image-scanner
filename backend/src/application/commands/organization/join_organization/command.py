from core import Command, Result

class JoinOrganizationCommand(Command[Result]):
    token: str
