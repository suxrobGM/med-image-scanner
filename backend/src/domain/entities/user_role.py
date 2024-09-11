from typing import TYPE_CHECKING, Optional
from uuid import UUID
from sqlmodel  import Field, Relationship
from domain.entities import Entity

if TYPE_CHECKING:
    from domain.entities import User, Organization


class UserRole(Entity, table=True):
    """User Role entity"""
    __tablename__ = "user_roles" # type: ignore

    role_type: str

    user_id: UUID = Field(foreign_key="users.id", ondelete="CASCADE")
    user: "User" = Relationship(back_populates="role")

    organization_id: UUID | None = Field(default=None, foreign_key="organizations.id", ondelete="CASCADE")
    organization: Optional["Organization"] = Relationship()
