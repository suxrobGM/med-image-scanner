from core import Command, Result


class BookmarkReportCommand(Command[Result]):
    report_id: str
    user_id: str
    unbookmark: bool = False
