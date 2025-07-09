# 🏥 Telemed-CGM Backend

Backend FastAPI per il sistema di telemonitoraggio glicemico continuo (CGM).

## ⚙️ Note su Linting e CI/CD

- Le regole di linting Python (flake8) sono state rilassate per facilitare lo sviluppo:
  - La lunghezza massima delle righe è ora 120 caratteri.
  - Gli errori E501 (linea troppo lunga) e W291 (spazi finali) sono ignorati (vedi file `.flake8`).
- Il check di formattazione Black non blocca più il workflow in caso di file non formattati (vedi `.github/workflows/ci.yml`).

## 🚀 Deploy Railway (opzionale)

- Il deploy automatico su Railway è opzionale.
- Se non hai un account Railway o non vuoi usare questo servizio, puoi ignorare o commentare lo step relativo nel workflow di deploy.
- Per abilitare il deploy su Railway:
  1. Crea un account su https://railway.app/
  2. Crea un progetto e un servizio.
  3. Imposta i secrets `RAILWAY_TOKEN` e `RAILWAY_SERVICE_ID` su GitHub.
  4. Riattiva lo step nel file `.github/workflows/deploy.yml`.

## 🚀 Stack
- FastAPI
- SQLAlchemy (PostgreSQL)
- Redis
- Pydantic
- Pytest

## 📦 Setup

```bash
# Crea e attiva virtualenv
python3 -m venv venv
source venv/bin/activate

# Installa dipendenze
pip install -r requirements.txt

# Copia file env
cp .env.example .env

# Avvia sviluppo
uvicorn app.main:app --reload
```

## 🧪 Testing

```bash
pytest
```

## 🗄️ Migrazioni Database

```bash
# Genera nuova migrazione
alembic revision --autogenerate -m "descrizione"

# Applica tutte le migrazioni
alembic upgrade head
```

## 📡 Ingestione dati reali

Per inviare una lettura reale:
```bash
curl -X POST http://localhost:8000/glucose/fetch \
  -H "Content-Type: application/json" \
  -d '{"timestamp": "2024-07-08T12:00:00", "value": 110.5, "trend": "rising", "mode": "real"}'
```

## 📄 Licenza
Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)

Autore: Antonino Mirabile 