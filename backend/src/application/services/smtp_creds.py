from application.utils import getenv_required

class SmtpCreds:
    client_id: str = getenv_required("SMTP_CLIENT_ID")
    client_secret: str = getenv_required("SMTP_CLIENT_SECRET")
    tenant_id: str = getenv_required("SMTP_TENANT_ID")
    refresh_token: str = getenv_required("SMTP_REFRESH_TOKEN")
