from domain.entities import User, UserRole, Organization
from domain.enums import UserRoleType
from application.services import UserService
from application.utils import getenv_required
from infrastructure import UnitOfWork
from .test_data import TestData


class SeedDb:
    _uow = UnitOfWork()
    _user_service = UserService(_uow)

    def seed(self):
        """Seed the database with initial data"""
        print("Seeding the database...")

        with self._uow:
            demo_organization = self.add_demo_organization()
            self.add_superadmin(demo_organization)

            # Add test data
            test_data = TestData(self._uow, self._user_service)
            test_data.add_users()
            test_data.add_organizations()
            print("Test data added successfully")

        print("Database seeded successfully")

    def add_superadmin(self, organization: Organization) -> None:
        """Add an super admin account if it doesn't exist in the database.
        The default admin email and password are defined in the environment variables: `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
        """
        admin_email = getenv_required("ADMIN_EMAIL")
        user_repo = self._uow.get_repository(User)
        admin_exists = user_repo.exists(User.email == admin_email)

        if admin_exists:
            return

        admin = User(
            first_name="Admin",
            last_name="Admin",
            email=admin_email,
            password_hash="",
            organization=organization,
        )

        admin.role = UserRole(
            user_id=admin.id,
            role_type=UserRoleType.SUPER_ADMIN,
        )
        
        password = getenv_required("ADMIN_PASSWORD")
        self._user_service.set_password(admin, password)
        user_repo.add(admin)
        self._uow.commit()
        print("Super admin user added successfully")

    def add_demo_organization(self) -> Organization:
        """Add a default organization with DICOM URL Orthanc"""
        org_repo = self._uow.get_repository(Organization)
        existing_org = org_repo.get_one(Organization.name == "orthanc_demo")

        if existing_org:
            return existing_org
        
        org = Organization(
            name="orthanc_demo",
            display_name="Orthanc Demo",
            dicom_url="https://demo.orthanc-server.com/dicom-web" # Orthanc demo server
        )

        org_repo.add(org)
        self._uow.commit()
        print("Orthanc Demo organization added successfully")
        return org

if __name__ == "__main__":
    seed_db = SeedDb()
    seed_db.seed()
