from datetime import date
from typing import TYPE_CHECKING
from uuid import UUID
from sqlmodel  import Field, Relationship
from domain.entities import Entity
from domain.enums import Gender

if TYPE_CHECKING:
    from domain.entities import Organization, Document, Study

class Patient(Entity, table=True):
    """Patient entity"""
    __tablename__ = "patients" # type: ignore

    name: str = Field(index=True)
    birth_date: date | None = None
    gender: Gender | None = None
    mrn: str = Field(index=True)

    organization_id: UUID = Field(foreign_key="organizations.id", ondelete="CASCADE")
    organization: "Organization" = Relationship(back_populates="patients")

    studies: list["Study"] = Relationship(back_populates="patient")
    documents: list["Document"] = Relationship(back_populates="patient")
