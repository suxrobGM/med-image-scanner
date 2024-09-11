from core import Command, Result

class RequestPasswordRecoveryCommand(Command[Result]):
    email: str
