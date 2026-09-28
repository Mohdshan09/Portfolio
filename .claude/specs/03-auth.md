# 03 — Admin Authentication

Single admin (you). No public signup route — ever.

## Flow
1. `POST /api/auth/login` { email, password } → bcrypt compare
2. Success: return access token (JWT, 15m) in body; set refresh token (JWT, 7d) as
   `httpOnly; secure; sameSite=strict; path=/api/auth` cookie. Store hash of refresh token on AdminUser.
3. `POST /api/auth/refresh` → rotates refresh token, returns new access token.
4. `POST /api/auth/logout` → clears cookie + stored hash.
5. `GET /api/auth/me` → current admin.

## Protection
- Login rate limit: 5 attempts / 15 min per IP.
- Account lock: 5 failed logins → `lockedUntil = now + 15m`.
- Generic error message: "Invalid credentials" (no user enumeration).
- Access token kept in memory on client (not localStorage). Axios interceptor refreshes on 401 once.

## Client
- `<ProtectedRoute>` wraps `/admin/*`; redirects to `/admin/login`.
- Silent refresh on app load.

## Acceptance
- Refresh token reuse (old token after rotation) invalidates session.
- No route under `/api/admin` reachable without valid access token.
