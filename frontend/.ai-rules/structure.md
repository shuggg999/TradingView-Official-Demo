---
title: Project Structure
description: "File organization, naming conventions, and directory structure guidelines."
inclusion: always
---

# SmartFin Technology Platform - Project Structure

## Repository Layout

```
TradingView-Official-Demo/
├── .ai-rules/                          # AI agent steering files
│   ├── product.md                      # Product vision and requirements
│   ├── tech.md                         # Technical architecture guide  
│   ├── structure.md                    # This file - project structure
│   └── business-context.md             # Business context and goals
├── docs/                               # Project documentation
│   ├── 企业级金融网站需求分析.md           # Requirements analysis
│   ├── 企业级金融网站案例研究报告.md       # Competitive analysis
│   ├── 商业模式与企业形象设计.md           # Business model design
│   └── TradingView_Application_Strategy.md # TradingView application strategy
├── design-assets/                      # UI/UX design files
│   ├── ui-preview.html                 # Light theme preview
│   └── ui-preview-dark.html            # Dark theme preview
├── scripts/                            # Development and deployment scripts
│   ├── check-status.sh                 # Health check script
│   ├── start-backend.sh                # Backend startup script
│   └── start-frontend.sh               # Frontend startup script
├── smartfin-edu/                       # Next.js frontend application
└── smartfin-backend/                   # FastAPI backend application
```

## Frontend Structure (smartfin-edu/)

### Directory Organization

```
smartfin-edu/
├── src/
│   ├── app/                            # Next.js 15 App Router
│   │   ├── (auth)/                     # Authentication routes (grouped)
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── (dashboard)/                # Protected dashboard routes
│   │   │   ├── portfolio/
│   │   │   ├── watchlist/
│   │   │   └── settings/
│   │   ├── api/                        # API routes
│   │   │   ├── auth/                   # Authentication endpoints  
│   │   │   ├── market/                 # Market data endpoints
│   │   │   └── users/                  # User management endpoints
│   │   ├── about/                      # Public pages
│   │   ├── education/
│   │   ├── market/
│   │   ├── tools/
│   │   ├── analysis/
│   │   ├── globals.css                 # Global styles
│   │   ├── layout.tsx                  # Root layout
│   │   └── page.tsx                    # Home page
│   ├── components/                     # React components
│   │   ├── ui/                         # Base UI components (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── forms/                      # Form components
│   │   ├── charts/                     # Chart-related components
│   │   ├── layout/                     # Layout components
│   │   │   ├── Navigation.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── MarketData.tsx              # Feature components
│   ├── lib/                            # Utility functions and configs
│   │   ├── auth.ts                     # NextAuth configuration
│   │   ├── prisma.ts                   # Prisma client
│   │   ├── redis.ts                    # Redis client
│   │   ├── utils.ts                    # General utilities
│   │   ├── validations.ts              # Zod validation schemas
│   │   ├── api-error.ts                # API error handling
│   │   ├── auth-middleware.ts          # Authentication middleware
│   │   ├── logger.ts                   # Logging configuration
│   │   └── market-data.service.ts      # Market data service
│   ├── types/                          # TypeScript type definitions
│   │   ├── auth.ts
│   │   ├── market.ts
│   │   └── api.ts
│   └── hooks/                          # Custom React hooks
├── prisma/                             # Database schema and migrations
│   ├── schema.prisma                   # Database schema
│   └── seed.ts                         # Database seeding
├── public/                             # Static assets
│   ├── images/
│   ├── icons/
│   └── ...
├── package.json                        # Dependencies and scripts
├── tailwind.config.ts                  # Tailwind CSS configuration
├── next.config.ts                      # Next.js configuration
└── tsconfig.json                       # TypeScript configuration
```

## Backend Structure (smartfin-backend/)

```
smartfin-backend/
├── app/
│   ├── api/                            # API endpoints
│   │   ├── __init__.py
│   │   └── v1/                         # API version 1
│   │       ├── __init__.py
│   │       ├── auth.py                 # Authentication routes
│   │       ├── market.py               # Market data routes
│   │       └── users.py                # User management routes
│   ├── core/                           # Core configurations
│   │   ├── config.py                   # Settings and environment
│   │   ├── database.py                 # Database connection
│   │   └── redis.py                    # Redis connection
│   ├── models/                         # SQLAlchemy ORM models
│   │   ├── user.py                     # User model
│   │   └── market.py                   # Market data models
│   ├── schemas/                        # Pydantic request/response schemas
│   │   ├── auth.py                     # Authentication schemas
│   │   └── market.py                   # Market data schemas
│   ├── services/                       # Business logic layer
│   │   ├── auth_service.py             # Authentication service
│   │   └── market_service.py           # Market data service
│   ├── utils/                          # Utility functions
│   ├── main.py                         # FastAPI application entry
│   └── main_simple.py                  # Simplified entry point
├── tests/                              # Test files
├── requirements.txt                    # Python dependencies
└── venv/                              # Virtual environment
```

## Naming Conventions

### Files and Directories
- **React Components**: PascalCase (`MarketDataCard.tsx`)
- **Pages**: lowercase with hyphens (`page.tsx`, `not-found.tsx`)
- **API Routes**: lowercase (`route.ts`)
- **Utilities**: camelCase (`market-data.service.ts`)
- **Types**: camelCase (`auth.ts`, `market.ts`)
- **Stylesheets**: kebab-case (`globals.css`)

### Code Conventions
- **Components**: PascalCase (`MarketDataCard`)
- **Functions**: camelCase (`fetchMarketData`)
- **Variables**: camelCase (`currentPrice`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Types/Interfaces**: PascalCase (`User`, `MarketData`)

## Key Configuration Files

### Frontend Configuration
- `package.json`: Dependencies, scripts, and project metadata
- `tailwind.config.ts`: Tailwind CSS customization and design system
- `next.config.ts`: Next.js build and runtime configuration
- `tsconfig.json`: TypeScript compiler configuration
- `prisma/schema.prisma`: Database schema definition

### Backend Configuration
- `requirements.txt`: Python dependencies
- `app/core/config.py`: Environment variables and settings
- `app/main.py`: FastAPI application setup

## Development Guidelines

### File Creation Rules
1. **Components**: Create in appropriate subdirectory under `components/`
2. **Pages**: Use Next.js App Router conventions in `app/`
3. **API Routes**: Follow REST conventions in `app/api/`
4. **Types**: Group related types in single files under `types/`
5. **Utilities**: Place reusable functions in `lib/`

### Import Organization
```typescript
// 1. External libraries
import React from 'react';
import { NextResponse } from 'next/server';

// 2. Internal utilities and types
import { prisma } from '@/lib/prisma';
import type { User } from '@/types/auth';

// 3. Local components and relative imports
import { Button } from './ui/button';
import './styles.css';
```

### Export Conventions
- **Default exports**: For main component/function of the file
- **Named exports**: For utilities, types, and secondary functions
- **Re-exports**: Use index files for clean public APIs