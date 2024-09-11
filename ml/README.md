# ML Models App


## How to run the app
1. If you haven't installed Poetry yet, you can do so by following the instructions [here](https://python-poetry.org/docs/). Optionally, you can configure Poetry to create virtual environments within the project directory. This is recommended for better project isolation. Run the following command:
```shell
poetry config virtualenvs.in-project true
```

2. Install the dependencies
```shell
poetry install
```

3. Create a `.env` file from the `.env.default` file and change default values if needed
```shell
cp .env.default .env
```

4. Run the application in development mode
```shell
poetry run fastapi dev src/main.py --port 8004
```

Or you can run the application in production mode
```shell
poetry run fastapi run src/main.py --port 8004
```

Open the browser and navigate to `http://localhost:8004/docs` to see the API documentation.
