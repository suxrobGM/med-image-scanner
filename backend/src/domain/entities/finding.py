from typing import TYPE_CHECKING, Optional
from uuid import UUID
from sqlmodel  import Field, Relationship
from domain.entities import Entity

if TYPE_CHECKING:
    from domain.entities import Report, Annotation

class Finding(Entity, table=True):
    """Patient finding entity"""
    __tablename__ = "findings" # type: ignore

    title: str
    description: str | None = None
    approved: bool | None = None
    prediction_probability: float | None = None
    
    annotation: Optional["Annotation"] = Relationship(back_populates="finding")

    report_id: UUID = Field(foreign_key="reports.id", ondelete="CASCADE")
    report: "Report" = Relationship(back_populates="findings")
