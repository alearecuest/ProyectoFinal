# Elio - AI-Powered Differential Diagnosis System

<p align="center">
  <img src="banner.png" alt="Elio Banner" width="100%">
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#architecture"><strong>Architecture</strong></a> ·
  <a href="#installation"><strong>Installation</strong></a> ·
  <a href="#documentation"><strong>Documentation</strong></a> ·
  <a href="#deployment"><strong>Deployment</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular">
  <img src="https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify">
  <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Gemini">
  <img src="https://img.shields.io/badge/SNOMED_CT-005EB8?style=for-the-badge&logo=healthcare&logoColor=white" alt="SNOMED CT">
</p>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Elio** is an intelligent clinical decision support system that leverages artificial intelligence (Google Gemini) to generate differential diagnoses based on patient consultation reasons and medical history. The system includes automatic coding with **SNOMED CT** standards for interoperability with healthcare information systems.

### Key Capabilities

- AI-powered differential diagnosis generation
- SNOMED CT standardized medical terminology coding
- Structured clinical documentation
- RESTful API with comprehensive documentation
- Enterprise-grade security and performance

### Live Demo

**Production:** [https://elio-frontend.onrender.com](https://elio-frontend.onrender.com)  
**API Documentation:** [https://elio-backend.onrender.com/docs](https://elio-backend.onrender.com/docs)

---

## Features

### Artificial Intelligence Integration

- Automated differential diagnosis generation using Google Gemini 2.5 Flash
- Contextualized analysis for Uruguayan healthcare epidemiology
- Intelligent suggestion of relevant patient history based on consultation reason
- Natural language processing for medical terminology

### Healthcare Interoperability

- Automatic SNOMED CT International Edition coding
- ConceptID and official terminology for each pathology
- HL7 FHIR-ready data structures
- Integration-ready with EHR/EMR systems

### Clinical Decision Support

- 3-5 differential diagnoses ranked by probability
- Detailed clinical justification for each diagnosis
- Evidence-based next action recommendations
- Risk assessment and clinical reasoning documentation

### Clinical Documentation

- Automated clinical summary generation
- Structured format for electronic health records
- Exportable documentation with standardized medical terminology
- Compliance with medical documentation standards

### Security & Performance

- Rate limiting (100 requests per 15 minutes)
- CORS configuration with origin validation
- Security headers (Helmet.js)
- Automatic session management (30-minute timeout)
- Request validation and sanitization

---

## Architecture

### System Architecture Diagram

```
┌─────────────────────┐         ┌──────────────────────┐         ┌─────────────────┐
│   Angular Frontend  │ ◄─────► │  Fastify API Server  │ ◄─────► │  Google Gemini  │
│   (TypeScript/SPA)  │  REST   │   (Node.js/TS)       │  HTTP   │  AI Service     │
└─────────────────────┘         └──────────────────────┘         └─────────────────┘
         │                               │
         │                               ▼
         │                      ┌──────────────────┐
         │                      │  Session Manager │
         │                      │   (In-Memory)    │
         └──────────────────────┴──────────────────┘
                                 
                                 ▼
                        ┌──────────────────┐
                        │   SNOMED CT      │
                        │   Codification   │
                        │   Service        │
                        └──────────────────┘
```

### Component Architecture

**Frontend Layer**
- Angular 20 with Standalone Components
- Signal-based state management
- Reactive Forms for data collection
- HTTP Client with interceptors

**Backend Layer**
- Fastify web framework
- TypeScript for type safety
- Modular service architecture
- In-memory session storage

**AI Integration Layer**
- Google Generative AI SDK
- Prompt engineering for medical context
- Response parsing and validation
- SNOMED CT mapping service

For detailed architecture documentation, see [Architecture Guide](docs/architecture/system-architecture.md).

---

## Technology Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime environment |
| TypeScript | 5.9 | Type-safe development |
| Fastify | 5.6 | Web framework |
| @google/generative-ai | 0.24.1 | AI integration |
| @fastify/cors | 11.1.0 | CORS middleware |
| @fastify/helmet | 13.0.2 | Security headers |
| @fastify/rate-limit | 10.3.0 | Rate limiting |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 20.3 | Frontend framework |
| TypeScript | 5.9 | Type-safe development |
| RxJS | 7.8 | Reactive programming |
| Angular Signals | - | State management |

### Standards & Protocols

- **SNOMED CT International Edition** - Medical terminology
- **REST API** - Communication protocol
- **OpenAPI 3.0** - API documentation
- **JSON** - Data exchange format

---

## Installation

### Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0
Git
Google Gemini API Key
```

### Quick Start

```bash
# Clone repository
git clone https://github.com/alearecuest/ProyectoFinal.git
cd ProyectoFinal

# Run setup script
chmod +x scripts/setup.sh
./scripts/setup.sh

# Configure environment variables
cd Server
cp .env.example .env
nano .env  # Add GEMINI_API_KEY

# Start development servers
cd ..
./scripts/dev.sh
```

### Manual Installation

#### Backend Setup

```bash
cd Server
npm install
cp .env.example .env
# Edit .env and configure GEMINI_API_KEY
npm run dev
```

**Environment Variables:**

```env
GEMINI_API_KEY=your_api_key_here
PORT=10000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4200,http://localhost:5173
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MINUTES=15
SESSION_TIMEOUT_MINUTES=30
GEMINI_MODEL=gemini-2.5-flash
MAX_OPTIONS=8
```

#### Frontend Setup

```bash
cd ui
npm install
npm start
```

The application will be available at:
- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:10000
- **API Docs:** http://localhost:10000/docs

---

## Usage

### API Workflow Example

#### 1. Health Check

```bash
curl http://localhost:10000/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-14T14:10:09.000Z",
  "uptime": 123.45,
  "environment": "development"
}
```

#### 2. Start Consultation

```bash
curl -X POST http://localhost:10000/start \
  -H "Content-Type: application/json" \
  -d '{
    "motivo_consulta": "Oppressive chest pain for 2 hours with radiation to left arm"
  }'
