# 🏥 Telemed-CGM Backend

Backend FastAPI per il sistema di telemonitoraggio glicemico continuo (CGM).

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