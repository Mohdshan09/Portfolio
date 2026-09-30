# Production Security Checklist

> **Purpose:** Security requirements that must be reviewed and resolved before shipping any web application to production.
>
> **Scope:** Frontend, backend/API, authentication, authorization, database, infrastructure, file uploads, third-party services, CI/CD, monitoring, and operational security.

---

## 0. Production Security Gate

The application should **not be considered production-ready** until:

* [ ] No known Critical security vulnerabilities remain.
* [ ] No known High-severity vulnerabilities remain without documented acceptance.
* [ ] Authentication and authorization have been manually tested.
* [ ] All production secrets are stored outside source control.
* [ ] Database access is restricted.
* [ ] HTTPS is enforced.
* [ ] Security headers are configured.
* [ ] Rate limiting is enabled for sensitive endpoints.
* [ ] Input validation exists on every externally controlled input.
* [ ] SQL/NoSQL/command injection protections are verified.
* [ ] File upload security has been reviewed.
* [ ] CORS is explicitly configured.
* [ ] Error responses do not expose sensitive information.
* [ ] Dependencies have been audited.
* [ ] Production logs do not contain secrets or sensitive personal data.
* [ ] Backups and recovery procedures have been tested.
* [ ] Security monitoring/alerting is configured.
* [ ] A rollback procedure exists.
* [ ] A final security review has been completed.

---

# 1. Threat Model

Before shipping, identify:

### Assets

* [ ] User accounts
* [ ] Authentication credentials
* [ ] Sessions/tokens
* [ ] Personal information
* [ ] Payment information
* [ ] Business data
* [ ] Uploaded files
* [ ] Database
* [ ] API credentials
* [ ] Admin functionality
* [ ] Internal infrastructure
* [ ] Third-party integrations

### Threat Actors

Consider:

* [ ] Unauthenticated attackers
* [ ] Malicious authenticated users
* [ ] Compromised user accounts
* [ ] Privilege escalation
* [ ] Automated bots
* [ ] Scrapers
* [ ] Malicious file uploads
* [ ] Supply-chain attacks
* [ ] Compromised third-party services
* [ ] Insider threats

### Trust Boundaries

Document:

```text
Browser
   ↓
CDN / Reverse Proxy
   ↓
Web Application
   ↓
API
   ↓
Database

Third-party services:
   ├── Authentication
   ├── Email
   ├── Storage
   ├── Payment
   └── AI/API providers
```

Verify that every trust boundary has appropriate authentication, validation, and authorization.

---

# 2. Secrets & Environment Variables

## Critical

Never commit secrets to Git.

Check:

* [ ] `.env` is ignored by Git.
* [ ] Production secrets are not present in source code.
* [ ] API keys are not exposed to frontend JavaScript.
* [ ] Database credentials are not exposed to clients.
* [ ] JWT secrets are not exposed.
* [ ] OAuth client secrets are server-side only.
* [ ] Cloud credentials are server-side only.
* [ ] Webhook signing secrets are protected.
* [ ] Private encryption keys are protected.

Search the repository for:

```text
password
secret
token
api_key
apikey
private_key
access_key
client_secret
database_url
DATABASE_URL
AWS_SECRET
JWT_SECRET
```

Also scan Git history, not just the current working tree.

### If a secret was ever committed

Treat it as compromised.

1. Revoke it.
2. Generate a new credential.
3. Update production.
4. Remove it from the repository/history where appropriate.
5. Investigate potential usage.

---

# 3. Authentication

Authentication must be treated separately from authorization.

Check:

* [ ] Passwords are never stored in plaintext.
* [ ] Passwords use a modern password hashing algorithm such as Argon2id or bcrypt.
* [ ] Password reset tokens are random and short-lived.
* [ ] Password reset tokens are single-use.
* [ ] Email verification tokens expire.
* [ ] Login endpoints have rate limiting.
* [ ] Account enumeration is minimized.
* [ ] Brute-force protection exists.
* [ ] Session expiration is defined.
* [ ] Logout invalidates the appropriate session/token.
* [ ] Sensitive actions require re-authentication where appropriate.
* [ ] MFA is supported where appropriate.
* [ ] OAuth state/nonce protections are implemented.
* [ ] Authentication errors don't reveal unnecessary information.

### Password Policy

Do not rely exclusively on arbitrary complexity rules.

Consider:

* Minimum length
* Breached-password detection
* Password manager compatibility
* Rate limiting
* MFA

---

# 4. Session Security

For cookie-based sessions:

```http
Set-Cookie:
session=...;
Secure;
HttpOnly;
SameSite=Lax;
Path=/
```

Verify:

