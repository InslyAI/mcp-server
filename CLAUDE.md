# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**insly.ai MCP Server** - Main MCP (Model Context Protocol) server for insly.ai, the AI assistant for insly.com insurance platform. This server provides AI-powered tools and capabilities for insurance operations, featuring:

- **FormFlow integration** (25 tools) - Document processing, AI extraction, form management
- **Identifier service** (3 tools) - Authentication with Insly platform  
- **Ledger service** (137 tools) - **COMPLETE API COVERAGE** - All insurance business operations

**IMPLEMENTATION STATUS**: Production-ready with **165 total tools** across three specialized services providing **complete 100% Ledger API coverage**.

## Commands

- **Development**: `pnpm dev` or `npm run dev` - starts Next.js development server
- **Build**: `pnpm build` or `npm run build` - builds the application for production
- **Start**: `pnpm start` or `npm run start` - starts the production server
- **Test client**: `node scripts/test-client.mjs [URL]` - tests the MCP server with a sample client
- **Quick test**: `node scripts/quick-test.mjs [URL]` - runs quick test of all MCP tools

## Architecture

This is a Next.js application that implements an MCP server using the `@vercel/mcp-adapter` package, specifically designed for insly.ai insurance AI capabilities.

### Core Components

- **`app/[transport]/route.ts`** - Main MCP server handler that registers all tools. Uses dynamic routing for different transport methods (SSE, HTTP).
- **`app/page.tsx`** - Main application layout importing modular components (44 lines)
- **`app/layout.tsx`** - Root layout with SEO optimization, Inter font integration, and Insly metadata
- **`app/globals.css`** - Global styles with exact Insly brand colors, custom CSS classes, and Tailwind integration
- **`app/components/`** - Modular React components following best practices:
  - `Header.tsx` - Navigation header with Insly branding
  - `Footer.tsx` - Professional footer with service information
  - `MCPEndpoints.tsx` - MCP server endpoints overview section
  - `FormFlowTools.tsx` - Complete FormFlow service tools documentation
  - `IdentifierTools.tsx` - Identifier service authentication tools
  - `LedgerTools.tsx` - Comprehensive Ledger service tools overview
- **`app/tools/`** - Modular tool directory where each MCP tool is implemented in separate files
  - `app/tools/index.ts` - Central tool registration
  - `app/tools/formflow/` - FormFlow integration tools (25 tools total)
    - Authentication, submission management, template management, file operations, webhooks, AI features
  - `app/tools/identifier/` - Identifier service tools (3 tools total)
    - Authentication: client credentials, login, refresh token
  - `app/tools/ledger/` - Ledger business operations tools (**137 tools total - COMPLETE API COVERAGE**)
    - **25+ categories**: binders (7), claims (6), consolidated-invoices (10), dashboards (5), documents (5), e-proposals (6), endorsements (6), high-risk (5), policies (33), quotes (6), reports (5), schemas (5), users (1), workflows (4), search (1), feature-config (4), request-tracking (1), broker-management (3), excel-calculator (2), high-risk-data (1), lookup-services (2), invoice-files (2), chat-settings (1), and more
- **`app/lib/formflow-client.ts`** - FormFlow API client with dual authentication support (credentials + bearer tokens)
- **MCP Adapter Configuration** - Uses `createMcpHandler` with Redis support for SSE transport and configurable options like `maxDuration` and `verboseLogs`.

### Tool Development

When adding new MCP tools:

1. Create new tool file in `app/tools/[toolname].ts`
2. Export a `register[ToolName]Tool(server)` function
3. Add tool registration to `app/tools/index.ts`
4. Update capabilities object in `app/[transport]/route.ts`

### Key Dependencies

- `@vercel/mcp-adapter` - Vercel's adapter for integrating MCP servers with Next.js
- `@modelcontextprotocol/sdk` - MCP SDK for testing
- `zod` - Schema validation for tool parameters
- `redis` - Required for SSE transport when deployed

### Transport Support & MCP Endpoints

The server supports multiple transport methods and **separate service endpoints**:

**Transport Methods:**
- SSE (Server-Sent Events) - requires Redis for production deployment
- HTTP - standard request/response

**Service Endpoints:**
- **`/formflow/[transport]`** - FormFlow-only tools (25 tools, production ready)
- **`/identifier/[transport]`** - Identifier-only tools (3 tools, production ready)
- **`/ledger/[transport]`** - Ledger-only tools (**137 tools - COMPLETE API COVERAGE**, production ready)
- **`/[transport]`** - Unified endpoint with all tools (**165 total tools**)

**Architecture Benefits:**
- Complete service isolation - no shared authentication or code
- Agents can connect to specific services only
- Independent tool discovery per service
- Separate authentication systems per service

## Design System

