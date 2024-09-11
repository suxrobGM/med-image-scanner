from datetime import date
from typing import TYPE_CHECKING
from uuid import UUID
from sqlmodel  import Field, Relationship
from domain.entities import Entity

if TYPE_CHECKING:
    from domain.entities import Series, Patient, Organization

class Study(Entity, table=True):
    """Patient study which corresponds to DICOM study"""
    __tablename__ = "studies" # type: ignore

    study_instance_uid: str = Field(index=True)
    accession_number: str | None = None
    study_date: date | None = None
    description: str | None = None
    modalities: str | None = None
    series_count: int = Field(default=0)
    instances_count: int = Field(default=0)

    patient_id: UUID = Field(foreign_key="patients.id", ondelete="CASCADE")
    patient: "Patient" = Relationship(back_populates="studies")
    
    organization_id: UUID = Field(foreign_key="organizations.id", ondelete="CASCADE")
    organization: "Organization" = Relationship(back_populates="studies")

    series: list["Series"] = Relationship(back_populates="study")