* [ ] `HttpOnly` is enabled.
* [ ] `Secure` is enabled in production.
* [ ] Appropriate `SameSite` policy is configured.
* [ ] Session IDs are cryptographically random.
* [ ] Sessions expire.
* [ ] Sessions can be revoked.
* [ ] Session fixation is prevented.
* [ ] Session IDs are rotated after authentication where appropriate.

Avoid storing long-lived sensitive authentication tokens in:

```javascript
localStorage
```

unless the security architecture explicitly accepts the associated XSS risk.

---

# 5. JWT Security

If JWTs are used:

* [ ] Strong signing keys are used.
* [ ] Algorithms are explicitly configured.
* [ ] Algorithm confusion is prevented.
* [ ] Token expiration is enforced.
* [ ] Issuer (`iss`) is validated when applicable.
* [ ] Audience (`aud`) is validated when applicable.
* [ ] Token signature is always verified.
* [ ] Refresh tokens are protected.
* [ ] Refresh token rotation is considered.
* [ ] Revocation strategy exists for high-risk applications.
* [ ] Sensitive information is not placed in JWT payloads.

Never trust:

```javascript
jwt.decode(token)
```

as authentication.

Decoding is not verification.

---

# 6. Authorization

Every protected resource must verify **what the current user is allowed to access**.

Check for:

* [ ] Authentication
* [ ] Role authorization
* [ ] Resource ownership
* [ ] Tenant isolation
* [ ] Administrative permissions
* [ ] Organization permissions
* [ ] API-level authorization

Example:

```text
GET /api/users/123
```

Must not simply mean:

```text
authenticated → allowed
```

It should effectively be:

```text
authenticated
      +
authorized
      +
allowed to access user 123
```

### Test IDOR/BOLA

Try changing:

```text
/users/100
/users/101
/orders/100
/orders/101
/documents/100
/documents/101
```

A user must not gain access merely by changing an ID.

---

# 7. Multi-Tenant Security

For SaaS applications:

```text
Tenant A
 ├── User A1
 └── User A2

Tenant B
 ├── User B1
 └── User B2
```

Verify:

* [ ] Every tenant-owned query is scoped by `tenantId`.
* [ ] Tenant ID is not trusted from arbitrary client input.
* [ ] Tenant membership is verified server-side.
* [ ] Admins cannot accidentally cross tenant boundaries.
* [ ] Background jobs preserve tenant context.
* [ ] File storage is tenant-isolated.
* [ ] Cache keys include tenant boundaries.
* [ ] Search indexes enforce tenant isolation.
* [ ] Export/report functionality is tenant-scoped.

Example:

```sql
SELECT *
FROM projects
WHERE id = $1
AND tenant_id = $2;
```

Do not rely solely on:

```sql
SELECT *
FROM projects
WHERE id = $1;
```

---

# 8. Input Validation

Never trust:

* Request body
* Query parameters
* URL parameters
* Headers
* Cookies
* Uploaded files
* Webhook payloads
* Browser-generated IDs
* Client-side role values

Validate input server-side.

Use schemas such as:

```text
Zod
Joi
Yup
Valibot
JSON Schema
```

Check:

* [ ] Type validation
* [ ] Length limits
* [ ] Numeric ranges
* [ ] Enum validation
* [ ] Required fields
* [ ] Nested object validation
* [ ] Array size limits
* [ ] String normalization
* [ ] File validation

---

# 9. SQL Injection

Never construct SQL using string concatenation.

Bad:

```javascript
const query = `
  SELECT * FROM users
  WHERE email = '${email}'
`;
```

Use parameterized queries or a properly configured ORM.

Good:

```javascript
db.query(
  "SELECT * FROM users WHERE email = $1",
  [email]
);
```

Verify:

* [ ] Raw SQL is reviewed.
* [ ] Dynamic SQL is parameterized.
* [ ] Database user has minimal privileges.

---

# 10. NoSQL Injection

For MongoDB and similar databases:

Never directly trust query objects from clients.

Avoid patterns like:

```javascript
User.find(req.body);
```

Validate the expected schema.

Be particularly careful with operators such as:

```text
$gt
$gte
$lt
$in
$ne
$regex
$where
```

---

# 11. Command Injection

Never directly pass user input into:

```text
exec()
spawn()
shell commands
system()
child_process
```

Bad:

```javascript
exec(`convert ${filename} output.png`);
```

Prefer safe APIs with fixed arguments and strict allowlists.

---

# 12. XSS — Cross-Site Scripting

Check:

