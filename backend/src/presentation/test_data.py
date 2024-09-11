import random
from mimesis import Person, Text, Address, Internet, Datetime, Code
from mimesis.enums import Gender
from mimesis.locales import Locale
from application.services import UserService
from domain.entities import User, Organization
from infrastructure import UnitOfWork

person = Person(Locale.EN)
text = Text(Locale.EN)
address = Address(locale=Locale.EN)
internet = Internet()
datetime = Datetime(locale=Locale.EN)
code = Code()

class TestData:
    """Test data such as users, patients, cases, etc for demo and testing purposes."""
    def __init__(self, uow: UnitOfWork, user_service: UserService):
        self._uow = uow
        self._user_service = user_service

    def add_users(self) -> None:
        user_repo = self._uow.get_repository(User)

        for _ in range(10):
            gender = random.choice([Gender.MALE, Gender.FEMALE])

            user = User(
                first_name=person.first_name(gender=gender),
                last_name=person.last_name(gender=gender),
                email=person.email(),
                password_hash="",
                country=address.country(),
                work_phone=person.telephone(),
                mobile_phone=person.telephone(),
                timezone="UTC-4",
            )
            user = self._user_service.set_password(user, "password")
            user_repo.add(user)

            print(f"Added user: {user.email}")  
    
        self._uow.commit()

    def add_organizations(self) -> None:
        org_repo = self._uow.get_repository(Organization)
        organization_names = ["test_org1", "test_org2", "test_org3", "test_org4", "test_org5"]

        for org_name in organization_names:
            organization = Organization(
                name=org_name,
                display_name=text.word(),
                website=internet.url(),
                phone=person.telephone(),
                email=person.email(),
                address=address.address(),
                dicom_url="https://demo.orthanc-server.com/dicom-web",
            )

            org_repo.add(organization)
            print(f"Added organization: {organization.name}")

        self._uow.commit()
        