from jwt import ExpiredSignatureError, InvalidTokenError
from core import RequestHandler, Result, Mediator
from application.services import UserService, TokenService
from domain.entities import User
from infrastructure import UnitOfWork
from .command import ResetPasswordCommand

@Mediator.register_handler(ResetPasswordCommand)
class ResetPasswordHandler(RequestHandler[ResetPasswordCommand, Result]):
    def __init__(
            self,
            uow: UnitOfWork,
            token_service: TokenService,
            user_service: UserService,
        ) -> None:
        self.uow = uow
        self.token_service = token_service
        self.user_service = user_service

    def handle(self, req: ResetPasswordCommand) -> Result:
        try:
            token = self.token_service.decode_token(req.token)
        except ExpiredSignatureError:
            return Result.fail("Token expired")
        except InvalidTokenError:
            return Result.fail("Invalid token")
        
        email = token.get("email")
        user_repo = self.uow.get_repository(User)
        user = user_repo.get_one(User.email == email)

        if user is None:
            return Result.fail(f"User with email '{email}' not found")
        
        if self.user_service.check_password_strength(req.password) is False:
            return Result.fail("Password is too weak")
        
        self.user_service.set_password(user, req.password)
        user_repo.update(user)
        self.uow.commit()
        return Result.succeed()
