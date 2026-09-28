# Auth Security

- [ ] Passwords hashed with bcrypt (cost ≥ 12). Admin hash generated offline, stored in env/seed.
- [ ] No `/register` route exists anywhere.
- [ ] Access token: 15 min, signed HS256, contains only `sub` and `role`.
- [ ] Access token stored in memory, never localStorage/sessionStorage.
- [ ] Refresh cookie: `httpOnly`, `secure` (prod), `sameSite=strict`, scoped `path=/api/auth`.
- [ ] Refresh rotation: each use issues a new token and invalidates the old one (hash stored in DB).
- [ ] Reuse detection: presenting a revoked refresh token clears all sessions.
- [ ] Login responses identical for wrong email vs wrong password; similar response time.
- [ ] Lockout after 5 failures for 15 minutes; counter resets on success.
- [ ] `requireAuth` verifies signature, expiry, and that admin still exists.
- [ ] Logout clears cookie and DB hash.
- [ ] JWT `alg` explicitly pinned when verifying (reject `none`).

## Tests to write
- Expired access token → 401
- Tampered token → 401
- Old refresh token after rotation → 401 + session revoked
- 6th login attempt → 429
