# Contributing to Elio

Thank you for your interest in contributing to Elio. This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of:

- Experience level
- Gender identity and expression
- Sexual orientation
- Disability
- Personal appearance
- Race or ethnicity
- Age
- Religion or lack thereof
- Nationality

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what is best for the project and community
- Show empathy towards other community members

### Unacceptable Behavior

- Trolling, insulting or derogatory comments
- Personal or political attacks
- Public or private harassment
- Publishing others' private information
- Any conduct which could reasonably be considered inappropriate in a professional setting

### Enforcement

Instances of unacceptable behavior may be reported to the project maintainers at [@alearecuest](https://github.com/alearecuest). All complaints will be reviewed and investigated promptly and fairly.

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

```bash
Node.js >= 18.0.0
npm >= 9.0.0
Git
TypeScript >= 5.9.0
```

Verify your installation:

```bash
node --version
npm --version
git --version
tsc --version
```

### Fork and Clone

1. **Fork the repository**

   Navigate to [https://github.com/alearecuest/ProyectoFinal](https://github.com/alearecuest/ProyectoFinal) and click "Fork"

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/ProyectoFinal.git
   cd ProyectoFinal
   ```

3. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/alearecuest/ProyectoFinal.git
   ```

4. **Verify remotes**

   ```bash
   git remote -v
   # origin    https://github.com/YOUR_USERNAME/ProyectoFinal.git (fetch)
   # origin    https://github.com/YOUR_USERNAME/ProyectoFinal.git (push)
   # upstream  https://github.com/alearecuest/ProyectoFinal.git (fetch)
   # upstream  https://github.com/alearecuest/ProyectoFinal.git (push)
   ```

### Initial Setup

#### Backend Setup

```bash
cd Server
npm install
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
npm run dev
```

#### Frontend Setup

```bash
cd ui
npm install
npm start
```

---

## Development Workflow

### Branch Strategy

We follow a simplified Git Flow:

- **`main`** - Production-ready code
- **`develop`** - Integration branch for features
- **`feature/*`** - New features
- **`fix/*`** - Bug fixes
- **`docs/*`** - Documentation updates
- **`refactor/*`** - Code refactoring

### Creating a Feature Branch

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create and checkout feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-description
```

### Making Changes

1. **Make your changes**

   Follow the [Coding Standards](#coding-standards)

2. **Test your changes**

   ```bash
   # Backend
   cd Server
   npm test
   npm run lint

   # Frontend
   cd ui
   npm test
   npm run lint
   ```

3. **Commit your changes**

   Follow [Commit Guidelines](#commit-guidelines)

4. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

### Keeping Your Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge upstream main into your branch
git checkout main
git merge upstream/main

# Rebase your feature branch
git checkout feature/your-feature-name
git rebase main
```

---

## Coding Standards

### TypeScript Style Guide

#### General Rules

- Use **TypeScript** for all new code
- Enable strict mode in `tsconfig.json`
- Avoid `any` type unless absolutely necessary
- Use explicit return types for functions
- Prefer `const` over `let`, never use `var`

#### Naming Conventions

```typescript
// Classes, Interfaces, Types: PascalCase
class PatientSession {}
interface DiagnosticoResponse {}
type SessionState = {};

// Functions, Variables: camelCase
function generateDiagnosis() {}
const sessionTimeout = 30;

// Constants: UPPER_SNAKE_CASE
const MAX_OPTIONS = 8;
const DEFAULT_PORT = 10000;

// Private class members: prefix with underscore
class Service {
  private _apiKey: string;
}

// File names: kebab-case
// session-manager.ts
// diagnostico.controller.ts
```

#### Code Formatting

```typescript
// Use 2 spaces for indentation
function example() {
  if (condition) {
    return true;
  }
}

// Use single quotes for strings
const message = 'Hello World';

// Use template literals for string interpolation
const greeting = `Hello ${name}`;

// Use trailing commas in objects and arrays
const config = {
  port: 10000,
  timeout: 30,
};

// Use arrow functions for callbacks
items.map(item => item.id);

// Use async/await instead of promises
async function fetchData() {
  const result = await api.get('/data');
  return result;
}
```

### Backend Standards

#### File Structure

```
Server/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── middleware/
│   ├── types/
│   └── utils/
```

#### Controller Example

```typescript
// controllers/diagnostico.controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { DiagnosticoService } from '../services/diagnostico.service';

export class DiagnosticoController {
  constructor(private diagnosticoService: DiagnosticoService) {}

  async generateDiagnosis(
    request: FastifyRequest<{ Body: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { id } = request.body;
      const diagnosis = await this.diagnosticoService.generate(id);
      
      reply.status(200).send(diagnosis);
    } catch (error) {
      reply.status(500).send({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }
}
```

#### Service Example

```typescript
// services/diagnostico.service.ts
import { GeminiService } from './ai/gemini.service';
import { SessionService } from './session.service';

export class DiagnosticoService {
  constructor(
    private geminiService: GeminiService,
    private sessionService: SessionService
  ) {}

  async generate(sessionId: string): Promise<DiagnosticoResponse> {
    const session = await this.sessionService.get(sessionId);
    
    if (!session) {
      throw new Error('Session not found');
    }

    const diagnosis = await this.geminiService.generateDiagnosis({
      motivoConsulta: session.motivo_consulta,
      opciones: session.opciones
    });

    await this.sessionService.update(sessionId, { diagnostico: diagnosis });
    
    return diagnosis;
  }
}
```

### Frontend Standards

#### Component Structure

```
ui/src/app/
├── core/              # Singleton services, guards
├── shared/            # Shared components, pipes, directives
├── features/          # Feature modules
│   └── diagnostico/
│       ├── components/
│       ├── services/
│       └── models/
└── layouts/           # Layout components
```

#### Component Example

```typescript
// features/diagnostico/components/diagnostico.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { DiagnosticoService } from '../services/diagnostico.service';
import { Diagnostico } from '../models/diagnostico.model';

@Component({
  selector: 'app-diagnostico',
  templateUrl: './diagnostico.component.html',
  styleUrls: ['./diagnostico.component.css'],
  standalone: true
})
export class DiagnosticoComponent implements OnInit {
  diagnostico = signal<Diagnostico | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(private diagnosticoService: DiagnosticoService) {}

  async ngOnInit(): Promise<void> {
    await this.loadDiagnostico();
  }

  private async loadDiagnostico(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const data = await this.diagnosticoService.getDiagnostico();
      this.diagnostico.set(data);
    } catch (err) {
      this.error.set(err.message);
    } finally {
      this.loading.set(false);
    }
  }
}
```

#### Service Example

```typescript
// features/diagnostico/services/diagnostico.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { firstValueFrom } from 'rxjs';
import { Diagnostico } from '../models/diagnostico.model';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticoService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  async getDiagnostico(sessionId: string): Promise<Diagnostico> {
    return firstValueFrom(
      this.http.post<Diagnostico>(`${this.apiUrl}/api/diagnostico`, {
        id: sessionId
      })
    );
  }
}
```

### CSS/Styling Standards

```css
/* Use BEM naming convention */
.diagnostico {}
.diagnostico__title {}
.diagnostico__item {}
.diagnostico__item--selected {}

/* Use CSS custom properties for theming */
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --danger-color: #e74c3c;
}

/* Mobile-first approach */
.container {
  width: 100%;
  padding: 1rem;
}

@media (min-width: 768px) {
  .container {
    max-width: 720px;
    margin: 0 auto;
  }
}
```

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons, etc.)
- **refactor**: Code refactoring (no functional changes)
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build process or auxiliary tool changes
- **ci**: CI/CD configuration changes

### Scope (Optional)

- **backend**: Backend changes
- **frontend**: Frontend changes
- **api**: API changes
- **config**: Configuration changes
- **deps**: Dependency updates

### Examples

```bash
# Feature
git commit -m "feat(backend): add SNOMED CT coding to diagnosis endpoint"

# Bug fix
git commit -m "fix(frontend): resolve CORS issue in API service"

# Documentation
git commit -m "docs: update API documentation with new endpoints"

# Refactor
git commit -m "refactor(backend): extract session management into separate service"

# Breaking change
git commit -m "feat(api): change diagnosis response structure

BREAKING CHANGE: DiagnosticoResponse now includes Patologías_Codificadas array"
```

### Commit Best Practices

- Write in imperative mood ("add" not "added")
- Keep subject line under 72 characters
- Capitalize first letter of subject
- No period at the end of subject
- Separate subject from body with blank line
- Explain **what** and **why**, not **how**

---

## Pull Request Process

### Before Submitting

1. **Ensure all tests pass**

   ```bash
   # Backend
   cd Server
   npm test
   npm run lint

   # Frontend
   cd ui
   npm test
   npm run lint
   ```

2. **Update documentation**

   - Update README if needed
   - Update API documentation for endpoint changes
   - Add JSDoc comments to new functions

3. **Rebase on latest main**

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

### Creating a Pull Request

1. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open PR on GitHub**

   - Navigate to your fork on GitHub
   - Click "Pull Request"
   - Select `alearecuest/ProyectoFinal:main` as base
   - Select your feature branch as compare

3. **Fill out PR template**

   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Unit tests added/updated
   - [ ] Integration tests pass
   - [ ] Manual testing performed

   ## Screenshots (if applicable)

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Comments added to complex code
   - [ ] Documentation updated
   - [ ] No new warnings generated
   - [ ] Tests added and passing
   ```

### PR Review Process

1. **Automated Checks**
   - CI/CD pipeline runs automatically
   - All tests must pass
   - Code coverage must not decrease

2. **Code Review**
   - At least one approval required
   - Address all review comments
   - Re-request review after changes

3. **Merge**
   - Squash and merge (preferred)
   - Rebase and merge (for clean history)
   - Maintainers will merge after approval

### After Merge

- Delete your feature branch
- Update your local repository
- Close related issues

---

## Testing Requirements

### Backend Testing

#### Unit Tests

```typescript
// __tests__/services/diagnostico.service.test.ts
import { DiagnosticoService } from '../../services/diagnostico.service';
import { GeminiService } from '../../services/ai/gemini.service';
import { SessionService } from '../../services/session.service';

describe('DiagnosticoService', () => {
  let service: DiagnosticoService;
  let geminiService: jest.Mocked<GeminiService>;
  let sessionService: jest.Mocked<SessionService>;

  beforeEach(() => {
    geminiService = {
      generateDiagnosis: jest.fn()
    } as any;
    
    sessionService = {
      get: jest.fn(),
      update: jest.fn()
    } as any;

    service = new DiagnosticoService(geminiService, sessionService);
  });

  it('should generate diagnosis for valid session', async () => {
    const mockSession = {
      id: 'test-id',
      motivo_consulta: 'Test complaint',
      opciones: ['Option 1']
    };

    sessionService.get.mockResolvedValue(mockSession);
    geminiService.generateDiagnosis.mockResolvedValue({
      Estado: 'Test state',
      Diferenciales: []
    });

    const result = await service.generate('test-id');

    expect(result).toBeDefined();
    expect(sessionService.get).toHaveBeenCalledWith('test-id');
  });

  it('should throw error for invalid session', async () => {
    sessionService.get.mockResolvedValue(null);

    await expect(service.generate('invalid-id')).rejects.toThrow('Session not found');
  });
});
```

#### Running Tests

```bash
cd Server

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test diagnostico.service.test.ts

# Watch mode
npm test -- --watch
```

### Frontend Testing

#### Component Tests

```typescript
// features/diagnostico/components/diagnostico.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiagnosticoComponent } from './diagnostico.component';
import { DiagnosticoService } from '../services/diagnostico.service';

describe('DiagnosticoComponent', () => {
  let component: DiagnosticoComponent;
  let fixture: ComponentFixture<DiagnosticoComponent>;
  let mockService: jasmine.SpyObj<DiagnosticoService>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('DiagnosticoService', ['getDiagnostico']);

    await TestBed.configureTestingModule({
      imports: [DiagnosticoComponent],
      providers: [
        { provide: DiagnosticoService, useValue: mockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DiagnosticoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load diagnostico on init', async () => {
    const mockDiagnostico = {
      Estado: 'Test',
      Diferenciales: []
    };

    mockService.getDiagnostico.and.returnValue(Promise.resolve(mockDiagnostico));

    await component.ngOnInit();

    expect(component.diagnostico()).toEqual(mockDiagnostico);
  });
});
```

#### Running Tests

```bash
cd ui

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in headless mode (CI)
npm test -- --browsers=ChromeHeadless --watch=false
```

### Test Coverage Requirements

- **Minimum coverage:** 80% for new code
- **Critical paths:** 100% coverage required
- **Integration tests:** Required for API endpoints

---

## Documentation

### Code Documentation

#### JSDoc for TypeScript

```typescript
/**
 * Generate differential diagnosis for a patient session
 * 
 * @param sessionId - Unique session identifier (UUID)
 * @returns Promise resolving to differential diagnosis with SNOMED CT codes
 * @throws {Error} If session is not found or AI service fails
 * 
 * @example
 * ```typescript
 * const diagnosis = await service.generate('a3f5c8e2-9d1b-4c7e-8f3a-6b2d4e1c9a5f');
 * console.log(diagnosis.Diferenciales);
 * ```
 */
async generate(sessionId: string): Promise<DiagnosticoResponse> {
  // Implementation
}
```

#### README Updates

When adding new features, update:

- Main README.md
- Backend README (Server/README.md)
- Frontend README (ui/README.md)
- API documentation (docs/api/endpoints.md)

#### Architecture Documentation

Update architecture docs when making structural changes:

- `docs/architecture/system-architecture.md`
- `docs/architecture/backend-architecture.md`
- `docs/architecture/frontend-architecture.md`

---

## Issue Reporting

### Bug Reports

Use the bug report template:

**Title:** Clear, concise description

**Description:**
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)

**Environment:**
- OS: [e.g., Ubuntu 22.04]
- Node version: [e.g., 18.17.0]
- Browser: [e.g., Chrome 118]

**Additional Context:**
- Error messages
- Logs
- Related issues

### Feature Requests

Use the feature request template:

**Title:** Feature name

**Description:**
- Problem this solves
- Proposed solution
- Alternative solutions considered

**Additional Context:**
- Mockups or diagrams
- Related features
- Priority level

---

## Questions and Support

### Getting Help

- **Documentation:** Check [docs/](../docs/) directory first
- **Issues:** Search existing issues
- **Discussions:** Use GitHub Discussions for questions
- **Email:** Contact maintainers directly for sensitive issues

### Response Times

- Critical bugs: 24-48 hours
- Feature requests: 1-2 weeks
- Questions: 2-5 days
- Pull reviews: 3-7 days

---

## Recognition

Contributors will be recognized in:

- CONTRIBUTORS.md file
- Release notes
- Project README (significant contributions)

Thank you for contributing to Elio!

---