```

**Response:**
```json
{
  "patientID": "f5642460-6fb6-4941-9532-189a89a1ff8d",
  "pasoActual": "consulta",
  "opciones": [
    {
      "label": "Arterial hypertension diagnosed 5 years ago",
      "checked": false
    },
    {
      "label": "Type 2 diabetes mellitus under treatment",
      "checked": false
    }
  ]
}
```

#### 3. Collect Patient History

```bash
curl -X POST http://localhost:10000/api/collect \
  -H "Content-Type: application/json" \
  -d '{
    "id": "f5642460-6fb6-4941-9532-189a89a1ff8d",
    "opciones": [
      "Arterial hypertension diagnosed 5 years ago",
      "Type 2 diabetes mellitus under treatment",
      "Active smoking"
    ]
  }'
```

#### 4. Generate Differential Diagnosis

```bash
curl -X POST http://localhost:10000/api/diagnostico \
  -H "Content-Type: application/json" \
  -d '{
    "id": "f5642460-6fb6-4941-9532-189a89a1ff8d"
  }'
```

**Response:**
```json
{
  "Estado": "45-year-old male patient with acute chest pain...",
  "Diferenciales": [
    {
      "Patología": "Acute Myocardial Infarction",
      "Probabilidad": "Very High",
      "Justificación": "Oppressive chest pain with radiation, cardiovascular risk factors present..."
    }
  ],
  "Patologías_Codificadas": [
    {
      "Patología": "Acute Myocardial Infarction",
      "SNOMED_ConceptID": "57054005",
      "SNOMED_Term": "Acute myocardial infarction",
      "Tipo_Entidad": "Clinical Finding"
    }
  ],
  "Próxima_Acción": "1) Immediate cardiology evaluation. 2) ECG and cardiac biomarkers. 3) Emergency protocol activation."
}
```

#### 5. Generate Clinical Summary

```bash
curl -X POST http://localhost:10000/api/end \
  -H "Content-Type: application/json" \
  -d '{
    "id": "f5642460-6fb6-4941-9532-189a89a1ff8d"
  }'
```

---

## API Documentation

### Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | System health check |
| `POST` | `/start` | Initialize consultation session |
| `POST` | `/api/collect` | Store patient history |
| `POST` | `/api/diagnostico` | Generate differential diagnosis with SNOMED CT |
| `POST` | `/api/end` | Finalize consultation and generate summary |
| `GET` | `/generator/:id` | Generate additional history options |
| `GET` | `/consulta/:id` | Retrieve session state |

### Interactive Documentation

- **Swagger UI:** [http://localhost:10000/docs](http://localhost:10000/docs)
- **OpenAPI Spec:** [http://localhost:10000/docs/json](http://localhost:10000/docs/json)
- **Postman Collection:** [docs/api/postman-collection.json](docs/api/postman-collection.json)

For detailed API documentation, see [API Reference](docs/api/endpoints.md).

---

## Testing

### Backend Tests

```bash
cd Server

# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

### Frontend Tests

```bash
cd ui

# Run unit tests
npm test

# Run end-to-end tests
npm run e2e

# Generate coverage report
npm run test:coverage
```

### Code Quality

```bash
# Linting
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

---

## Deployment

### Docker Deployment

```bash
# Development environment
docker-compose up

# Production environment
docker-compose -f docker-compose.prod.yml up -d
```

### Cloud Deployment (Render.com)

**Backend Configuration:**
```yaml
services:
  - type: web
    name: elio-backend
    env: node
    buildCommand: cd Server && npm install && npm run build
    startCommand: cd Server && npm run prod
    envVars:
      - key: GEMINI_API_KEY
        sync: false
      - key: NODE_ENV
        value: production
```

**Frontend Configuration:**
```yaml
services:
  - type: web
    name: elio-frontend
    env: static
    buildCommand: cd ui && npm install && npm run build
    staticPublishPath: ui/dist/ui/browser
```

For detailed deployment instructions, see [Deployment Guide](docs/deployment/production.md).

---

## Project Structure

```
ProyectoFinal/
├── Server/                 # Backend API
│   ├── ai/                # AI service integration
│   ├── endpoints/         # Route handlers
│   ├── utils/             # Utility functions
│   ├── config.ts          # Configuration
│   ├── server.ts          # Application entry point
│   └── session.ts         # Session management
│
├── ui/                    # Frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── models/
│   │   └── environments/
│   └── proxy.conf.json
│
├── docs/                  # Documentation
│   ├── architecture/
│   ├── api/
│   └── deployment/
│
├── .github/               # CI/CD workflows
│   └── workflows/
│
├── scripts/               # Automation scripts
├── README.md
├── Project_Charter.md
└── docker-compose.yml
```

---

## Contributing

Contributions are welcome. Please read the [Contributing Guide](docs/contributing/CONTRIBUTING.md) before submitting pull requests.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/feature-name`)
3. Commit changes following conventional commits (`git commit -m 'feat: add new feature'`)
4. Push to the branch (`git push origin feature/feature-name`)
5. Open a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Test additions or modifications
- `chore:` Maintenance tasks

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Google Gemini API](https://ai.google.dev/gemini-api) - Artificial Intelligence Platform
- [SNOMED International](https://www.snomed.org/) - Standardized Medical Terminology
- [Fastify Framework](https://fastify.dev/) - Backend Web Framework
- [Angular Platform](https://angular.dev/) - Frontend Application Framework

---
