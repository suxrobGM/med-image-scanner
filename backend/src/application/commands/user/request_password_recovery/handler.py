from core import RequestHandler, Result, Mediator
from application.utils import getenv_required, valid_email
from application.email_templates import JINJA_ENV
from application.services import EmailSender, TokenService
from domain.entities import User
from infrastructure import UnitOfWork
from .command import RequestPasswordRecoveryCommand

@Mediator.register_handler(RequestPasswordRecoveryCommand)
class RequestPasswordRecoveryHandler(RequestHandler[RequestPasswordRecoveryCommand, Result]):
    def __init__(
            self,
            uow: UnitOfWork,
            token_service: TokenService,
            email_sender: EmailSender
        ) -> None:
        self.uow = uow
        self.token_service = token_service
        self.email_sender = email_sender

    def handle(self, req: RequestPasswordRecoveryCommand) -> Result:
        if not valid_email(req.email):
            return Result.fail("Invalid email address")
        
        user_repo = self.uow.get_repository(User)
        user = user_repo.get_one(User.email == req.email)

        if user is None:
            return Result.succeed()
        
        token_payload = {"email": user.email}
        token=self.token_service.create_token(token_payload)

        frontend_url = getenv_required("FRONTEND_URL")
        reset_link = f"{frontend_url}/auth/password-recovery/reset?token={token}"
        template = JINJA_ENV.get_template("password_recovery.html")

        html_content = template.render(
            reset_link=reset_link,
        )

        self.email_sender.send_email(req.email, "Reset password", html_content, is_html=True)
        return Result.succeed()
