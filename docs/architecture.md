# RecruitIntel Architecture

## System Overview
RecruitIntel is built as a high-performance monorepo utilizing a modern AI-native stack.

```mermaid
graph TD
    User((User)) -->|HTTPS| Frontend[Next.js 14 Dashboard]
    Frontend -->|REST API| Backend[Node.js Express Server]
    Backend -->|JWT Auth| RBAC[RBAC Middleware]
    RBAC -->|Tokens| Tokenomics[Tokenomics Engine]
    Tokenomics -->|Queries| DB[(PostgreSQL + pgvector)]
    Backend -->|SDK| Gemini[Google Gemini AI]
    Gemini -->|Extraction| Backend
    Gemini -->|Neural Search| Backend
```

## Core Components

### 1. Tokenomics Engine
Every high-value AI action (Job Posting, Neural Matching) is gated by a tokenomics middleware. It verifies user balance in the DB before allowing the service layer to proceed.

### 2. Neural Search Layer
Utilizes `pgvector` for initial semantic distance filtering followed by Gemini LLM for "Neural Reranking" and qualitative reasoning.

### 3. Design System
Strict technical aesthetic using Tailwind CSS constants and "glassmorphism" components.
