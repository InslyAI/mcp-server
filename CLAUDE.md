# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**insly.ai MCP Server** - Main MCP (Model Context Protocol) server for insly.ai, the AI assistant for insly.com insurance platform. This server provides AI-powered tools and capabilities for insurance operations, featuring:

- **FormFlow integration** (27 tools) - Document processing, AI extraction, form management
- **Identifier service** (3 tools) - Authentication with Insly platform  
- **Ledger service** (135 tools) - **COMPLETE API COVERAGE** - All insurance business operations
- **Claim Management service** (66 tools) - **PHASE 4 COMPLETE** - FNOL, tasks, objects, persons, and financial operations
- **Site Service** (32 tools) - **COMPLETE TENANT CONFIGURATION** - Features, schemes, products, calculators

**IMPLEMENTATION STATUS**: Production-ready with **263 total tools** across five specialized services providing comprehensive insurance operations.

## Commands

### Development & Build
- `pnpm dev` or `npm run dev` - Start Next.js development server on http://localhost:3000
- `pnpm build` or `npm run build` - Build for production (static optimization enabled)
- `pnpm start` or `npm run start` - Start production server
- `pnpm install` or `npm install` - Install dependencies

### Testing & Utilities
- `node scripts/test-client.mjs [URL]` - Test MCP server with sample client
- `node scripts/quick-test.mjs [URL]` - Quick test of all MCP tools
- `node scripts/test-mcp-tools.mjs [URL]` - Test MCP tools registration
- `node scripts/test-formflow.mjs` - Test FormFlow service integration
- `node scripts/count-tools.mjs` - Count tools across all services
- `node scripts/find-duplicate-tools.mjs` - Find duplicate tool names
- `node scripts/improve-descriptions.mjs` - Improve tool descriptions using AI

## Architecture

This is a Next.js application implementing an MCP server using `@vercel/mcp-adapter`, specifically designed for insly.ai insurance AI capabilities.

### Core MCP Implementation

- **`app/[transport]/route.ts`** - Main unified MCP handler registering all 263 tools
- **`app/{service}/[transport]/route.ts`** - Service-specific MCP endpoints:
  - `/formflow/[transport]` - FormFlow tools only (27 tools)
  - `/identifier/[transport]` - Identifier tools only (3 tools)
  - `/ledger/[transport]` - Ledger tools only (135 tools)
  - `/claim-management/[transport]` - Claim Management tools only (66 tools)
  - `/site-service/[transport]` - Site Service tools only (32 tools)
- **Transport Methods**: SSE (requires Redis) and HTTP

### Web Application Structure

- **`app/page.tsx`** - Main landing page (44 lines, component-based)
- **`app/layout.tsx`** - Root layout with Insly branding and SEO
- **`app/globals.css`** - Insly brand colors and Tailwind integration
- **`app/{service}/page.tsx`** - Service documentation pages
- **`app/components/`** - Reusable React components

### Tool Organization

All 263 tools follow strict API path-based organization in `app/tools/`:

```
app/tools/
├── index.ts                    # Central registration for all services
├── formflow/                   # 27 FormFlow tools
├── identifier/                 # 3 Identifier tools
├── ledger/                     # 135 Ledger tools (hierarchical)
├── claim-management/           # 66 Claim Management tools
└── site-service/              # 32 Site Service tools
```

### MCP Tool Naming Convention

**Strict API path-based naming**: `{service}_{api_path_segments}_{action}`

Examples:
- `/api/v1/ledger/sales/binders` → `ledger_sales_binders_create`
- `/api/v1/claim-management/claims/{id}/reserves` → `claim_management_claims_reserves_create`
- `/api/v1/site-service/features/tenant` → `site_service_features_tenant_get`

### Authentication Patterns

- **FormFlow**: Dual support - Bearer tokens (1hr) OR credentials
- **Identifier**: Platform credentials → Bearer token
- **Ledger**: Bearer token from identifier_login + tenantId header
- **Claim Management**: Same as Ledger (shared auth)
- **Site Service**: Bearer token + tenantId header

### Key Dependencies

- `@vercel/mcp-adapter` - MCP server integration for Next.js
- `@modelcontextprotocol/sdk` - MCP SDK for testing
- `zod` - Schema validation for all tool parameters
- `redis` - Required for SSE transport in production
- `next` - React framework with App Router
- `tailwindcss` - Utility-first CSS framework

## Service-Specific Details

### Site Service (32 tools) - NEW

Complete tenant configuration management:

**Feature Management (10 tools)**:
- Tenant features (get, update, public access)
- Product features (CRUD operations, schema integration)
- Claim features (get, set, save configurations)
- Scheme features (get, set, save, type checking)

**Scheme & Product Management (12 tools)**:
- Schemes (create, get by version, UI schemes, list by type)
- Products (create, copy, list)
- Excel calculators (get, upload)

**Static Documents (5 tools)**:
- Upload, get, delete static documents
- Document listing and management

### Claim Management (66 tools)

Complete claim lifecycle with 100% API coverage across 9 categories:
- **Claims** (41): Basic ops, documents, comments, alarms, reserves, decisions, payments
- **FNOL** (5): Internal and external first notice of loss
- **Tasks** (6): Complete task management
- **Objects** (5): Vehicles, property management
- **Persons** (4): Claimants, witnesses, etc.
- **Dashboard** (3): Analytics and monitoring
- **Additional**: Major events, partners, imports, search

### Ledger (135 tools)

Comprehensive business operations with hierarchical organization:
- **Sales** (60+): Policies, quotes, binders, endorsements, e-proposals
- **Schemes** (17): Configuration and validation schemas
- **Business Ops**: Customers, brokers, invoices, reports
- **Financial**: Payments, reinsurance, debt policies
- **System**: Users, features, workflows, audit

## Development Guidelines

### Adding New Tools

1. **Create tool file**: `app/tools/{service}/{category}/{action}.ts`
2. **Export registration**: `export function register{Action}Tool(server: Server)`
3. **Implement Zod schema** with:
   - Required: `bearerToken`, `tenantId` (where applicable)
   - Detailed parameter descriptions
   - Optional parameters clearly marked
   - Examples in descriptions
4. **Add to index**: Import in `{category}/index.ts`
5. **Error handling**: Comprehensive try/catch with detailed messages
6. **Test thoroughly**: Use testing scripts to verify

### Code Style

- TypeScript with strict typing
- Async/await for all API calls
- Consistent error response format
- No inline API URLs - use client utilities
- Follow existing patterns in the service

## Production Deployment

- **Vercel optimized**: Static generation, edge functions
- **Redis required**: For SSE transport (`REDIS_URL` env var)
- **Performance**: `maxDuration: 800` for long-running operations
- **Security**: All sensitive data in environment variables
- **Monitoring**: Vercel Analytics integrated

## Testing Approach

1. **Unit testing**: Individual tool functions
2. **Integration testing**: Service client connections
3. **E2E testing**: Full MCP protocol with test clients
4. **Manual testing**: Service documentation pages

Use the provided test scripts for quick validation during development.