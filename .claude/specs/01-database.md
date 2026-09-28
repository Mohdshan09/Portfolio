# 01 — Database Models (PostgreSQL / Prisma)

All models: `createdAt`/`updatedAt` timestamps, `order Int` for manual sorting, `isPublished Boolean` where content is public.

## Profile (singleton)
name, headline, summary, location, email, socials { github, linkedin, twitter },
resumeUrl, avatarUrl, availableForWork: Boolean

## Skill
name, category (enum: language | framework | database | tool | concept), level? (1–5), icon?, order

## Experience
company, role, type (enum: internship | full-time | freelance), startDate, endDate|null (present),
location?, bullets: [String], techStack: [String], liveUrl?, order, isPublished

## Project
title, slug (unique, indexed), shortDescription, description (markdown),
role (e.g. "Backend Developer"), techStack: [String], highlights: [String],
coverImage { url, publicId, alt }, gallery: [{ url, publicId, alt }],
liveUrl?, githubUrl?, featured: Boolean, startDate, endDate|null, order, isPublished

## Publication
title, venue, volume?, issue?, date, summary, bullets: [String], certificateUrl?, paperUrl?, order, isPublished

## Certificate
title, issuer, date, credentialUrl?, order, isPublished

## Education
institution, degree, field?, startYear, endYear, score?, order

## Message (contact form)
name, email, subject?, body, ipHash, userAgent, status (enum: new | read | archived), createdAt
Index: `{ status: 1, createdAt: -1 }`

## AdminUser
email (unique), passwordHash, refreshTokenHash?, lastLoginAt, failedLoginCount, lockedUntil?

## Seed
`npm run seed` loads initial content from the resume: EduERP, ExamLyst, E-commerce (Zidio),
internships at Zidio + BHN, IJPREMS publication, Udemy certificates, BIT Raipur education.

## Acceptance
- `prisma/schema.prisma` models mirror the Zod schemas in `/shared` (shape stays in sync; Zod remains
  the single source of truth for request/response validation, Prisma for persistence).
- `slug` auto-generated from title, unique (`@unique` + DB index).
- Migrations tracked via `prisma migrate dev`; `prisma/migrations/` committed to the repo.
