from uuid import UUID
from sqlmodel  import Field, SQLModel

class BookmarkReport(SQLModel, table=True):
    """User saved report"""
    __tablename__ = "bookmarked_reports" # type: ignore

    report_id: UUID = Field(foreign_key="reports.id", primary_key=True, ondelete="CASCADE")
    user_id: UUID = Field(foreign_key="users.id", primary_key=True, ondelete="CASCADE")
