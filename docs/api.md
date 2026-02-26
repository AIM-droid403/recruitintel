# RecruitIntel API Documentation

## Authentication

### POST `/api/auth/register`
Registers a new user.
- **Body**: `{ "email": "...", "password": "...", "role": "ADMIN" | "EMPLOYER" | "CANDIDATE" }`

### POST `/api/auth/login`
Authenticates a user and returns a JWT.
- **Body**: `{ "email": "...", "password": "..." }`
- **Response**: `{ "token": "...", "user": { ... } }`

---

## Jobs & Matching

### POST `/api/jobs`
Creates a new job listing. Requires `EMPLOYER` or `ADMIN` role.
- **Cost**: 10 Tokens
- **Body**: `{ "title": "...", "description": "...", "personaDescription": "..." }`

### POST `/api/jobs/:id/match`
Executes neural matching between a job and current candidate pool.
- **Cost**: 20 Tokens
- **Response**: List of ranked candidates with AI reasoning.

---

## CV & Profiles

### POST `/api/cv/upload`
Uploads raw CV text for AI extraction and vector indexing.
- **Body**: `{ "rawText": "..." }`

---

## Admin & System

### GET `/api/admin/analytics`
Fetch platform-wide performance metrics. Requires `ADMIN` role.

### GET `/api/system/logs`
Tail system and audit logs.
