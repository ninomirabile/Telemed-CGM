# 🏥 Telemed-CGM Frontend

Frontend React per il sistema di telemonitoraggio glicemico continuo (CGM), sviluppato con tecnologie moderne e best practice.

## 🚀 Caratteristiche

- **📊 Visualizzazione Real-time**: Grafici interattivi per monitoraggio glucosio
- **🚨 Sistema Alert**: Gestione notifiche per valori fuori soglia
- **📱 Design Responsive**: Ottimizzato per dispositivi mobili e desktop
- **🔧 Modalità Mock**: Simulazione completa per sviluppo
- **⚡ Performance**: Ottimizzazioni per velocità e efficienza
- **🧪 Testing Completo**: Unit, integration e E2E tests
- **🎨 Design System**: Componenti riutilizzabili e consistenti

## 🛠️ Stack Tecnologico

### Core
- **React 18+** - Framework UI principale
- **TypeScript 5+** - Type safety e developer experience
- **Vite** - Build tool veloce e moderno
- **TailwindCSS** - Utility-first CSS framework

### State Management & Data
- **Zustand** - State management leggero
- **React Query** - Data fetching e caching
- **React Hook Form** - Gestione form ottimizzata

### UI & Visualization
- **Recharts** - Grafici interattivi
- **Lucide React** - Icone moderne
- **Custom Design System** - Componenti medical-grade

### Development Tools
- **ESLint + Prettier** - Code quality
- **Husky + lint-staged** - Pre-commit hooks
- **Vitest** - Unit testing
- **Playwright** - E2E testing

## 📦 Installazione

### Prerequisiti
- Node.js 18+
- npm 9+

### Setup
```bash
# Installazione dipendenze
npm install

# Copia file environment
cp env.example .env

# Avvio sviluppo
npm run dev
```

## 🔧 Script Disponibili

### Development
```bash
npm run dev          # Avvia server sviluppo
npm run build        # Build produzione
npm run preview      # Preview build
```

### Code Quality
```bash
npm run lint         # ESLint check
npm run lint:fix     # ESLint fix automatico
npm run format       # Prettier format
npm run type-check   # TypeScript check
```

### Testing
```bash
npm run test         # Unit tests (watch mode)
npm run test:ui      # Unit tests con UI
npm run test:ci      # Unit tests per CI
npm run test:e2e     # E2E tests
npm run test:e2e:ui  # E2E tests con UI
```

## 🏗️ Architettura

```
src/
├── components/          # Componenti React
│   ├── ui/             # Componenti base (Button, Card, etc.)
│   ├── charts/         # Componenti grafici
│   ├── alerts/         # Componenti alert
│   └── layout/         # Layout components
├── hooks/              # Custom hooks
├── services/           # API services
├── stores/             # State management (Zustand)
├── utils/              # Utility functions
├── pages/              # Page components
└── types/              # TypeScript definitions
```

## 🎨 Design System

### Colori
- **Primary**: Blu medical (#2563eb)
- **Success**: Verde normale (#16a34a)
- **Warning**: Giallo pre-iperglicemia (#ca8a04)
- **Danger**: Rosso iper/ipoglicemia (#dc2626)

### Componenti
- **Button**: Varianti primary, secondary, success, warning, danger
- **Card**: Container con header, body, footer
- **Badge**: Indicatori di stato
- **Chart**: Grafici con threshold lines

## 🔌 API Integration

### Endpoints
- `GET /glucose/mock` - Letture glucosio simulate
- `POST /glucose/fetch` - Forza nuova lettura o invia dati reali
- `GET /alerts/active` - Lista alert attivi

### Esempio di .env
```
VITE_API_BASE_URL=http://localhost:8000
VITE_CGM_MODE=mock
VITE_POLLING_INTERVAL=10000
VITE_ALERT_THRESHOLD_HIGH=180
VITE_ALERT_THRESHOLD_LOW=70
VITE_ALERT_THRESHOLD_CRITICAL_HIGH=250
VITE_ALERT_THRESHOLD_CRITICAL_LOW=50
```

### Debug avanzato
- In sviluppo è attivo il pannello React Query Devtools (TanStack Query) per il debug delle query API e della cache.

### Error Handling
- Retry automatico con exponential backoff
- Error boundaries per componenti
- Toast notifications per errori

## 🧪 Testing Strategy

### Unit Tests (Vitest)
- Componenti React
- Custom hooks
- Utility functions
- Store actions

### E2E Tests (Playwright)
- User workflows
- Critical paths
- Cross-browser testing

### Coverage Goals
- Unit tests: >80%
- E2E tests: Critical paths

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Features
- Mobile-first approach
- Touch-friendly interactions
- Optimized charts per mobile

## 🔒 Sicurezza

### Best Practices
- Input validation
- XSS prevention
- Secure headers
- Environment variables

### Privacy
- GDPR compliance ready
- Data minimization
- User consent management

## 🚀 Performance

### Ottimizzazioni
- Code splitting
- Lazy loading
- Bundle optimization
- Image optimization

### Metrics Target
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

## 📚 Documentazione

### Componenti
Ogni componente include:
- Props interface
- Usage examples
- Accessibility notes

### API
- TypeScript definitions
- Error handling
- Response formats

## 🤝 Contribuire

### Setup Development
1. Fork repository
2. Clone localmente
3. Install dependencies
4. Setup environment
5. Run tests

### Code Standards
- Conventional Commits
- ESLint + Prettier
- TypeScript strict mode
- Test coverage

### Pull Request
- Feature branch
- Tests pass
- Documentation updated
- Code review

## 📄 Licenza

**Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**

**Autore**: Antonino Mirabile

Per utilizzi commerciali, contattare l'autore direttamente.

## 🏥 Disclaimer Medico

**ATTENZIONE**: Questo software è destinato esclusivamente a scopi di ricerca e sviluppo. Non è approvato per uso clinico senza le appropriate autorizzazioni regolatorie.

---

**Sviluppato con ❤️ per la comunità medica e di ricerca**
