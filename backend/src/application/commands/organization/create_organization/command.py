from core import Command, Result


class CreateOrganizationCommand(Command[Result]):
    name: str
    display_name: str | None = None
    website: str | None = None
    phone: str | None = None
    email: str | None = None
    address: str | None = None
    dicom_url: str