* [ ] User-generated content is escaped.
* [ ] HTML rendering is sanitized.
* [ ] Rich-text editors sanitize output.
* [ ] Markdown rendering is sanitized.
* [ ] Dangerous HTML attributes are blocked.
* [ ] JavaScript URLs are blocked.
* [ ] CSP is configured where appropriate.

Be especially careful with:

```javascript
dangerouslySetInnerHTML
```

and equivalent HTML injection mechanisms.

Do not assume React/Vue/Angular automatically protects every custom HTML rendering path.

---

# 13. CSRF

For cookie-based authentication:

* [ ] CSRF protection is implemented where required.
* [ ] SameSite cookies are configured appropriately.
* [ ] State-changing requests are protected.
* [ ] GET requests do not perform destructive actions.

Dangerous:

```text
GET /api/delete-account
GET /api/delete-user
GET /api/transfer-money
```

Use appropriate methods:

```text
DELETE /api/account
POST /api/transfer
```

---

# 14. CORS

Never blindly configure:

```http
Access-Control-Allow-Origin: *
```

especially when credentials are involved.

Define explicit origins:

```text
https://example.com
https://app.example.com
```

Verify:

* [ ] Allowed origins are explicit.
* [ ] Credentials are configured correctly.
* [ ] Methods are restricted.
* [ ] Headers are restricted.
* [ ] Development origins aren't allowed in production.

---

# 15. Security Headers

At minimum review:

```http
Strict-Transport-Security
Content-Security-Policy
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
```

Also review:

```http
X-Frame-Options
```

where appropriate.

Example baseline:

```http
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
```

CSP should be designed around the application's actual scripts, styles, frames, images, and third-party integrations rather than blindly copying a policy.

---

# 16. HTTPS / TLS

Production must use HTTPS.

Check:

* [ ] HTTP redirects to HTTPS.
* [ ] TLS certificates are valid.
* [ ] Certificates auto-renew.
* [ ] HSTS is configured after confirming HTTPS readiness.
* [ ] Mixed content is eliminated.
* [ ] Cookies use `Secure`.
* [ ] Internal services use appropriate encryption where required.

---

# 17. API Security

For every API endpoint document:

```text
Authentication
Authorization
Input validation
Rate limit
Maximum payload
Allowed methods
Expected response
Sensitive data
```

Example:

```text
POST /api/users

Auth: Required
Role: Admin
Validation: Required
Rate limit: Yes
Payload limit: 1 MB
```

Check:

* [ ] Authentication is enforced.
* [ ] Authorization is enforced.
* [ ] Input validation exists.
* [ ] Response data is minimized.
* [ ] Rate limiting exists where appropriate.
* [ ] Pagination limits exist.
* [ ] Request body limits exist.
* [ ] API versioning is considered.
* [ ] Sensitive endpoints are protected.

---

# 18. Rate Limiting & Abuse Prevention

Rate-limit at minimum:

```text
/login
/register
/password-reset
/verify-email
/otp
/search
/file-upload
/AI endpoints
/payment endpoints
/admin endpoints
```

Consider:

```text
IP-based limits
User-based limits
Account-based limits
Tenant-based limits
API-key limits
```

Do not rely solely on frontend restrictions.

---

# 19. File Upload Security

Treat every uploaded file as untrusted.

Check:

* [ ] Allowed extensions are restricted.
* [ ] MIME type is validated.
* [ ] File signatures/magic bytes are checked where appropriate.
* [ ] File size is limited.
* [ ] Filename is sanitized.
* [ ] Uploaded files are stored outside executable paths.
* [ ] User-controlled filenames are not used directly as filesystem paths.
* [ ] SVG uploads are handled carefully.
* [ ] HTML uploads are restricted.
* [ ] Archives are handled carefully.
* [ ] Archive extraction prevents path traversal.
* [ ] Malware scanning is considered for higher-risk applications.
* [ ] Access to private files requires authorization.
* [ ] Signed URLs expire.

Never trust:

```javascript
file.originalname
file.mimetype
```

by themselves.

---

# 20. Path Traversal

Never allow arbitrary filesystem paths from users.

Dangerous input:

```text
../../../../etc/passwd
```

Check:

* [ ] Paths are normalized.
* [ ] User input cannot escape the intended directory.
* [ ] Filenames are generated server-side where possible.
* [ ] Access is authorization-controlled.

---

# 21. SSRF

If the server fetches URLs supplied by users:

```text
POST /api/fetch-url
```

protect against SSRF.

Do not blindly allow:

```text
http://localhost
http://127.0.0.1
http://169.254.169.254
private network addresses
internal hostnames
```

Consider:

* URL allowlists
* DNS rebinding protection
* IP validation
* Redirect validation
* Network egress restrictions

