# registro_gastos_front

Frontend React para registro y reporte de gastos.

## Requisitos

- Node.js 18+ (recomendado 20 o 22)

## Instalación local

1. Instala dependencias:

```bash
npm install
```

## Scripts útiles

- `npm run start` — Inicia el servidor de desarrollo
- `npm run build` — Genera el build de producción
- `npm run lint` — Verifica reglas de estilo
- `npm run format` — Aplica formato automático
- `npm test` — Ejecuta los tests

## SonarCloud

El análisis se ejecuta automáticamente en CI. Para análisis local:

```bash
sonar-scanner -Dproject.settings=sonar-project-front.properties
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
