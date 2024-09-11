from typing import TYPE_CHECKING, Optional
from uuid import UUID
from sqlmodel  import Field, Relationship
from domain.entities import Entity
from domain.entities.bookmark_report import BookmarkReport

if TYPE_CHECKING:
    from domain.entities import Organization, Report, Message, Notification
    from .user_role import UserRole


class User(Entity, table=True):
    """User entity"""
    __tablename__ = "users" # type: ignore

    first_name: str = Field(index=True)
    last_name: str = Field(index=True)
    email: str = Field(index=True, unique=True)
    password_hash: str = ""
    country: str | None = None
    work_phone: str | None = None
    mobile_phone: str | None = None
    timezone: str | None = None
    is_active: bool = True

    role: Optional["UserRole"] = Relationship(back_populates="user")

    organization_id: UUID | None = Field(default=None, foreign_key="organizations.id", ondelete="SET NULL")
    organization: Optional["Organization"] = Relationship(back_populates="users")

    bookmarked_reports: list["Report"] = Relationship(back_populates="bookmarked_users", link_model=BookmarkReport)
    """Reports saved by this user, many-to-many relationship"""

    referring_reports: list["Report"] = Relationship(back_populates="referring_physician")
    """Reports referred by this user, one-to-many relationship"""
    
    #sent_notifications: list["Notification"] = Relationship(back_populates="sender")
    #received_notifications: list["Notification"] = Relationship(back_populates="recipient")
    #sent_messages: list["Message"] = Relationship(back_populates="sender")
    #received_messages: list["Message"] = Relationship(back_populates="recipient")
