from typing import TYPE_CHECKING, Optional
from uuid import UUID
from sqlmodel  import Field, Relationship
from domain.entities import Entity

if TYPE_CHECKING:
    from domain.entities import Image, Finding

class Annotation(Entity, table=True):
    """Instance annotations"""
    __tablename__ = "annotations" # type: ignore

    title: str
    description: str | None = None
    x: int
    y: int
    location: str | None = None
    width: int
    height: int
    hu: int | None = None
    image_url: str | None = None

    finding_id: UUID | None = Field(default=None, foreign_key="findings.id", ondelete="CASCADE")
    finding: Optional["Finding"] = Relationship(back_populates="annotation")
