from datetime import date
from typing import TYPE_CHECKING, Optional
from uuid import UUID
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel  import Field, Relationship
from domain.entities import Entity
from domain.enums import PredictionStatus
from domain.enums.ml_model_type import MLModelType

if TYPE_CHECKING:
    from domain.entities import Study, Report

class Series(Entity, table=True):
    """Study series"""
    __tablename__ = "series" # type: ignore

    study_instance_uid: str = Field(index=True)
    series_instance_uid: str = Field(index=True)
    series_number: int
    modality: str
    description: str | None = None
    body_part: str | None = None
    instances_count: int
    series_date: date | None = None

    prediction_model: MLModelType | None = None
    """Prediction model"""

    prediction_status: PredictionStatus = Field(default=PredictionStatus.NOT_STARTED)
    """Prediction status"""

    prediction_result: dict | None = Field(default=None, sa_column=Column(JSONB))
    """Prediction results in JSON format"""

    report: Optional["Report"] = Relationship(back_populates="series")
    """Optional one-to-one relationship to report"""

    study_id: UUID = Field(foreign_key="studies.id", ondelete="CASCADE")
    study: "Study" = Relationship(back_populates="series")
