from typing import TYPE_CHECKING
from uuid import UUID
from sqlmodel  import Field, Relationship
from domain.entities import Entity

if TYPE_CHECKING:
    from domain.entities import Patient

class Document(Entity, table=True):
    """Patient document such as medical report, prescription, etc."""
    __tablename__ = "documents" # type: ignore

    name: str
    description: str | None = None
    url: str

    patient_id: UUID = Field(foreign_key="patients.id", ondelete="CASCADE")
    patient: "Patient" = Relationship(back_populates="documents")
