from typing import TYPE_CHECKING
from uuid import UUID
from sqlmodel  import Field, Relationship
from domain.entities import Entity

if TYPE_CHECKING:
    from domain.entities import User

class Notification(Entity, table=True):
    """Notification entity"""
    __tablename__ = "notifications" # type: ignore

    title: str
    description: str
    is_read: bool = False
    sender_id: UUID #= Field(foreign_key="users.id")
    # sender: "User" = Relationship(back_populates="sent_notifications", sa_relationship_kwargs={"foreign_keys": [sender_id]})
    recipient_id: UUID #= Field(foreign_key="users.id")
    # recipient: "User" = Relationship(back_populates="received_notifications", sa_relationship_kwargs={"foreign_keys": [recipient_id]})
