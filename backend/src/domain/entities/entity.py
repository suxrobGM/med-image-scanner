from datetime import datetime
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel


class Entity(SQLModel):
    """Base entity class"""
    id: UUID = Field(primary_key=True, default_factory=uuid4)
    updated_at: datetime | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
