from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt import ExpiredSignatureError, InvalidTokenError
from core import Mediator, ResultWithData
from application.commands.user.signin_user import SignInUserCommand
from application.queries.user.get_user import GetUserQuery
from application.models import UserDto, SignInResult
from application.services import TokenService
from domain.enums import UserRoleType

auth_router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
router = auth_router

async def jwt_required(
    token: Annotated[str, Depends(oauth2_scheme)],
    token_service: Annotated[TokenService, Depends()]
) -> dict[str, str]:
    """Get user ID from access token. Validate token and return the decoded token"""

    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = token_service.decode_token(token)
        user_id = payload.get("sub")

        if user_id is None:
            raise credentials_exception
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired, please login again")
    except InvalidTokenError:
        raise credentials_exception

    return payload

@router.post("/login", responses={401: {"description": "Unauthorized"}})
async def signin(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    mediator: Annotated[Mediator, Depends()],
    token_service: Annotated[TokenService, Depends()],
) -> SignInResult:
    """Sign in user with password flow and return access token"""

    request = SignInUserCommand(
        email=form_data.username,
        password=form_data.password
    )
    result = mediator.send(request, ResultWithData[UserDto])
    
    if result.success is False or result.data is None:
        raise HTTPException(status_code=401, detail=result.error, headers={"WWW-Authenticate": "Bearer"})

    user = result.data
    access_token = token_service.create_token({
        "sub": user.id,
        "email": user.email,
        "role": user.role,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "organization": user.organization,
    })

    return SignInResult(access_token=access_token, token_type="Bearer", user=user)


@router.get("/user", responses={400: {"description": "Bad request"}})
async def get_current_user(
    token: Annotated[dict, Depends(jwt_required)],
    mediator: Annotated[Mediator, Depends()],
) -> ResultWithData[UserDto]:
    """Get current user details from access token"""

    user_id = token["sub"]
    result = mediator.send(GetUserQuery(id=user_id), ResultWithData[UserDto])

    if result.success is False:
        raise HTTPException(status_code=400, detail=result.error)

    return result


class RoleChecker:
    def __init__(self, roles: list[str] = []):
        self.roles = roles

    def __call__(self, token: Annotated[dict, Depends(jwt_required)]) -> bool:
        return self._check_role(token, self.roles)

    @staticmethod
    def admins_only(token: Annotated[dict, Depends(jwt_required)]) -> bool:
        """Check if user has admin role such as super admin, app admin, or org admin"""
        admin_roles: list[str] = [UserRoleType.SUPER_ADMIN, UserRoleType.APP_ADMIN, UserRoleType.ORG_ADMIN]
        return RoleChecker._check_role(token, admin_roles)
    
    @staticmethod
    def app_admins_only(token: Annotated[dict, Depends(jwt_required)]) -> bool:
        """Check if user has admin role such as super admin or app admin"""
        admin_roles: list[str] = [UserRoleType.SUPER_ADMIN, UserRoleType.APP_ADMIN]
        return RoleChecker._check_role(token, admin_roles)
    
    @staticmethod
    def _check_role(token: dict[str, str], roles: list[str]) -> bool:
        if "role" not in token:
            raise HTTPException(status_code=401, detail="User role not found in token")

        user_role = token["role"]
        
        if user_role not in roles:
            raise HTTPException(status_code=403, detail="User does not have permission to access this resource")
        
        return True
