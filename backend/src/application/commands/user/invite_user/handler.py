from core import RequestHandler, Result, Mediator
from application.utils import getenv_required, valid_email
from application.email_templates import JINJA_ENV
from application.services import EmailSender, TokenService, OrganizationService
from domain.enums import UserRoleType
from .command import InviteUserCommand

@Mediator.register_handler(InviteUserCommand)
class InviteUserHandler(RequestHandler[InviteUserCommand, Result]):
    def __init__(
            self,
            token_service: TokenService,
            email_sender: EmailSender,
            org_service: OrganizationService,
        ) -> None:
        self.token_service = token_service
        self.email_sender = email_sender
        self.org_service = org_service

    def handle(self, req: InviteUserCommand) -> Result:
        if not valid_email(req.email):
            return Result.fail("Invalid email address")
        
        if req.role and not UserRoleType.has_value(req.role):
            return Result.fail("Invalid user role")
        
        organization_name: str | None = None
        token_payload = {"email": req.email}

        if req.role:
            token_payload["role"] = req.role
        
        if req.organization:
            organization = self.org_service.get_organization(req.organization)
            token_payload["organization"] = req.organization

            if not organization:
                return Result.fail(f"Organization with name '{req.organization}' not found")
            else:
                organization_name = organization.display_name if organization.display_name else organization.name
            
        token=self.token_service.create_token(token_payload)
        sent_email = self.send_invite_to_signup_email(req.email, organization_name, token)

        if not sent_email:
            return Result.fail("Failed to send email")
        
        return Result.succeed()
    
    def send_invite_to_signup_email(self, email: str, organization_name: str | None, token: str) -> bool:
        frontend_url = getenv_required("FRONTEND_URL")
        signup_link = f"{frontend_url}/auth/signup/account?token={token}"
        template = JINJA_ENV.get_template("invite_to_signup.html")

        html_content = template.render(
            signup_link=signup_link,
            organization=organization_name,
        )

        return self.email_sender.send_email(email, "Invitation", html_content, is_html=True)
