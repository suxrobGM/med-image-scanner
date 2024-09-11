from core import Command, Result


class UpdateOrganizationPayload(Command[Result]):
    name: str | None = None
    display_name: str | None = None
    website: str | None = None
    phone: str | None = None
    email: str | None = None
    address: str | None = None
    dicom_url: str | None = None


class UpdateOrganizationCommand(UpdateOrganizationPayload):
    id: str
