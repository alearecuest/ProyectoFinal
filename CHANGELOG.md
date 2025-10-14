# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- OAuth 2.0 authentication system
- Audit logging for all API requests
- Export to PDF functionality
- Multi-language support (Spanish/English)

---

## [2.0.0] - 2025-10-14

### Added
- SNOMED CT International Edition integration for standardized medical coding
- Automatic pathology codification with ConceptID and official terminology
- Enhanced differential diagnosis with detailed clinical justification
- Clinical summary generation with structured format
- Session management with automatic timeout (30 minutes)
- Rate limiting protection (100 requests per 15 minutes)
- Security headers with Helmet.js
- Environment-based configuration system
- Mock AI responses for development (quota preservation)
- Comprehensive API documentation with Swagger/OpenAPI
- Health check endpoint for monitoring
- Proxy configuration for Angular development
- CORS protection with configurable origins

### Changed
- Migrated from basic AI prompts to structured medical analysis
- Improved diagnosis probability categorization (Very High, High, Medium, Low)
- Enhanced error handling and validation
- Restructured API endpoints for better RESTful design
- Updated frontend to Angular 20 with Signals
- Optimized AI token usage for cost efficiency

### Fixed
- CORS issues in development environment
- Session data persistence bugs
- API quota exhaustion in development
- Type safety issues in TypeScript codebase

### Security
- Added rate limiting to prevent abuse
- Implemented origin validation for CORS
- Added request validation middleware
- Secure environment variable handling
- Session timeout for inactive users

---

## [1.0.0] - 2025-10-11

### Added
- Initial release of Elio platform
- Basic differential diagnosis generation
- Integration with Google Gemini 2.5 Flash
- Angular frontend with consultation workflow
- Fastify backend with TypeScript
- Patient history collection interface
- Basic session management
- REST API endpoints for consultation flow

### Features
- AI-powered diagnosis suggestions
- Medical history options generation
- Simple consultation summary

---

## Version History

### [2.0.0] - 2025-10-14
Major release with SNOMED CT integration and enhanced clinical features

### [1.0.0] - 2025-10-11
Initial public release

---

## Upgrade Guide

### From 1.0.x to 2.0.0

**Backend Changes:**

```bash
# 1. Update dependencies
cd Server
npm install

# 2. Update environment variables
cp .env.example .env
# Add new variables:
# - USE_MOCK_AI (optional, for development)
# - RATE_LIMIT_MAX (optional, default: 100)
# - SESSION_TIMEOUT_MINUTES (optional, default: 30)

# 3. Restart server
npm run dev
```

**Frontend Changes:**

```bash
# 1. Update dependencies
cd ui
npm install

# 2. Update proxy configuration
# Copy proxy.conf.json if not exists

# 3. Restart development server
npm start
```

**API Breaking Changes:**

- `/api/diagnostico` response now includes `Patologías_Codificadas` array
- Session structure updated with additional metadata
- Error response format standardized

**Migration Steps:**

1. Backup existing configuration files
2. Update dependencies in both Server/ and ui/
3. Review and update environment variables
4. Test API endpoints with new response structure
5. Update frontend to handle SNOMED CT data

---

## Contributing

See [CONTRIBUTING.md](docs/contributing/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

**Maintained by:** [@alearecuest](https://github.com/alearecuest)  
**Repository:** [https://github.com/alearecuest/ProyectoFinal](https://github.com/alearecuest/ProyectoFinal)