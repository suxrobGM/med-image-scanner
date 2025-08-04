# Backend

Backend app that serves the frontend app and built with FastAPI backed by a PostgreSQL database.

## How to run the app

1. If you haven't installed Poetry yet, you can do so by following the instructions [here](https://python-poetry.org/docs/). Optionally, you can configure Poetry to create virtual environments within the project directory. This is recommended for better project isolation. Run the following command:

```shell
poetry config virtualenvs.in-project true
```

2. Install the dependencies

```shell
cd ./backend
poetry install
```

3. Create a database instance in your local PostgreSQL server and name it **MedScannerDB**. Update database connection values in the `.env` file. You can copy the `.env.default` file and rename it to `.env`. Update the following values: `DB_USER`, `DB_PASSWORD`, `DB_HOST`.

4. Apply the migrations

```shell
poetry run alembic upgrade head

# or use the script for Windows
.\scripts\apply-migration.cmd
```

5. (Optional) Seed the database with some test data

```shell
cd src && poetry run python -m presentation.seed_db && cd ..

# or use the script for Windows
.\scripts\seed_db.cmd
```

6. Run the application

```shell
poetry run fastapi run src/main.py

# or use the script for Windows
.\scripts\run-app.cmd
```

Open the browser and navigate to `http://localhost:8000/docs` to see the API documentation.

## How to test email sending on the local environment

1. Download and install [SMTP4Dev](https://github.com/rnwood/smtp4dev/releases)
2. Run the smtp4dev server. You can view the emails sent by the app by navigating to `http://localhost:5000` in your browser.
3. Update the email settings in the `.env` file.
You can copy the `.env.default` file and rename it to `.env`. Update the following values: `SMTP_HOST` should be `localhost`, `SMTP_PORT` should be `25`.
