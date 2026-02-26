-- RecruitIntel Database Schema
-- Supports: RBAC, JSONB CVs, pgvector Embeddings, Tokenomics, Financials

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Enums for Roles and Platforms
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ADMIN', 'EMPLOYER', 'CANDIDATE');
    CREATE TYPE gateway_type AS ENUM ('EcoCash', 'Paynow', 'Stripe');
    CREATE TYPE transaction_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role DEFAULT 'CANDIDATE',
    mfa_enabled BOOLEAN DEFAULT FALSE,
    tokens INTEGER DEFAULT 100,
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Candidate Profiles
CREATE TABLE IF NOT EXISTS candidate_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    structured_data JSONB, -- AI-extracted CV details
    verification_docs JSONB, -- Paths to uploaded PDFs
    embedding vector(1536), -- Gemini/OpenAI embedding size
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Vacancies
CREATE TABLE IF NOT EXISTS job_vacancies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    persona_description TEXT, -- Natural language persona for matching
    embedding vector(1536),
    tokens_consumed INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions & Invoices
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    tokens_added INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    gateway gateway_type NOT NULL,
    status transaction_status DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Logs & Audit
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action TEXT NOT NULL,
    payload JSONB, -- Stores encrypted or masked data
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_candidate_embedding ON candidate_profiles USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_job_embedding ON job_vacancies USING ivfflat (embedding vector_cosine_ops);
