# RecruitIntel Deployment Guide

## Local Development Setup

1. **Prerequisites**
   - Node.js v20+
   - PostgreSQL 15+ with `pgvector` extension
   - Google Gemini API Key

2. **Database Setup**
   ```bash
   psql -U postgres -f database/schema.sql
   psql -U postgres -f database/seed.sql
   ```

3. **Backend Initialization**
   ```bash
   cd backend
   cp .env.example .env
   # Update .env with your credentials
   npm install
   npm run dev
   ```

4. **Frontend Initialization**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Production Deployment

- **Database**: Use Supabase or AWS RDS (Postgres).
- **Backend**: Deploy to Render, Railway, or AWS App Runner.
- **Frontend**: Deploy to Vercel or Netlify.

### Environment Variables Required
- `DATABASE_URL`
- `JWT_SECRET`
- `GEMINI_API_KEY`
- `PORT`