This is especially important in cloud environments.

---

# 22. Webhooks

For incoming webhooks:

* [ ] Signature verification is implemented.
* [ ] Signing secret is stored securely.
* [ ] Timestamp/replay protection exists where supported.
* [ ] Payload size is limited.
* [ ] Events are idempotent.
* [ ] Duplicate events are handled.
* [ ] Event type is validated.
* [ ] Processing failures are monitored.

Never trust:

```text
X-Webhook-Event
```

without verifying the webhook's authenticity.

---

# 23. Database Security

Check:

* [ ] Database is not publicly accessible unnecessarily.
* [ ] Strong credentials are used.
* [ ] Least-privilege database users exist.
* [ ] Production DB credentials aren't shared with developers unnecessarily.
* [ ] TLS is enabled.
* [ ] Backups are configured.
* [ ] Backup restoration has been tested.
* [ ] Sensitive fields are encrypted where appropriate.
* [ ] Database errors aren't returned directly to users.
* [ ] Destructive migrations are reviewed.

---

# 24. Prisma / ORM Security

If using Prisma or another ORM:

* [ ] Avoid unsafe raw queries.
* [ ] Review every `$queryRawUnsafe` / equivalent.
* [ ] Validate dynamic query parameters.
* [ ] Enforce authorization before queries.
* [ ] Don't expose internal database objects directly.
* [ ] Don't serialize sensitive fields unintentionally.

Authorization should happen before data access, not only in the UI.

---

# 25. Sensitive Data Protection

Identify sensitive information:

```text
Passwords
Access tokens
Refresh tokens
API keys
Government IDs
Payment information
Private documents
Personal information
Internal business information
```

Check:

* [ ] Data collection is minimized.
* [ ] Sensitive data is encrypted where appropriate.
* [ ] Sensitive data is not logged.
* [ ] Sensitive data isn't returned unnecessarily.
* [ ] Access is audited.
* [ ] Retention periods are defined.
* [ ] Deletion mechanisms exist.

---

# 26. Error Handling

Production errors should not expose:

```text
Stack traces
Database queries
File paths
Environment variables
Secrets
Internal service names
Infrastructure details
```

Bad:

```json
{
  "error": "PrismaClientKnownRequestError...",
  "database": "postgres://..."
}
```

Prefer:

```json
{
  "error": "Internal server error",
  "requestId": "req_123"
}
```

Log detailed diagnostics internally.

---

# 27. Logging

Logs should help investigate attacks without becoming a data leak.

Log:

* [ ] Authentication failures
* [ ] Authorization failures
* [ ] Suspicious activity
* [ ] Administrative actions
* [ ] Password/security changes
* [ ] Webhook failures
* [ ] Important configuration changes
* [ ] Payment/security events

Do NOT log:

```text
Passwords
JWTs
Refresh tokens
API keys
Session cookies
Credit card data
Sensitive personal information
```

Use request/correlation IDs.

---

# 28. Audit Logs

For systems with administrative or sensitive operations:

Record:

```text
Who
What
When
Target
Result
IP/device information where appropriate
Request ID
```

Example:

```text
admin_123
deleted
user_456
2026-09-30T10:30:00Z
success
```

Audit logs should be protected from ordinary users.

---

# 29. Admin Panel Security

Admin endpoints require additional protection.

Check:

* [ ] Admin authentication.
* [ ] Role-based authorization.
* [ ] MFA where appropriate.
* [ ] Rate limiting.
* [ ] Audit logging.
* [ ] Session timeout.
* [ ] Re-authentication for sensitive operations.
* [ ] No hidden admin endpoints.
* [ ] Admin API cannot be accessed by ordinary users.
* [ ] Admin actions require server-side authorization.

Never rely on:

```javascript
if (user.role === "admin")
```

in frontend code alone.

---

# 30. Password Reset / Account Recovery

Test:

```text
Request reset
Receive token
Use token
Reuse token
Expired token
Invalid token
Different user
Multiple reset requests
```

Verify:

* [ ] Tokens are cryptographically random.
* [ ] Tokens expire.
* [ ] Tokens are single-use.
* [ ] Old tokens are invalidated where appropriate.
* [ ] Reset response doesn't leak account existence unnecessarily.
* [ ] Password reset invalidates appropriate sessions.

---

# 31. Account Deletion

Verify:

* [ ] User can initiate deletion where required.
* [ ] Authorization is checked.
* [ ] Sensitive data is deleted/anonymized according to requirements.
* [ ] Sessions are invalidated.
* [ ] OAuth/provider accounts are handled appropriately.
* [ ] Uploaded files are handled.
* [ ] Background jobs don't recreate deleted data.
* [ ] Backups follow the application's retention policy.

