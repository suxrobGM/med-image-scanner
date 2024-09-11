@echo off

cd ../

:prompt
set "MigrationName="
set /p MigrationName="Enter Migration Name: "

if "%MigrationName%" == "" (
    echo Error: Migration name cannot be empty.
    goto prompt
)

echo Running migration...
poetry run alembic revision --autogenerate -m "%MigrationName%"

echo Migrations completed.

echo Do you want to apply migrations (y/n):
set /p ApplyMigrationResult=

if /I "%ApplyMigrationResult%" == "y" (
    cd ./scripts
	call ./apply-migration.cmd
)

pause
