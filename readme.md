# registro_gastos

API Flask para registro y reporte de gastos.

## Requisitos

- Python 3.12+
- MySQL (o Docker)

## Instalación local

1. Crear entorno y activar
2. Instalar dependencias

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Variables de entorno

Configura la conexión a base de datos según tu entorno. Ejemplo:

- `MYSQL_HOST`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DB`

## Ejecutar en local

```bash
python app.py
```

## Docker (deploy/update)

```bash
git pull && docker compose build --no-cache && docker compose up --force-recreate -d
```

## Calidad

### Lint

```bash
ruff check .
```

### Format check

```bash
black --check .
```

### Format (apply)

```bash
black .
```

### Tests

```bash
pytest
```

### Coverage (local)

```bash
pytest --cov=app --cov-report=xml:coverage.xml --cov-report=html
```

## SonarCloud (local)

Requiere `SONAR_TOKEN` exportado en tu shell y el `projectKey` correcto.

```bash
sonar-scanner -Dproject.settings=sonar-project.properties
```
