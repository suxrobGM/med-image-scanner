from enum import Enum
from typing import Self


class UserRoleType(str, Enum):
    """Default built-in roles"""
    SUPER_ADMIN = "super_admin" # System-wide admin
    APP_ADMIN = "app_admin" # Application-level admin
    ORG_ADMIN = "org_admin" # Organization-level admin

    @classmethod
    def has_value(cls: type[Self], value: str) -> bool:
        return value in cls._value2member_map_
    
    @classmethod
    def is_app_admin(cls: type[Self], value: str) -> bool:
        return value == cls.APP_ADMIN or value == cls.SUPER_ADMIN
