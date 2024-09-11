from core.di_container import DIContainer
from application.utils import valid_uuid
from domain.entities import Organization
from infrastructure import UnitOfWork


@DIContainer.register_scoped()
class OrganizationService:
    def __init__(self, uow: UnitOfWork):
        self._uow = uow

    def get_organization(self, organization_id: str) -> Organization | None:
        """
        Find an organization by its ID or name.
        Args:
            organization_id (str): The ID or name of the organization to get.
        Returns:
            Organization | None: The organization if found, otherwise None.
        """
        org_repo = self._uow.get_repository(Organization)

        if valid_uuid(organization_id):
            organization = org_repo.get_one(Organization.id == organization_id)
        else:
            organization = org_repo.get_one(Organization.name == organization_id)
        
        return organization