---

# 32. Third-Party Services

Inventory every external service:

```text
Authentication
Payments
Email
Cloud storage
Analytics
AI APIs
Maps
Monitoring
CDN
Captcha
Search
```

For each service:

* [ ] API credentials are protected.
* [ ] Permissions are minimal.
* [ ] Production and development credentials are separated.
* [ ] Webhooks are verified.
* [ ] Failure behavior is safe.
* [ ] Sensitive data sent to the provider is documented.
* [ ] Provider access can be revoked.
* [ ] Dependency/security notices are monitored.

---

# 33. AI / LLM Security

For AI-powered applications:

* [ ] System prompts aren't treated as authorization.
* [ ] User input cannot override application permissions.
* [ ] Tool/function calls require server-side authorization.
* [ ] Tool parameters are validated.
* [ ] Model output is treated as untrusted.
* [ ] AI-generated SQL is validated/restricted.
* [ ] AI-generated commands are never blindly executed.
* [ ] Prompt injection is considered.
* [ ] Sensitive data is not unnecessarily sent to external models.
* [ ] AI API keys remain server-side.
* [ ] Usage quotas/rate limits exist.
* [ ] AI cost abuse is considered.

### Important

Never implement:

```text
AI says user is admin
        ↓
Application grants admin access
```

The application must remain the source of truth for authorization.

---

# 34. Frontend Security

Check:

* [ ] No secrets in client bundles.
* [ ] No sensitive environment variables exposed.
* [ ] Source maps are reviewed for production exposure.
* [ ] Dependency vulnerabilities are reviewed.
* [ ] Dangerous HTML rendering is reviewed.
* [ ] Third-party scripts are minimized.
* [ ] CSP is considered.
* [ ] Authentication state isn't trusted solely from client storage.
* [ ] Protected routes are also protected by backend authorization.

Remember:

```text
Frontend protection ≠ security
```

A hidden button is not authorization.

---

# 35. Dependency Security

Run security audits before production.

Examples:

```bash
npm audit
```

or equivalent tooling for your package manager.

Also review:

* [ ] Direct dependencies
* [ ] Transitive dependencies
* [ ] Abandoned packages
* [ ] Suspicious packages
* [ ] Dependency lockfile
* [ ] Package maintainers
* [ ] Known CVEs
* [ ] Automated dependency updates

Do not blindly install packages because they have a convenient name.

---

# 36. Supply Chain Security

Check:

* [ ] Lockfiles are committed.
* [ ] CI uses deterministic installs.
* [ ] Dependencies are scanned.
* [ ] CI secrets are protected.
* [ ] Third-party GitHub Actions are reviewed.
* [ ] Build scripts are reviewed.
* [ ] Deployment credentials are restricted.
* [ ] Production deployment requires appropriate approval.

---

# 37. CI/CD Security

Verify:

* [ ] Secrets are stored in CI secret management.
* [ ] Production credentials aren't exposed to pull requests.
* [ ] Forked PRs cannot access production secrets.
* [ ] Deployment permissions use least privilege.
* [ ] Build artifacts are trusted.
* [ ] Dependency scanning runs automatically.
* [ ] Security tests run automatically.
* [ ] Production deployment is auditable.
* [ ] Rollback is possible.

---

# 38. Cloud Security

For AWS/GCP/Azure/etc.:

* [ ] IAM follows least privilege.
* [ ] Root account is protected.
* [ ] MFA is enabled.
* [ ] Access keys are minimized.
* [ ] Security groups are restrictive.
* [ ] Databases aren't unnecessarily public.
* [ ] Object storage isn't publicly writable.
* [ ] Object storage isn't accidentally public.
* [ ] Encryption is enabled where appropriate.
* [ ] Cloud audit logs are enabled.
* [ ] Billing alerts are configured.
* [ ] Unused resources/credentials are removed.

---

# 39. Server / VPS Security

If using a VPS/EC2 server:

* [ ] OS is updated.
* [ ] SSH access is restricted.
* [ ] Password SSH login is disabled where appropriate.
* [ ] SSH keys are used.
* [ ] Root login is restricted.
* [ ] Firewall is enabled.
* [ ] Only required ports are exposed.
* [ ] Nginx/Apache is updated.
* [ ] Application runs with a non-root user.
* [ ] Process manager is configured.
* [ ] Logs are rotated.
* [ ] Backups exist.
* [ ] Monitoring exists.

Typical public ports:

```text
80   HTTP
443  HTTPS
```

Avoid exposing:

```text
5432 PostgreSQL
3306 MySQL
6379 Redis
27017 MongoDB
```

