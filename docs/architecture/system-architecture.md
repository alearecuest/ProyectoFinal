# System Architecture

## Table of Contents

- [Overview](#overview)
- [Architecture Diagram](#architecture-diagram)
- [Component Details](#component-details)
- [Data Flow](#data-flow)
- [Technology Decisions](#technology-decisions)
- [Scalability Considerations](#scalability-considerations)
- [Security Architecture](#security-architecture)

---

## Overview

Elio is built using a modern **client-server architecture** with clear separation of concerns. The system consists of three primary layers:

1. **Presentation Layer:** Angular-based single-page application
2. **Application Layer:** Fastify REST API server
3. **Integration Layer:** Google Gemini AI service

### Architecture Principles

- **Separation of Concerns:** Clear boundaries between frontend, backend, and external services
- **Stateless API:** RESTful design with session management
- **Type Safety:** TypeScript across the entire stack
- **API-First Design:** Backend exposes well-documented REST endpoints
- **Scalability:** Horizontal scaling capability for production deployment

---

## Architecture Diagram

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │            Angular 20 Frontend (SPA)                      │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐    │  │
│  │  │ Components  │  │   Services   │  │  HTTP Client   │    │  │
│  │  └─────────────┘  └──────────────┘  └────────────────┘    │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS / REST API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Application Layer                          │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Fastify API Server                           │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐    │  │
│  │  │   Routes    │  │ Controllers  │  │   Middleware   │    │  │
│  │  └─────────────┘  └──────────────┘  └────────────────┘    │  │
│  │                                                           │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐    │  │
│  │  │  Services   │  │   Session    │  │   Validators   │    │  │
│  │  └─────────────┘  └──────────────┘  └────────────────┘    │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS / AI API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Integration Layer                          │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │           Google Gemini AI Service                        │  │
│  │  - Natural Language Processing                            │  │
│  │  - Differential Diagnosis Generation                      │  │
│  │  - Medical History Suggestions                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │           SNOMED CT Mapping Service                       │  │
│  │  - Medical Terminology Standardization                    │  │
│  │  - ConceptID Assignment                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Detailed Component Architecture

```
Frontend (Angular)
├── app/
│   ├── components/
│   │   ├── home/
│   │   ├── antecedentes/
│   │   ├── diagnostico/
│   │   └── resumen/
│   ├── services/
│   │   └── api.service.ts
│   └── models/
│       ├── consultation.model.ts
│       └── diagnosis.model.ts
│
Backend (Fastify)
├── ai/
│   ├── gemini.ts              # AI service integration
│   └── mockResponses.ts       # Development mocks
├── endpoints/
│   ├── start.ts               # POST /start
│   ├── collect.ts             # POST /api/collect
│   ├── diagnostico.ts         # POST /api/diagnostico
│   └── end.ts                 # POST /api/end
├── utils/
│   └── validators.ts
├── config.ts                  # Configuration management
├── session.ts                 # Session management
└── server.ts                  # Application entry point
```

---

## Component Details

### Frontend Layer

**Technology:** Angular 20, TypeScript 5.9

**Responsibilities:**
- User interface rendering
- Form validation and data collection
- State management using Angular Signals
- HTTP communication with backend API
- Error handling and user feedback

**Key Components:**

1. **Home Component**
   - Initial consultation form
   - Captures chief complaint (motivo_consulta)
   - Initiates session with backend

2. **Antecedentes Component**
   - Displays AI-generated history options
   - Checkbox selection interface
   - "Generate more options" functionality

3. **Diagnostico Component**
   - Displays differential diagnoses
   - Shows SNOMED CT codes
   - Presents clinical reasoning
   - Probability indicators

4. **Resumen Component**
   - Final clinical summary
   - Exportable documentation
   - Complete case overview

**Services:**

- **ApiService:** Centralized HTTP communication
- **StateService:** Application state management
- **ErrorService:** Error handling and logging

### Backend Layer

**Technology:** Fastify 5.6, TypeScript 5.9, Node.js 18+

**Responsibilities:**
- RESTful API endpoint exposure
- Request validation and sanitization
- Session management (in-memory)
- AI service orchestration
- SNOMED CT mapping
- Rate limiting and security

**Key Modules:**

1. **Server Configuration**
   ```typescript
   - Port binding: 0.0.0.0:10000
   - CORS: Configurable origins
   - Helmet: Security headers
   - Rate Limit: 100 req/15min
   ```

2. **Session Management**
   ```typescript
   interface PatientSession {
     id: string;                  // UUID
     motivo_consulta: string;
     opciones: string[];
     diagnostico?: DiagnosticoResponse;
     resumen_clinico?: string;
     timestamp: Date;
   }
   ```

3. **AI Integration**
   - Gemini API client initialization
   - Prompt engineering for medical context
   - Response parsing and validation
   - Error handling and fallbacks

4. **SNOMED CT Mapping**
   - Pathology identification
   - ConceptID lookup
   - Official terminology assignment
   - Structured coding response

### Integration Layer

**Google Gemini AI**

- **Model:** gemini-2.5-flash
- **Purpose:** Natural language understanding and generation
- **Input:** Structured prompts with medical context
- **Output:** JSON-formatted medical analysis

**SNOMED CT Integration**

- **Standard:** SNOMED CT International Edition
- **Purpose:** Medical terminology standardization
- **Implementation:** AI-powered mapping
- **Output:** ConceptID + Official Term

---

## Data Flow

### Consultation Workflow

```
1. User Input (Frontend)
   └─> POST /start
       └─> Generate session ID
           └─> AI: Generate history options
               └─> Return: {patientID, opciones[]}

2. History Selection (Frontend)
   └─> POST /api/collect
       └─> Store selected options in session
           └─> Return: {success, partialState}

3. Diagnosis Generation (Frontend)
   └─> POST /api/diagnostico
       └─> AI: Analyze case
           └─> AI: Generate differential diagnoses
               └─> AI: Map to SNOMED CT
                   └─> Return: {Diferenciales[], Patologías_Codificadas[]}

4. Clinical Summary (Frontend)
   └─> POST /api/end
       └─> Generate structured summary
           └─> Mark session as complete
               └─> Return: {resumen, sessionClosed}
```

### Session Lifecycle

```
Session Created
    │
    ├─> Active (user interaction)
    │   └─> Timeout after 30 min inactivity
    │
    ├─> Completed (POST /api/end)
    │   └─> Marked for cleanup
    │
    └─> Expired
        └─> Purged by cleanup job (every 5 min)
```

---

## Technology Decisions

### Why Fastify?

- **Performance:** 2-3x faster than Express.js
- **Type Safety:** First-class TypeScript support
- **Plugin System:** Modular architecture
- **JSON Schema:** Built-in validation
- **Low Overhead:** Minimal memory footprint

### Why Angular 20?

- **Enterprise Ready:** Production-proven framework
- **Type Safety:** TypeScript integration
- **Signals:** Modern reactive state management
- **Standalone Components:** Reduced boilerplate
- **CLI Tools:** Excellent developer experience

### Why Google Gemini?

- **Medical Context:** Strong medical knowledge base
- **Structured Output:** JSON mode support
- **Cost Effective:** Free tier for development
- **Performance:** Fast response times
- **Reliability:** Google infrastructure

### Why In-Memory Sessions?

- **Simplicity:** No database setup required
- **Performance:** Fast read/write operations
- **Privacy:** Data not persisted
- **Compliance:** Easier HIPAA considerations
- **Scalability:** Redis can replace in future

---

## Scalability Considerations

### Current Limitations

- **In-Memory Sessions:** Limited by server RAM
- **Single Instance:** No horizontal scaling
- **No Persistence:** Server restart clears sessions
- **API Quota:** Gemini free tier limits

### Future Enhancements

1. **Session Storage**
   - Redis for distributed sessions
   - MongoDB for audit logging
   - PostgreSQL for analytics

2. **Horizontal Scaling**
   - Load balancer (Nginx/HAProxy)
   - Multiple backend instances
   - Shared session store

3. **Caching**
   - Response caching for common queries
   - AI response caching
   - CDN for frontend assets

4. **Monitoring**
   - Prometheus metrics
   - Grafana dashboards
   - Error tracking (Sentry)

---

## Security Architecture

### Defense in Depth

```
Layer 1: Network
├─> HTTPS only in production
├─> CORS origin validation
└─> Rate limiting (100/15min)

Layer 2: Application
├─> Input validation
├─> Request sanitization
├─> Security headers (Helmet)
└─> Session timeout (30min)

Layer 3: Data
├─> No persistent PHI storage
├─> In-memory only
└─> Automatic purging
```

### Authentication & Authorization

**Current:** None (publicly accessible demo)

**Planned:**
- OAuth 2.0 with Google/Microsoft
- Role-based access control (RBAC)
- API key authentication for integrations
- Audit logging for compliance

### Data Privacy

- **No PHI Storage:** All data in-memory only
- **Session Timeout:** 30-minute automatic logout
- **No Logging:** Patient data not logged
- **Gemini API:** Subject to Google's privacy policy

---

## Performance Characteristics

### Response Times

- **Health Check:** < 10ms
- **Start Consultation:** 500-1500ms (AI dependent)
- **Collect History:** < 50ms
- **Generate Diagnosis:** 1500-3000ms (AI dependent)
- **Generate Summary:** 800-1200ms (AI dependent)

### Throughput

- **Rate Limit:** 100 requests per 15 minutes per IP
- **Concurrent Users:** ~50 (single instance, 2GB RAM)
- **API Quota:** 250 requests/day (Gemini free tier)

### Resource Usage

- **Backend RAM:** ~150MB base, +10MB per active session
- **Frontend Build:** ~2MB gzipped
- **API Calls:** 2-4 Gemini calls per complete consultation

---

## Deployment Architecture

### Development

```
Local Machine
├─> Backend: localhost:10000
├─> Frontend: localhost:4200 (with proxy)
└─> AI: Gemini API (cloud)
```

### Production (Render.com)

```
Render Platform
├─> Frontend (Static Site)
│   ├─> CDN distribution
│   └─> HTTPS automatic
│
└─> Backend (Web Service)
    ├─> Auto-deploy from main branch
    ├─> Environment variables
    └─> Health check monitoring
```
