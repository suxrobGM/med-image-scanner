from typing import TYPE_CHECKING, Optional
from datetime import datetime
from uuid import UUID
from sqlmodel  import Field, Relationship
from domain.entities import Entity
from domain.entities.bookmark_report import BookmarkReport

if TYPE_CHECKING:
    from domain.entities import Finding, Patient, Series, User


class Report(Entity, table=True):
    """Report entity"""
    __tablename__ = "reports" # type: ignore

    clinincal_info: str | None = None
    indication: str | None = None
    technique: str | None = None
    impression: str | None = None
    recommendation: str | None = None
    signed_at: datetime | None = None

    patient_id: UUID = Field(foreign_key="patients.id", ondelete="CASCADE")
    patient: "Patient" = Relationship()

    series_id: UUID = Field(foreign_key="series.id", ondelete="CASCADE")
    series: "Series" = Relationship(back_populates="report")
    
    referring_physician_id: UUID | None = Field(default=None, foreign_key="users.id")
    referring_physician: Optional["User"] = Relationship(back_populates="referring_reports")

    bookmarked_users: list["User"] = Relationship(back_populates="bookmarked_reports", link_model=BookmarkReport)
    """Users who saved this report, many-to-many relationship"""

    findings: list["Finding"] = Relationship(back_populates="report")
    """Findings in this report, one-to-many relationship"""
