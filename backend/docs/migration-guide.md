# Database migration guide
The project uses SQLModel to interact with the database. The database is managed by Alembic. To create a new migration, run the following command:

```bash
poetry run alembic revision --autogenerate -m "version_{version_number}"
```

Replace `{version_number}` with the version number of the migration. For example, if the current version is `0001`, the next version will be `0002` (with padding zeros). After running the command, a new migration file will be created in the `src/infrastructure/migrations/versions` directory. To apply the migration, run the following command:

```bash
poetry run alembic upgrade head
```