to the public internet unless there is a specific, secured reason.

---

# 40. Nginx / Reverse Proxy

Check:

* [ ] HTTPS is configured.
* [ ] HTTP redirects to HTTPS.
* [ ] Security headers are configured.
* [ ] Request size limits exist.
* [ ] Proxy timeouts are reasonable.
* [ ] Sensitive internal ports aren't publicly exposed.
* [ ] Server version disclosure is minimized.
* [ ] Access/error logs are protected.
* [ ] WebSocket configuration is intentional.
* [ ] Static files cannot expose secrets.

---

# 41. Redis Security

If Redis is used:

* [ ] Redis is not publicly exposed.
* [ ] Authentication is configured where appropriate.
* [ ] Network access is restricted.
* [ ] TLS is used where required.
* [ ] Sensitive data isn't unnecessarily stored.
* [ ] Cache keys respect tenant/user boundaries.
* [ ] Session data has appropriate expiration.

---

# 42. Object Storage

For S3/Supabase Storage/Cloudinary/etc.:

* [ ] Buckets are private by default where appropriate.
* [ ] Public access is intentional.
* [ ] Upload permissions are restricted.
* [ ] Signed URLs expire.
* [ ] Object ownership is enforced.
* [ ] Files are authorized before download.
* [ ] File types are validated.
* [ ] Storage credentials aren't exposed to clients.

---

# 43. Payment Security

If payments are involved:

* [ ] Use a trusted payment provider.
* [ ] Never store raw card numbers unless specifically required and properly compliant.
* [ ] Verify payment webhooks.
* [ ] Don't trust payment status from frontend requests.
* [ ] Verify transaction amount server-side.
* [ ] Verify currency server-side.
* [ ] Prevent replayed webhook events.
* [ ] Make payment operations idempotent.
* [ ] Audit payment state changes.

---

# 44. Business Logic Security

Technical security alone isn't enough.

Test abuse cases:

```text
Can a user:
- Buy something for ₹0?
- Apply the same coupon repeatedly?
- Use another user's discount?
- Submit the same payment twice?
- Bypass a subscription limit?
- Create unlimited accounts?
- Skip a required workflow step?
- Access premium functionality without payment?
- Manipulate prices?
- Modify another user's resources?
```

Think:

```text
"Can I abuse the intended workflow?"
```

not only:

```text
"Can I inject JavaScript?"
```

---

# 45. Race Conditions

Sensitive operations should be tested for concurrent requests.

Examples:

```text
Double payment
Double withdrawal
Duplicate coupon
Duplicate order
Duplicate registration
Inventory overselling
Repeated reward claim
```

Use:

* Transactions
* Unique constraints
* Idempotency keys
* Atomic operations
* Proper locking where necessary

---

# 46. Pagination / Resource Exhaustion

Never allow:

```text
?page=1&limit=999999999
```

or unlimited exports.

Set:

```text
max page size
max upload size
max request size
max execution time
max export size
max search results
```

---

# 47. ReDoS

Review user-controlled regular expressions.

Avoid executing arbitrary regex supplied by users.

Be careful with complex regex patterns that can cause catastrophic backtracking.

---

# 48. Clickjacking

For applications that shouldn't be embedded:

```http
Content-Security-Policy: frame-ancestors 'none';
```

or an appropriate equivalent.

Review legitimate iframe integrations before blocking all framing.

---

# 49. Open Redirects

Never blindly redirect to user-controlled URLs.

Dangerous:

```text
/login?redirect=https://evil.com
```

Use:

* Internal path allowlists
* Trusted host validation
* Safe redirect handling

---

# 50. HTTP Parameter Pollution

Test duplicate parameters:

```text
?id=1&id=2
```

and conflicting representations:

```text
role=user&role=admin
```

Ensure application behavior is predictable and secure.

---

# 51. GraphQL Security

If GraphQL is used:

* [ ] Authorization exists at resolver/resource level.
* [ ] Introspection is appropriately restricted.
* [ ] Query depth limits exist.
* [ ] Query complexity limits exist.
* [ ] Pagination exists.
* [ ] Batch abuse is considered.
* [ ] Sensitive fields are protected.
* [ ] Rate limiting exists.

---

# 52. WebSocket Security

Check:

* [ ] Authentication occurs during connection.
* [ ] Authorization occurs for actions.
* [ ] Messages are validated.
* [ ] Connection limits exist.
* [ ] Rate limits exist.
* [ ] Origin validation is considered.
* [ ] Sensitive messages aren't broadcast unnecessarily.
* [ ] Disconnected sessions are cleaned up.

