from core import RequestHandler, Result, Mediator
from application.utils import getenv_required, valid_email
from application.email_templates import JINJA_ENV
from application.services import EmailSender, TokenService
from domain.entities import Organization, User
from domain.enums import UserRoleType
from infrastructure import UnitOfWork
from .command import InviteToOrgCommand

@Mediator.register_handler(InviteToOrgCommand)
class InviteToOrgHandler(RequestHandler[InviteToOrgCommand, Result]):
    def __init__(
            self,
            uow: UnitOfWork,
            token_service: TokenService,
            email_sender: EmailSender,
        ) -> None:
        self.uow = uow
        self.token_service = token_service
        self.email_sender = email_sender

    def handle(self, req: InviteToOrgCommand) -> Result:
        if not valid_email(req.email):
            return Result.fail("Invalid email address")
        
        if req.role and not UserRoleType.has_value(req.role) and not UserRoleType.is_app_admin(req.role):
            return Result.fail("Invalid user role")
        
        organization_name: str | None = None
        token_payload = {
            "email": req.email,
            "organization": req.organization
        }

        if req.role:
            token_payload["role"] = req.role
        
        org_repo = self.uow.get_repository(Organization)
        organization = org_repo.get_one(Organization.name == req.organization)

        if not organization:
            return Result.fail(f"Organization with name '{req.organization}' not found")
        else:
            organization_name = organization.display_name if organization.display_name else organization.name

        token=self.token_service.create_token(token_payload)
        user_repo = self.uow.get_repository(User)
        user = user_repo.get_one(User.email == req.email)
        sent_email: bool = False

        if user:
            if user.organization_id == organization.id:
                return Result.fail(f"User with email '{req.email}' is already a member of the organization")

            sent_email = self.send_invite_to_org_email(user, organization_name, token)
        else:
            sent_email = self.send_invite_to_signup_email(req.email, organization_name, token)

        if not sent_email:
            return Result.fail("Failed to send email")
        
        return Result.succeed()
    
    def send_invite_to_signup_email(self, email: str, organization_name: str, token: str) -> bool:
        frontend_url = getenv_required("FRONTEND_URL")
        signup_link = f"{frontend_url}/auth/signup/account?token={token}"
        template = JINJA_ENV.get_template("invite_to_signup.html")

        html_content = template.render(
            signup_link=signup_link,
            organization=organization_name,
        )

        return self.email_sender.send_email(email, "Invitation", html_content, is_html=True)

    def send_invite_to_org_email(self, user: User, organization_name: str, token: str) -> bool:
        frontend_url = getenv_required("FRONTEND_URL")
        join_link = f"{frontend_url}/auth/org/join?token={token}"
        template = JINJA_ENV.get_template("invite_to_org.html")

        html_content = template.render(
            user_name=user.first_name,
            join_link=join_link,
            organization=organization_name,
        )

        return self.email_sender.send_email(user.email, "Invitation to join organization", html_content, is_html=True)
