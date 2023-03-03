## Installation

Install poetry:
https://python-poetry.org/

```sh
poetry config virtualenvs.in-project true
poetry install
poetry shell
```

## Running
While in the poetry shell, run
```sh
uvicorn server:app --reload
```