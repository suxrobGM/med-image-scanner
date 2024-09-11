from core import Command, Result

class UpdateUserPasswordPayload(Command[Result]):
    old_password: str
    new_password: str

class UpdateUserPasswordCommand(UpdateUserPasswordPayload):
    user_id: str
