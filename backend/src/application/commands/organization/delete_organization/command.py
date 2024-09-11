from core import Command, Result

class DeleteOrganizationCommand(Command[Result]):
    id: str
