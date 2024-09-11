@echo off

cd ../
echo Applying migrations...
poetry run alembic upgrade head

echo Successfully applied migrations.
pause
