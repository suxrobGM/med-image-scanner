from application.models import UserDto
from domain.entities import Organization
from .base_model import BaseModel


class OrganizationDto(BaseModel):
    id: str
    name: str
    display_name: str | None = None
    website: str | None = None
    phone: str | None = None
    email: str | None = None
    address: str | None = None
    dicom_url: str

    @staticmethod
    def from_entity(entity: Organization) -> "OrganizationDto":
        return OrganizationDto(
            id=str(entity.id),
            name=entity.name,
            display_name=entity.display_name,
            website=entity.website,
            phone=entity.phone,
            email=entity.email,
            address=entity.address,
            dicom_url=entity.dicom_url,
        )
    
class OrgShortDetailsDto(BaseModel):
    name: str
    display_name: str | None = None

    @staticmethod
    def from_entity(entity: Organization) -> "OrgShortDetailsDto":
        return OrgShortDetailsDto(
            name=entity.name,
            display_name=entity.display_name,
        )
