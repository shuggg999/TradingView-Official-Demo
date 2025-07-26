---
title: Technical Architecture
description: "Comprehensive technical stack, architecture patterns, and development guidelines."
inclusion: always
---

# SmartFin Technology Platform - Technical Architecture

## Technology Stack

### Frontend (smartfin-edu/)
- **Framework**: Next.js 15 with App Router + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui + Radix UI primitives
- **Charts**: TradingView Lightweight Charts (target: Advanced Charts)
- **State Management**: Zustand + TanStack Query (React Query)
- **Authentication**: NextAuth.js v5 (beta)
- **Forms**: React Hook Form + Zod validation

### Backend (smartfin-backend/)
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL with Prisma ORM (frontend) + SQLAlchemy (backend)
- **Caching**: Redis for session management and market data caching
- **Authentication**: JWT tokens with bcrypt password hashing
- **Data Sources**: Yahoo Finance, Alpha Vantage APIs

### Development Tools
- **Package Manager**: npm (frontend), pip (backend)
- **Database Migration**: Prisma (frontend), Alembic (backend)
- **Testing**: Jest + React Testing Library (frontend), pytest (backend)
- **Linting**: ESLint (frontend), flake8/black (backend)
- **Type Safety**: TypeScript (frontend), Pydantic (backend)

## Architecture Patterns

### Frontend Architecture
```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   └── (public)/          # Public pages
├── components/            # Reusable React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── forms/            # Form components
│   └── charts/           # Chart components
├── lib/                  # Utility functions and configurations
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Database client
│   ├── redis.ts          # Cache client
│   └── validations.ts    # Zod schemas
└── types/                # TypeScript type definitions
```

### Backend Architecture
```
app/
├── api/                  # API route handlers
│   └── v1/              # API version 1
├── core/                # Core configurations
│   ├── config.py        # Settings and environment
│   ├── database.py      # Database connection
│   └── redis.py         # Redis connection
├── models/              # SQLAlchemy models
├── schemas/             # Pydantic schemas
├── services/            # Business logic layer
└── utils/               # Utility functions
```

### Database Schema
Key entities managed by Prisma:
- **Users**: Authentication, roles, subscriptions
- **Market Data**: Symbols, price history, watchlists
- **Education**: Courses, categories, learning progress
- **API Management**: Keys, usage tracking, rate limiting

## Key Commands

### Development
```bash
# Frontend
npm run dev              # Start development server (port 3005)
npm run build           # Production build
npm run db:migrate      # Run database migrations
npm run db:studio       # Open Prisma Studio

# Backend
uvicorn app.main:app --reload --port 8000  # Start API server
pytest                  # Run tests
alembic upgrade head    # Run migrations
```

### Database Management
```bash
# Prisma commands (frontend)
npx prisma generate     # Generate client
npx prisma db push      # Push schema to database
npx prisma db seed      # Seed database with initial data

# SQLAlchemy commands (backend)
alembic revision --autogenerate -m "description"
alembic upgrade head
```

## Environment Requirements

### Required Environment Variables
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/smartfin"

# Redis
REDIS_URL="redis://localhost:6379"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3005"

# External APIs
ALPHA_VANTAGE_API_KEY="your-api-key"
YAHOO_FINANCE_API_KEY="your-api-key"

# Stripe (for payments)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Development Setup
1. Node.js 18+ and Python 3.9+
2. PostgreSQL 14+ and Redis 6+
3. Install dependencies: `npm install` and `pip install -r requirements.txt`
4. Setup database: `npx prisma db push`
5. Start services: Redis, PostgreSQL
6. Run development servers

## Performance Requirements
- **Frontend**: First Contentful Paint < 1.5s, Lighthouse score > 90
- **Backend**: API response time < 100ms, concurrent users > 1000
- **Database**: Query response time < 50ms, connection pool management
- **Caching**: Redis for session management, market data caching (TTL: 1min-1hour)

## Security Measures
- **Authentication**: JWT tokens with refresh mechanism
- **API Security**: Rate limiting, CORS configuration, input validation
- **Database**: Parameterized queries, connection pooling
- **Environment**: Secrets management, environment separation