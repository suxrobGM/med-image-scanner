import ast
import logging
import requests
from core import DIContainer
from .smtp_creds import SmtpCreds


@DIContainer.register_singleton()
class EmailSender:
    def __init__(self) -> None:
        self._smtp_creds = SmtpCreds()
        self._logger = logging.getLogger()

    def send_email(self, recipent: str, subject: str, body: str, is_html: bool = False) -> bool:
        """
        Send an email to the recipent with the given subject and body.
        Args:
            recipent (str): The email address of the recipent
            subject (str): The subject of the email
            body (str): The body of the email
            is_html (bool): Whether the body is in HTML format or not
        Returns:
            bool: True if the email was sent successfully, False otherwise
        """

        try:
            access_token = self._get_access_token()

            if access_token is None:
                return False

            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }

            email_message = {
                "message": {
                    "subject": subject,
                    "body": {
                        "contentType": "html" if is_html else "text",
                        "content": body
                    },
                    "toRecipients": [
                        {
                            "emailAddress": {
                                "address": recipent
                            }
                        }
                    ]
                }
            }

            # Send the email via Microsoft Graph API
            graph_api_url = "https://graph.microsoft.com/v1.0/me/sendMail"
            response = requests.post(graph_api_url, headers=headers, json=email_message)

            # Check if the email was sent successfully
            if response.status_code != 202:
                self._logger.error(f"Failed to send email: {response.status_code}, {response.text}")
            
            return True
        except Exception as e:
            self._logger.error(f"An error occurred while sending the email: {e}")
            return False
        
    def _get_access_token(self) -> str | None:
        """
        Get an access token using the Client Credentials Flow for the Microsoft Account.
        Returns:
            str | None: The access token if it was retrieved successfully, None otherwise
        """
        url = f"https://login.microsoftonline.com/{self._smtp_creds.tenant_id}/oauth2/v2.0/token"

        payload = {
            "client_id": self._smtp_creds.client_id,
            "scope": "https://graph.microsoft.com/.default",
            "client_secret": self._smtp_creds.client_secret,
            "grant_type": "refresh_token",
            "redirect_uri": "http://localhost",
            "refresh_token": self._smtp_creds.refresh_token
        }
        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": "fpc=AotDC2wIAAACaFzHcDgAAAA; stsservicecookie=estsfd; x-ms-gateway-slice=estsfd"
        }

        try:
            response = requests.post(url, headers=headers, data=payload)
            response.raise_for_status()  # Raise an exception if request fails
            result = ast.literal_eval(str(response.text))
            return result["access_token"]
        except requests.exceptions.RequestException as e:
            self._logger.error(f"An error occurred while requesting the token: {e}")
            return None