### Insly Brand Colors (Exact)
- **Primary Orange**: `#FF7D00` - Main brand color from insly.com
- **Dark Green**: `#22524A` - Secondary brand color
- **Button Hover**: `#B14D00` - Darker orange for hover states
- **Black**: `#121212` - Text and button color
- **Typography**: Inter font family throughout

### Custom CSS Classes
- `.insly-gradient` - Orange to dark green gradient
- `.insly-gradient-text` - Gradient text effect
- `.insly-card` - Feature card styling with hover effects
- `.insly-button` - Primary button with Insly styling
- `.insly-nav-link` - Navigation link with hover states
- `.insly-footer-link` - Footer link styling

### Component-Based Architecture

The application follows React best practices with modular, reusable components:

- **Header Component**: Sticky navigation with real Insly logo and platform links
- **MCP Endpoints Section**: Service endpoint overview with clickable navigation cards  
- **Tool Documentation Components**: Modular sections for each service (FormFlow, Identifier, Ledger)
- **Footer Component**: Professional footer with service statistics and platform information

**Benefits:**
- **Maintainable**: Each component has single responsibility
- **Reusable**: Components can be easily modified or replaced  
- **Performance**: Smaller bundle sizes and better rendering efficiency
- **Developer Experience**: Easier to work with individual sections

**Component Structure:**
```
app/
├── page.tsx (44 lines - main layout)
└── components/
    ├── Header.tsx
    ├── Footer.tsx  
    ├── MCPEndpoints.tsx
    ├── FormFlowTools.tsx
    ├── IdentifierTools.tsx
    └── LedgerTools.tsx
```

## FormFlow Integration

### Authentication Methods
- **Universal Dual Support**: ALL 25 tools support both credential-based and JWT bearer token authentication
- **Bearer Tokens**: 1-hour validity for enhanced security
- **Rate Limiting**: 60 requests/minute awareness
- **Consistent Implementation**: Every FormFlow tool follows the same authentication pattern

### FormFlow Tool Categories (25 Total)
- **Authentication**: Token exchange
- **Submissions**: CRUD operations, references, events, file uploads
- **Templates**: Full lifecycle management
- **Files**: Metadata and deletion operations
- **Webhooks**: Event notification management
- **AI Features**: Document processing, metadata generation, workflow processing, reference generation, schema generation

### Identifier Tool Categories (3 Total)
- **Authentication**: Client credentials, user login, token refresh

### Ledger Tool Categories (137 Total - COMPLETE API COVERAGE)

**🎯 COMPLETE COVERAGE ACHIEVED: All 137 Ledger API endpoints implemented!**

**Core Business Operations:**
- **Policies** (33): Complete policy lifecycle, documents, files, calculations, actions, notifications
- **Consolidated Invoices** (10): Full invoice management, documents, credit notes
- **Claims** (6): Claims processing, reserves, and management
- **Quotes** (6): Quote generation and management
- **Binders** (7): Policy binder management and lifecycle operations
- **Endorsements** (6): Policy change management
- **E-Proposals** (6): Electronic proposal workflows

**Administrative & Configuration:**
- **Feature Configuration** (4): Product, tenant, and feature management
- **Broker Management** (3): Broker consolidation and administration
- **Users** (5): User management and permissions
- **Chat Settings** (1): Communication configuration
- **Request Tracking** (1): Async operation monitoring

**Risk & Compliance:**
- **High-Risk Cases** (5): Risk assessment and case management
- **High-Risk Data** (1): Bulk high-risk data operations
- **Audit** (4): Compliance reporting, audit logs, data access tracking

**Documents & Files:**
- **Documents** (5): Policy and quote document generation
- **Invoice Files** (2): Invoice file management and validation
- **Excel Calculator** (2): Calculator upload and management

**Business Intelligence:**
- **Reports** (5): Business reporting and analytics
- **Dashboards** (5): Business intelligence and renewal analytics
- **Search** (1): Universal multi-search across all entities

**Integrations & Services:**
- **Lookup Services** (2): Ireland address and postcode lookup
- **Notifications** (4): Communication and alert systems
- **Workflows** (4): Process automation and monitoring
- **Schemas** (5): Data structure and validation

**Financial Operations:**
- **Broker Payments** (7): Payment processing and management
- **Debt Policies** (1): Debt policy management
- **Reinsurance** (1): Reinsurance operations

**Additional Specialized Categories covering all remaining API endpoints**

### Deployment Notes

- **Production Ready**: Deployed for insly.ai with professional branding and **complete 100% Ledger API coverage**
- **Component Architecture**: Refactored to modular React components following best practices
- **SSE Transport**: Requires `REDIS_URL` environment variable
- **Performance**: Optimized with `maxDuration` set to 800 seconds and modular component loading
- **Maintainability**: Main page reduced from ~1700 lines to 44 lines with component extraction
- **SEO Optimized**: Comprehensive metadata and Open Graph tags
