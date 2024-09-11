from typing import TYPE_CHECKING
from sqlmodel  import Field, Relationship
from domain.entities import Entity

if TYPE_CHECKING:
    from domain.entities import User, Patient, Study

class Organization(Entity, table=True):
    """Medical organization entity"""
    __tablename__ = "organizations" # type: ignore

    name: str = Field(index=True, unique=True)
    display_name: str | None = None
    website: str | None = None
    phone: str | None = None
    email: str | None = None
    address: str | None = None
    dicom_url: str
    
    users: list["User"] = Relationship(back_populates="organization")
    patients: list["Patient"] = Relationship(back_populates="organization")
    studies: list["Study"] = Relationship(back_populates="organization")
