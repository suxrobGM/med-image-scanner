from core import Command, Result

class ResetPasswordCommand(Command[Result]):
    token: str
    password: str