---

# 53. Security Testing

Before release perform:

### Automated

* [ ] Dependency scanning
* [ ] SAST
* [ ] Secret scanning
* [ ] Container scanning
* [ ] API security tests
* [ ] Unit tests for authorization
* [ ] Integration tests
* [ ] E2E tests

### Manual

Test:

```text
Authentication
Authorization
IDOR/BOLA
XSS
CSRF
SQL injection
NoSQL injection
SSRF
File upload
Path traversal
Rate limiting
Session handling
Privilege escalation
Business logic abuse
```

---

# 54. Authorization Test Matrix

Create a matrix:

| Resource             | Anonymous | User | Manager | Admin |
| -------------------- | --------: | ---: | ------: | ----: |
| Public page          |         ✅ |    ✅ |       ✅ |     ✅ |
| Own profile          |         ❌ |    ✅ |       ✅ |     ✅ |
| Other user's profile |         ❌ |    ❌ |       ? |     ✅ |
| Create user          |         ❌ |    ❌ |       ? |     ✅ |
| Delete user          |         ❌ |    ❌ |       ❌ |     ✅ |
| System settings      |         ❌ |    ❌ |       ❌ |     ✅ |

Every `?` must have an explicitly defined rule.

---

# 55. Security Regression Tests

Every security bug fixed should ideally get a regression test.

Example:

```text
Bug:
User A could access User B's invoice.

Fix:
Invoice query now checks ownership.

Regression:
Request invoice belonging to another user
→ Must return 403/404.
```

Security fixes should not silently disappear during future refactoring.

---

# 56. Production Configuration

Verify:

```text
NODE_ENV=production
```

and equivalent production configuration.

Check:

* [ ] Debug mode disabled.
* [ ] Verbose errors disabled.
* [ ] Development routes disabled.
* [ ] Test endpoints removed.
* [ ] Mock authentication removed.
* [ ] Seed/admin accounts removed.
* [ ] Default passwords removed.
* [ ] Swagger/API docs appropriately protected.
* [ ] Development CORS removed.
* [ ] Test credentials removed.

---

# 57. Debug & Internal Endpoints

Search for:

```text
/debug
/test
/dev
/admin-test
/health
/metrics
/swagger
/api-docs
/graphql
```

Health/metrics endpoints should not unintentionally expose:

```text
Environment variables
Database credentials
Internal service details
Secrets
User information
```

---

# 58. Source Maps

If production source maps are publicly accessible:

```text
*.js.map
```

review whether they expose:

* Internal source code
* API endpoints
* Comments
* Internal implementation details
* Accidentally embedded secrets

Source maps aren't automatically a vulnerability, but they should be an intentional decision.

---

# 59. Robots.txt & Security

Do not assume:

```text
Disallow: /admin
```

provides security.

`robots.txt` is not an access-control mechanism.

Authentication and authorization must protect sensitive routes.

---

# 60. Backup & Disaster Recovery

Check:

* [ ] Database backups exist.
* [ ] Backups are encrypted where appropriate.
* [ ] Backup access is restricted.
* [ ] Backup retention is defined.
* [ ] Restore procedure is documented.
* [ ] Restore has actually been tested.
* [ ] Recovery Point Objective is defined.
* [ ] Recovery Time Objective is defined.

A backup that has never been restored is not a verified recovery strategy.

---

# 61. Monitoring & Alerting

Monitor:

```text
5xx spikes
Authentication failures
Authorization failures
Unusual traffic
Rate-limit violations
Database failures
Storage failures
Payment failures
Webhook failures
Suspicious admin activity
```

Alerts should be actionable.

---

# 62. Incident Response

Prepare a basic response procedure:

```text
1. Detect
2. Contain
3. Investigate
4. Rotate compromised credentials
5. Remove attacker access
6. Patch vulnerability
7. Restore if necessary
8. Verify systems
9. Document incident
10. Review root cause
```

Maintain an emergency contact list for critical infrastructure.

---

# 63. Security.txt

Consider publishing:

```text
/.well-known/security.txt
```

with:

```text
Contact: security@example.com
Expires: 2027-09-30T00:00:00Z
```

This gives security researchers a responsible way to report vulnerabilities.

---

# 64. Production Security Commands

Typical checks:

```bash
# Dependency audit
npm audit

# Git status
git status

# Search suspicious secrets
git grep -nE \
'password|secret|api[_-]?key|token|private[_-]?key'

# Check listening ports
ss -tulpn

# Check running processes
ps aux

# Check firewall
sudo ufw status

# Check Docker containers
docker ps

# Check environment
printenv
```

