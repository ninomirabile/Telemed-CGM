# 🏗️ Architettura del Sistema

## Panoramica

Telemed-CGM è un sistema di telemonitoraggio glicemico continuo che combina un frontend React moderno con un backend FastAPI robusto per fornire un'esperienza di monitoraggio in tempo reale.

## Architettura Generale

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React)       │◄──►│   (FastAPI)     │◄──►│  (PostgreSQL)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Browser       │    │   Redis Cache   │    │   File Storage  │
│   (Chrome, etc) │    │   (Sessions)    │    │   (Logs, etc)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Frontend Architecture

### Stack Tecnologico
- **React 18+**: Framework UI principale
- **TypeScript 5+**: Type safety e developer experience
- **Vite**: Build tool veloce e moderno
- **TailwindCSS**: Utility-first CSS framework
- **Zustand**: State management leggero
- **React Query**: Data fetching e caching
- **Recharts**: Visualizzazioni grafiche

### Struttura Componenti
```
src/
├── components/
│   ├── ui/           # Componenti base riutilizzabili
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── charts/       # Componenti grafici
│   │   ├── GlucoseChart.tsx
│   │   └── TrendChart.tsx
│   ├── alerts/       # Componenti alert
│   │   ├── AlertTable.tsx
│   │   └── AlertCard.tsx
│   └── layout/       # Layout components
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
├── hooks/            # Custom hooks
├── services/         # API services
├── stores/           # State management
├── utils/            # Utility functions
└── pages/            # Page components
```

### State Management
```typescript
// Zustand Store Structure
interface GlucoseStore {
  // State
  readings: GlucoseReading[]
  alerts: Alert[]
  currentMode: 'mock' | 'real'
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchReadings: () => Promise<void>
  fetchAlerts: () => Promise<void>
  forceReading: () => Promise<void>
  setMode: (mode: 'mock' | 'real') => void
}
```

## Backend Architecture

### Stack Tecnologico
- **FastAPI**: Framework web moderno e veloce
- **SQLAlchemy**: ORM per database
- **Pydantic**: Validazione dati
- **Celery**: Task asincroni
- **Redis**: Caching e sessioni
- **PostgreSQL**: Database principale
- **Uvicorn**: ASGI server

### Struttura API
```
app/
├── api/
│   ├── v1/
│   │   ├── glucose.py      # Endpoint glucosio
│   │   ├── alerts.py       # Endpoint alert
│   │   └── health.py       # Health check
├── core/
│   ├── config.py           # Configurazione
│   ├── security.py         # Sicurezza
│   └── database.py         # Database
├── models/
│   ├── glucose.py          # Modelli glucosio
│   └── alert.py            # Modelli alert
├── services/
│   ├── glucose_service.py  # Logica business
│   └── alert_service.py    # Gestione alert
└── utils/
    ├── validators.py       # Validatori
    └── helpers.py          # Helper functions
```

### Database Schema
```sql
-- Tabella letture glucosio
CREATE TABLE glucose_readings (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    value DECIMAL(5,2) NOT NULL,
    trend VARCHAR(20),
    mode VARCHAR(10) DEFAULT 'mock',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabella alert
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    glucose_reading_id INTEGER REFERENCES glucose_readings(id),
    alert_type VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(10) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Data Flow

### 1. Lettura Glucosio
```
Sensore → Backend → Database → Frontend → UI
   ↓         ↓         ↓         ↓        ↓
  CGM    FastAPI   PostgreSQL  React   Chart
```

### 2. Sistema Alert
```
Database → Alert Service → Notification → Frontend
    ↓           ↓              ↓            ↓
  Reading   Threshold    Email/SMS      UI Update
```

### 3. Polling Real-time
```
Frontend → API → Backend → Database → Response
    ↓        ↓       ↓         ↓         ↓
  React   Fetch   FastAPI   PostgreSQL  JSON
```

## Sicurezza

### Autenticazione
- JWT tokens per API
- Session management con Redis
- Rate limiting per endpoint
- CORS configurato

### Validazione
- Input sanitization
- SQL injection prevention
- XSS protection
- CSRF tokens

### Privacy
- GDPR compliance ready
- Data encryption at rest
- Secure headers
- Audit logging

## Performance

### Frontend
- Code splitting
- Lazy loading
- Bundle optimization
- CDN per assets

### Backend
- Database indexing
- Query optimization
- Redis caching
- Connection pooling

### Monitoring
- Application metrics
- Error tracking
- Performance monitoring
- Health checks

## Integrazione con sensori reali

Un bridge software (es. script Python, app mobile, microservizio) può leggere i dati dal sensore del paziente e inviarli al backend tramite POST su `/glucose/fetch`.

```
Sensore → Bridge → Backend (FastAPI) → Database → Frontend
```

## Deployment

- Per sviluppo: usa gli script `start.sh` e `stop.sh` per avviare l'intero stack (backend, frontend, database, redis).
- Per produzione: builda il frontend (`npm run build`) e avvia il backend con Gunicorn/Uvicorn.
- Le pipeline CI/CD sono gestite tramite GitHub Actions.

## Scalabilità

### Orizzontale
- Load balancing
- Auto-scaling
- Database sharding
- Microservices ready

### Verticale
- Resource optimization
- Caching strategies
- Database optimization
- CDN utilization

## Monitoring e Logging

### Application Monitoring
- Error tracking (Sentry)
- Performance monitoring
- User analytics
- Health checks

### Infrastructure Monitoring
- Server metrics
- Database performance
- Network latency
- Resource utilization

### Logging
- Structured logging
- Log aggregation
- Error reporting
- Audit trails

## Disaster Recovery

### Backup Strategy
- Database backups
- File system backups
- Configuration backups
- Code repository

### Recovery Procedures
- Database restoration
- Service recovery
- Data validation
- Rollback procedures

---

**Autore**: Antonino Mirabile  
**Ultimo aggiornamento**: 2024  
**Versione**: 1.0.0 