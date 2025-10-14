# Security Policy

## Supported Versions

The following versions of Elio are currently supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| 1.x.x   | :x:                |

## Reporting a Vulnerability

We take the security of Elio seriously. If you have discovered a security vulnerability, please follow these steps:

### How to Report

**DO NOT** open a public GitHub issue for security vulnerabilities.

Instead, please report security vulnerabilities through one of the following methods:

1. **GitHub Security Advisories** (Preferred)
   - Navigate to the [Security tab](https://github.com/alearecuest/ProyectoFinal/security)
   - Click "Report a vulnerability"
   - Fill out the form with details

2. **Email**
   - Send details to: security@elio-project.com
   - Use PGP encryption if possible (key available upon request)

### What to Include

When reporting a vulnerability, please include:

- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability
- Any potential mitigations you've identified

### Response Timeline

- **Initial Response:** Within 48 hours
- **Status Update:** Within 7 days
- **Resolution Target:** Within 90 days for critical issues

### What to Expect

1. **Acknowledgment:** We will confirm receipt of your report within 48 hours
2. **Assessment:** We will investigate and determine the severity
3. **Updates:** You will receive regular updates on the progress
4. **Resolution:** We will develop and test a fix
5. **Disclosure:** We will coordinate disclosure timing with you
6. **Credit:** You will be credited in the security advisory (unless you prefer anonymity)

## Security Best Practices

### API Key Management

- **Never commit** `.env` files or API keys to version control
- Use environment variables for all sensitive configuration
- Rotate API keys regularly (recommended: every 90 days)
- Use different API keys for development, staging, and production

### Production Deployment

- Always use HTTPS in production environments
- Enable rate limiting (default: 100 requests per 15 minutes)
- Configure CORS to allow only trusted origins
- Keep dependencies updated (run `npm audit` regularly)
- Use secure session management (current: 30-minute timeout)

### Backend Security

```bash
# Regular security audit
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Check for outdated packages
npm outdated
```

### Frontend Security

```bash
# Angular security check
npm audit

# Update dependencies
ng update

# Build with production configuration
ng build --configuration production
```

## Security Features

### Current Implementation

- **Rate Limiting:** 100 requests per IP per 15 minutes
- **CORS Protection:** Configured allowed origins only
- **Helmet.js:** Security headers enabled
- **Input Validation:** All API inputs are validated
- **Session Management:** Automatic timeout after 30 minutes of inactivity
- **API Key Protection:** Environment variable storage only

### Planned Enhancements

- [ ] OAuth 2.0 authentication
- [ ] Request signing for API calls
- [ ] Audit logging for all API requests
- [ ] IP whitelisting for production environments
- [ ] DDoS protection at infrastructure level

## Known Security Considerations

### Data Privacy

- **Patient Data:** Session data is stored in-memory only
- **Data Retention:** Sessions are automatically purged after 30 minutes
- **No Persistent Storage:** No patient information is saved to disk
- **HIPAA Compliance:** This system is NOT HIPAA-compliant in its current state

### Third-Party Dependencies

- **Google Gemini API:** All patient data is sent to Google's servers for AI processing
- **API Key Exposure:** Ensure Gemini API keys are restricted to specific domains
- **Rate Limits:** Free tier has quota limitations (250 requests/day)

## Compliance

### Medical Software Disclaimer

This software is provided as a **clinical decision support tool** and:

- Does NOT replace professional medical judgment
- Should NOT be used as the sole basis for medical decisions
- Has NOT been evaluated by FDA or similar regulatory bodies
- Is NOT certified for use in clinical practice
- Does NOT store protected health information (PHI)

### Data Protection

While Elio does not store patient data persistently:

- All data in transit should use HTTPS
- Session data in memory is cleared after timeout
- No patient identifiable information should be logged
- API communications with Gemini are subject to Google's privacy policy

## Security Updates

### Notification Channels

Security updates will be announced through:

- GitHub Security Advisories
- Release notes (CHANGELOG.md)
- Repository notifications

### Update Policy

- **Critical vulnerabilities:** Patch released within 7 days
- **High severity:** Patch released within 30 days
- **Medium/Low severity:** Included in next scheduled release

## Dependencies Security

### Automated Scanning

This project uses:

- GitHub Dependabot for dependency updates
- npm audit for vulnerability scanning
- Regular dependency updates via CI/CD

### Manual Review

Security team reviews:

- All dependency updates before merging
- Third-party integrations quarterly
- Authentication and authorization code on every PR

## Contact

For security-related questions or concerns:

- **Security Team:** security@elio-project.com
- **Project Maintainer:** [@alearecuest](https://github.com/alearecuest)
- **GitHub Security:** Use the Security tab in this repository

---

**Last Updated:** 2025-10-14  
**Version:** 2.0.0