from domain.entities import User
from .base_model import BaseModel


class UserDto(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    country: str | None
    timezone: str | None
    role: str | None
    organization: str | None
    mobile_phone: str | None
    work_phone: str | None

    @staticmethod
    def from_entity(entity: User) -> "UserDto":
        return UserDto(
            id=str(entity.id),
            first_name=entity.first_name,
            last_name=entity.last_name,
            email=entity.email,
            country=entity.country,
            timezone=entity.timezone,
            role=entity.role.role_type if entity.role else None,
            organization=entity.organization.name if entity.organization else None,
            mobile_phone=entity.mobile_phone,
            work_phone=entity.work_phone,
        )

class UserShortDetailsDto(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str

    @staticmethod
    def from_entity(entity: User) -> "UserShortDetailsDto":
        return UserShortDetailsDto(
            id=str(entity.id),
            first_name=entity.first_name,
            last_name=entity.last_name,
            email=entity.email,
        )
