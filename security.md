# Security Guidelines

## API Security

### Authentication
- **API Key Storage**: Store `ANTHROPIC_API_KEY` only in `.env` file (never commit)
- **Environment Variables**: Use dotenv to load from `.env` at runtime
- **Key Rotation**: Rotate API keys every 90 days
- **Access Control**: API keys tied to specific IP ranges in production

### Rate Limiting
- **Claude API**: Implement exponential backoff for rate-limited requests
- **Database**: Connection pooling with max 10 concurrent connections
- **Request Timeout**: 30 seconds for all external API calls

### Input Validation
- **Topic Parameter**: Max 500 characters, alphanumeric + spaces only
- **Count Parameter**: Integer between 1-100
- **All User Input**: Sanitize to prevent SQL injection and XSS

## Data Protection

### Database Security
- **SQLite (Dev)**: File-based, dev only, excluded from git
- **PostgreSQL (Prod)**: SSL/TLS encrypted connections
- **Backups**: Daily encrypted backups, stored in secure S3 bucket
- **Access**: Role-based access control, least privilege principle

### Sensitive Data
- **API Keys**: Never logged, stored encrypted
- **Keywords Data**: Publicly shareable (SEO/marketing research)
- **Project Settings**: Accessible only to authenticated users
- **Audit Logs**: All sensitive operations logged with timestamp, user, action

### Data Retention
- **Keywords**: Retained for 1 year (archive older data)
- **Articles**: Retained indefinitely (publication history)
- **Logs**: Retained for 90 days, then archived
- **User Sessions**: Expired after 24 hours of inactivity

## Code Security

### Dependencies
- **Package Scanning**: Run `npm audit` before each deployment
- **Pinned Versions**: Lock all dependency versions in package-lock.json
- **Critical Fixes**: Deploy security patches within 24 hours
- **Outdated Packages**: Review and update quarterly

### Error Handling
- **Production**: Log errors securely, never expose stack traces to client
- **Development**: Verbose error messages for debugging
- **Sensitive Info**: Never log API keys, tokens, or passwords
- **Error Monitoring**: Use Sentry or similar for error tracking

### Secrets Management
- `.env` file: Excluded from git via .gitignore
- `.env.example`: Shared as template (no actual values)
- Production Secrets: Managed via environment variables or secret manager
- Secret Rotation: Automated quarterly rotation with no downtime

## API Endpoint Security

### Headers
```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### CORS
- **Allowed Origins**: Whitelist specific domains in production
- **Allowed Methods**: GET, POST only for public endpoints
- **Credentials**: Disabled for API endpoints

## Monitoring & Alerts

### Security Monitoring
- **Failed Login Attempts**: Alert on >5 attempts per hour
- **Unusual API Usage**: Alert if >1000 requests per minute
- **Database Queries**: Log slow queries (>1s execution time)
- **File Access**: Monitor access to sensitive files

### Incident Response
- **Response Time**: Critical issues responded to within 1 hour
- **Communication**: Affected users notified within 24 hours
- **Remediation**: Issues resolved and documented
- **Post-Mortem**: Review and implement preventive measures

## Compliance

### Standards
- **Data Privacy**: GDPR compliant for EU users
- **Security**: SOC 2 Type II controls implemented
- **API Security**: OWASP Top 10 vulnerabilities addressed

### Documentation
- **Security Policies**: Documented and updated annually
- **Incident Log**: Maintained for 3 years
- **Access Logs**: Retained for audit purposes

