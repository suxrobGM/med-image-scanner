FROM python:3.12-alpine
EXPOSE 8000

ENV PATH="${PATH}:/root/.local/bin"

# Install build dependencies
RUN apk add --no-cache gcc musl-dev libffi-dev bash

# Set the working directory
WORKDIR /app

# Copy poetry.lock and pyproject.toml
COPY poetry.lock pyproject.toml ./

# Install poetry
RUN python3 -m pip install pipx
RUN python3 -m pipx ensurepath --global
RUN python3 -m pipx install poetry

# Set poetry to create venvs inside the project
RUN poetry config virtualenvs.in-project true

# Install the dependencies
RUN poetry install

# Copy the rest of the application code
COPY . .

RUN mv .env.default .env

# Run the application
CMD ["poetry", "run", "fastapi", "run", "src/main.py"]
