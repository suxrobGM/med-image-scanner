import bcrypt
from sqlalchemy import UUID
from core import DIContainer, Result
from domain.entities import User, UserRole
from domain.enums import UserRoleType
from infrastructure import UnitOfWork

@DIContainer.register_scoped()
class UserService:
    def __init__(self, uow: UnitOfWork):
        self._uow = uow

    def set_password(self, user: User, password: str) -> User:
        """
        Set the password hash of the given user entity.
        Args:
            user (User): User entity
            password (str): Plain password to set
        Returns:
            User: Created user entity
        """
        # Convert the plain password to bytes
        password_bytes = password.encode("utf-8")

        # Generate a salt and hash the password
        hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt())

        # Convert the hashed password back to string for storage
        user.password_hash = hashed_password.decode("utf-8")
        return user
    
    def verify_password(self, user: User, password: str) -> bool:
        """
        Verify the password of the given user entity with the given password.
        Args:
            user (User): User entity
            password (str): Plain password
        Returns:
            bool: True if the password is correct, False otherwise
        """
        # Convert the plain password to bytes
        password_bytes = password.encode("utf-8")

        # Convert the stored password hash to bytes
        stored_password_hash = user.password_hash.encode("utf-8")

        # Verify the password
        return bcrypt.checkpw(password_bytes, stored_password_hash)
    
    def check_password_strength(self, password: str) -> bool:
        """
        Check if the given password is valid.

        Rules:
            - The password must be at least 8 characters
            - The password must contain at least one uppercase letter
            - The password must contain at least one lowercase letter
            - The password must contain at least one digit
            - The password must contain at least one special character (`!@#$%^&*`)
        Args:
            password (str): Plain password
        Returns:
            bool: True if the password is valid, False otherwise
        """
        # Check the length
        if len(password) < 8:
            return False

        # Check for uppercase, lowercase, digit, and special character
        has_upper = False
        has_lower = False
        has_digit = False
        has_special = False

        for char in password:
            if char.isupper():
                has_upper = True
            elif char.islower():
                has_lower = True
            elif char.isdigit():
                has_digit = True
            elif char in "!@#$%^&*":
                has_special = True

        return has_upper and has_lower and has_digit and has_special
    
    def find_user_by_email(self, email: str) -> User | None:
        """
        Find a user entity with the given email.
        Args:
            email (str): Email address
        Returns:
            User | None: User entity or None
        """
        user_repo = self._uow.get_repository(User)
        return user_repo.get_one(User.email == email)
    
    def update_user_role(self, user: User, role: str) -> Result:
        """
        Update the role of the given user entity.
        Args:
            user (User): User entity
            role (str): New role to set
        Returns:
            Result: Result object
        """
        if not UserRoleType.has_value(role):
            return Result.fail("Invalid user role")

        user_role_repo = self._uow.get_repository(UserRole)
        existing_role = user_role_repo.get_one(UserRole.user_id == user.id)

        # Check if the user already has a role
        if existing_role:
            existing_role.role_type = role
            user_role_repo.update(existing_role)
        else:
            # Create a new role if the user does not have one
            new_role = UserRole(
                role_type=role,
                user_id=user.id,
                organization=user.organization
            )
            user_role_repo.add(new_role)
        
        return Result.succeed()