**Do not paste production secrets or environment output into public issue trackers, chat, or logs.**

---

# 65. Pre-Production Attack Checklist

Perform controlled testing against a staging environment.

### Authentication

```text
[ ] Brute force login
[ ] Invalid password
[ ] Expired session
[ ] Invalid token
[ ] Reused reset token
[ ] Session fixation
```

### Authorization

```text
[ ] Access another user's resource
[ ] Change user ID
[ ] Change tenant ID
[ ] Change role in request
[ ] Call admin API as normal user
```

### Injection

```text
[ ] SQL injection
[ ] NoSQL injection
[ ] XSS
[ ] Command injection
[ ] Path traversal
```

### API

```text
[ ] Missing authentication
[ ] Missing authorization
[ ] Excessive payload
[ ] Excessive pagination
[ ] Rate-limit bypass
```

### Files

```text
[ ] Executable upload
[ ] HTML upload
[ ] SVG upload
[ ] Oversized file
[ ] Path traversal filename
[ ] Unauthorized download
```

### Business Logic

```text
[ ] Duplicate transaction
[ ] Coupon reuse
[ ] Price manipulation
[ ] Subscription bypass
[ ] Race conditions
```

---

# 66. OWASP Coverage

Use the current **OWASP Top 10** and **OWASP API Security Top 10** as baseline references.

The application should additionally consider risks specific to:

```text
SaaS
AI applications
Payment systems
Multi-tenant systems
Healthcare
Education
Government
Mobile applications
Cloud infrastructure
```

The OWASP lists are a baseline, not a guarantee that an application is secure.

---

# 67. Final Release Gate

Before production deployment, obtain explicit confirmation:

```text
Security Review
-----------------------------
[ ] Threat model reviewed
[ ] Authentication reviewed
[ ] Authorization reviewed
[ ] Tenant isolation reviewed
[ ] Input validation reviewed
[ ] Injection risks reviewed
[ ] XSS reviewed
[ ] CSRF reviewed
[ ] CORS reviewed
[ ] File upload reviewed
[ ] SSRF reviewed
[ ] Webhooks reviewed
[ ] Database security reviewed
[ ] Secrets reviewed
[ ] Dependencies reviewed
[ ] Infrastructure reviewed
[ ] CI/CD reviewed
[ ] Logging reviewed
[ ] Monitoring reviewed
[ ] Backups tested
[ ] Incident response prepared
[ ] Security tests passed
[ ] Critical/High findings resolved or formally accepted
```

---

# 68. Security Sign-Off

## Application

```text
Application:
Version/Commit:
Environment:
Deployment Date:
```

## Review

```text
Developer:
Reviewer:
Security Reviewer:
```

## Findings

```text
Critical: 0
High:     0
Medium:   __
Low:      __
```

## Accepted Risks

For every unresolved issue:

```text
Issue:
Severity:
Impact:
Why accepted:
Mitigation:
Owner:
Review date:
```

---

# 69. Golden Rules

Before shipping, remember:

> **Never trust the client.**

> **Authentication answers "Who are you?" Authorization answers "What are you allowed to do?"**

> **Every object access must be authorization-checked.**

> **Every external input is untrusted.**

> **Secrets never belong in frontend code.**

> **Frontend security is not backend authorization.**

> **A hidden API endpoint is not a protected API endpoint.**

> **A backup is only useful if restoration has been tested.**

> **Rate limits are part of security, not just performance.**

> **Business logic vulnerabilities can be as damaging as injection vulnerabilities.**

> **Security should be tested again after major architectural changes.**

---

# Production Definition of Done

A website is ready for production when:

```text
                ┌─────────────────────┐
                │   THREAT MODEL      │
                └──────────┬──────────┘
                           ↓
                ┌─────────────────────┐
                │ AUTH + AUTHORIZATION│
                └──────────┬──────────┘
                           ↓
                ┌─────────────────────┐
                │ INPUT + API SECURITY│
                └──────────┬──────────┘
                           ↓
                ┌─────────────────────┐
                │ DATABASE + STORAGE  │
                └──────────┬──────────┘
                           ↓
                ┌─────────────────────┐
                │ INFRA + CLOUD       │
                └──────────┬──────────┘
                           ↓
                ┌─────────────────────┐
                │ TEST + SCAN         │
                └──────────┬──────────┘
                           ↓
                ┌─────────────────────┐
                │ MONITOR + BACKUP    │
                └──────────┬──────────┘
                           ↓
                    🚀 PRODUCTION
```

**Security is not "finished" after deployment.** Continue dependency scanning, vulnerability monitoring, logging, patching, access reviews, and periodic security testing throughout the application's lifecycle.
