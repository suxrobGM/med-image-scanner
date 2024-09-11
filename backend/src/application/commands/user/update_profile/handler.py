from core import RequestHandler, Result, Mediator
from domain.entities import User
from infrastructure import UnitOfWork
from .command import UpdateUserProfileCommand

@Mediator.register_handler(UpdateUserProfileCommand)
class UpdateUserProfileHandler(RequestHandler[UpdateUserProfileCommand, Result]):
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def handle(self, req: UpdateUserProfileCommand) -> Result:
        user_repo = self.uow.get_repository(User)

        user = user_repo.get_one(User.id == req.user_id)

        if not user:
            return Result.fail(f"User with ID '{req.user_id}' not found")
        
        if req.work_phone and user.work_phone != req.work_phone:
            user.work_phone = req.work_phone

        if req.mobile_phone and user.mobile_phone != req.mobile_phone:
            user.mobile_phone = req.mobile_phone

        if req.country and user.country != req.country:
            user.country = req.country
        
        if req.timezone and user.timezone != req.timezone:
            user.timezone = req.timezone

        if req.first_name and req.first_name != "" and user.first_name != req.first_name:
            user.first_name = req.first_name

        if req.last_name and req.last_name != "" and user.last_name != req.last_name:
            user.last_name = req.last_name

        user_repo.update(user)
        self.uow.commit()
        return Result.succeed()
