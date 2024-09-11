import os
import jwt
from datetime import UTC, datetime, timedelta
from core import DIContainer, ResultWithData

@DIContainer.register_singleton()
class TokenService:
    """Token service to create and decode JWT tokens"""
    _secret: str = os.getenv("JWT_SECRET") or "secret"
    _algorithm: str = "HS256"
    _default_expiration: int = 24 * 3600 # 24 hours

    def create_token(self, payload: dict, expiration: timedelta | None = None) -> str:
        """Create a JWT token
        Args:
            payload (dict): Payload to encode in the token
            expiration (timedelta, optional): Expiration time for the token. The default expiration is 24 hours.
        Returns:
            str: Encoded JWT token
        """

        expires_delta = expiration or timedelta(seconds=self._default_expiration)
        to_encode = payload.copy()
        expire = datetime.now(UTC) + expires_delta
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, self._secret, algorithm=self._algorithm)
    
    def decode_token(self, token: str) -> dict:
        """Decode a JWT token
        Args:
            token (str): JWT token to decode
        Returns:
            dict: Decoded payload
        """
        return jwt.decode(token, self._secret, algorithms=[self._algorithm])
    
    def try_decode_token(self, token: str) -> ResultWithData[dict]:
        """Try to decode a JWT token
        Args:
            token (str): JWT token to decode
        Returns:
            ResultWithData[dict]: Decoded payload or error message
        """
        try:
            return ResultWithData.succeed(self.decode_token(token))
        except jwt.ExpiredSignatureError:
            return ResultWithData.fail("Token expired")
        except jwt.InvalidTokenError:
            return ResultWithData.fail("Invalid token")
