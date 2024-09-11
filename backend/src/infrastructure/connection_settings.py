from application.utils import getenv_required

class DbConnectionSettings:
    host: str = getenv_required("DB_HOST")
    port: int = int(getenv_required("DB_PORT"))
    username: str = getenv_required("DB_USER")
    password: str = getenv_required("DB_PASSWORD")
    database: str = getenv_required("DB_NAME")
    connection_url: str = f"postgresql://{username}:{password}@{host}:{port}/{database}"
