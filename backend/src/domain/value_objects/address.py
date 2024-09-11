
from dataclasses import dataclass


@dataclass(frozen=True)
class Address:
    street: str
    city: str
    state: str
    zip_code: str
    country: str

    def __eq__(self, other):
        return (
            self.street == other.street
            and self.city == other.city
            and self.state == other.state
            and self.zip_code == other.zip_code
            and self.country == other.country
        )

    def __str__(self):
        return f"{self.street}, {self.city}, {self.state} {self.zip_code}, {self.country}"
