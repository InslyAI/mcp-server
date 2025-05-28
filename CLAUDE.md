# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**insly.ai MCP Server** - Main MCP (Model Context Protocol) server for insly.ai, the AI assistant for insly.com insurance platform. This server provides AI-powered tools and capabilities for insurance operations, featuring:

- **FormFlow integration** (27 tools) - Document processing, AI extraction, form management
- **Identifier service** (3 tools) - Authentication with Insly platform  
- **Ledger service** (135 tools) - **COMPLETE API COVERAGE** - All insurance business operations
- **Claim Management service** (46 tools) - **PHASE 3 COMPLETE** - Financial operations, decisions, and payments

**IMPLEMENTATION STATUS**: Production-ready with **211 total tools** across four specialized services providing comprehensive insurance operations.

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
  - `app/tools/formflow/` - FormFlow integration tools (27 tools total)
    - Authentication, submission management, template management, file operations, webhooks, AI features
  - `app/tools/identifier/` - Identifier service tools (3 tools total)
    - Authentication: client credentials, login, refresh token
  - `app/tools/ledger/` - Ledger business operations tools (**135 tools total - COMPLETE API COVERAGE**)
    - **25+ categories**: binders (7), claims (6), consolidated-invoices (10), dashboards (5), documents (5), e-proposals (6), endorsements (6), high-risk (5), policies (33), quotes (6), reports (5), schemas (5), users (1), workflows (4), search (1), feature-config (4), request-tracking (1), broker-management (3), excel-calculator (2), high-risk-data (1), lookup-services (2), invoice-files (2), chat-settings (1), and more
  - `app/tools/claim-management/` - Claim management operations tools (**46 tools total - PHASE 3 COMPLETE**)
    - **4 categories**: access-management (1), claims (41), dashboard (3), entities (2)
    - **Claims Operations** (41 tools): basic (6), documents (8), comments (4), alarms (3), reserves (9), decisions (6), payment-decisions (5)
- **`app/lib/formflow-client.ts`** - FormFlow API client with dual authentication support (credentials + bearer tokens)
- **MCP Adapter Configuration** - Uses `createMcpHandler` with Redis support for SSE transport and configurable options like `maxDuration` and `verboseLogs`.

### Ledger Directory Structure & Naming Convention

The ledger tools follow a **strict API path-based organization** for perfect alignment with the Insly Ledger API specification:

### Claim Management Directory Structure & Naming Convention (PLANNED)

The claim management tools will follow the **same API path-based organization** pattern as ledger tools for consistency and perfect alignment with the Claim Management API specification:

#### **Claim Management Directory Organization (PLANNED)**
```
/app/tools/claim-management/
├── access-management/     # /api/v1/claim-management/access-management/* endpoints (1 tool)
├── alarms/               # /api/v1/claim-management/claims/{claim}/alarms/* endpoints (3 tools)  
├── claims/               # /api/v1/claim-management/claims/* endpoints (57 tools - largest category)
│   ├── basic/            # Core CRUD operations (6 tools)
│   ├── comments/         # Comment management (4 tools)
│   ├── documents/        # Document operations (8 tools)
│   ├── objects/          # Claim objects (vehicles, property) (6 tools)
│   ├── persons/          # Person management (4 tools)
│   ├── reserves/         # Reserve operations (9 tools)
│   ├── decisions/        # Indemnity decisions (6 tools)
│   ├── payment-decisions/ # Payment decisions (5 tools)
│   ├── tasks/            # Claim tasks (4 tools)
│   ├── alarms/           # Claim-specific alarms (3 tools)
│   └── fnol/             # First Notice of Loss (1 tool)
├── dashboard/            # /api/v1/claim-management/dashboard/* endpoints (7 tools)
├── entities/             # /api/v1/claim-management/{entity} list endpoints (7 tools)
├── external-fnol/        # /api/v1/claim-management/fnol-external/* endpoints (2 tools)
├── fnol/                 # /api/v1/claim-management/fnol/* endpoints (3 tools)
├── imports/              # /api/v1/claim-management/imports/* endpoints (4 tools)
├── major-events/         # /api/v1/claim-management/major-events/* endpoints (5 tools)
├── partners/             # /api/v1/claim-management/partners/* endpoints (5 tools)
├── search/               # /api/v1/claim-management/*search* endpoints (2 tools)
└── tasks/                # /api/v1/claim-management/tasks/* endpoints (1 tool)
```

#### **Ledger Directory Organization**
```
/app/tools/ledger/
├── sales/              # /api/v1/ledger/sales/* endpoints (60+ tools)
│   ├── binders/        # Sales binder management (7 tools)
│   ├── e-proposals/    # Electronic proposals (6 tools)
│   ├── endorsements/   # Policy endorsements (6 tools)
│   ├── features/       # Product feature configuration (4 tools)
│   ├── high-risk/      # High-risk case management (5 tools)
│   ├── ireland-lookup/ # Ireland address lookup services (2 tools)
│   ├── policies/       # Sales policy operations (28 tools)
│   │   ├── calculations/   # Premium calculations & packages (5 tools)
│   │   ├── documents/      # Policy document management (4 tools)
│   │   ├── information/    # Policy data & search (13 tools)
│   │   ├── lifecycle/      # Policy lifecycle operations (9 tools)
│   │   └── referrals/      # Policy referrals & e-proposals (2 tools)
│   └── quotes/         # Quote operations (6 tools)
├── schemes/            # /api/v1/ledger/schemes/* endpoints (17 tools)
│   ├── actions/        # Action schema tools (2 tools)
│   ├── features/       # Feature schema tools (2 tools)
│   ├── mta-renewal/    # MTA renewal schemas (2 tools)
│   ├── policy/         # Policy schema configuration (5 tools)
│   └── regular/        # Regular schema operations (4 tools)
├── policies/           # /api/v1/ledger/policies/* endpoints (2 tools)
│   └── documents/      # Direct policy document operations (2 tools)
└── [other-categories]  # Direct ledger endpoints (58 tools)
    ├── brokers/        # Broker management (3 tools)
    ├── customers/      # Customer operations (9 tools)
    ├── dashboards/     # Business intelligence (5 tools)
    ├── reports/        # Reporting & analytics (5 tools)
    └── [15 more categories...]
```

#### **MCP Tool Naming Convention**
All tools follow **API path-based naming**: `{service}_{api_path_segments}_{action}`

**Ledger Examples:**
- `/api/v1/ledger/sales/binders` → `ledger_sales_binders_create`
- `/api/v1/ledger/schemes/features/{name}` → `ledger_schemes_features_get`
- `/api/v1/ledger/policies/{id}/documents` → `ledger_policies_documents_generate`
- `/api/v1/ledger/customers` → `ledger_customers_list`

**Claim Management Examples (PLANNED):**
- `/api/v1/claim-management/claims` → `claim_management_claims_list`
- `/api/v1/claim-management/claims/{claim}/reserves` → `claim_management_claims_reserves_create`
- `/api/v1/claim-management/dashboard/my-claims/open` → `claim_management_dashboard_my_claims_open`
- `/api/v1/claim-management/partners` → `claim_management_partners_list`

**Benefits:**
- ✅ **Perfect API alignment** - Tool names exactly match API structure
- ✅ **Predictable discovery** - Users can guess tool names from API docs
- ✅ **Clear categorization** - All sales tools start with `ledger_sales_`
- ✅ **Hierarchical organization** - Reflects the actual API path hierarchy
- ✅ **No naming conflicts** - Path-based prefixes prevent duplicates

#### **Schema Validation Standards**
All tools implement comprehensive Zod schemas with:
- **Required parameters** - `bearerToken`, `tenantId` (from identifier_login)
- **Detailed descriptions** - Every parameter has clear documentation
- **Type validation** - Strict typing for IDs, dates, enums, objects
- **Optional parameters** - Clearly marked with `.optional()` and descriptions
- **Nested schemas** - Complex objects use dedicated schema definitions
- **Examples in descriptions** - Common values and formats provided

### Tool Development

When adding new MCP tools:

1. **Follow naming convention**: `{service}_{api_path}_{action}` (e.g., `ledger_*`, `claim_management_*`)
2. **Match directory structure**: Place in folder matching API path
3. **Create tool file**: `app/tools/{service}/{path}/{action-name}.ts`
4. **Export registration function**: `register{ActionName}Tool(server)`
5. **Add to category index**: Import and call in `{category}/index.ts`
6. **Implement full Zod schema**: Required params, descriptions, validation
7. **Add error handling**: Try/catch with detailed error responses
8. **Include usage examples**: In descriptions and response metadata

### Claim Management Implementation Plan (PLANNED)

**Phase 1 - Foundation (20 tools)**:
- Core claims CRUD operations (6 tools)
- Access management (1 tool)
- Basic dashboard views (7 tools)
- Entity lists (6 tools)

**Phase 2 - Document & Communication (15 tools)**:
- Document management (8 tools)
- Comments system (4 tools)
- Alarms and notifications (3 tools)

**Phase 3 - Financial Operations (20 tools)**:
- Reserves management (9 tools)
- Indemnity decisions (6 tools)
- Payment decisions (5 tools)

**Phase 4 - Advanced Features (37 tools)**:
- FNOL processing (6 tools)
- Partners and major events (10 tools)
- Claim objects and persons (10 tools)
- Tasks and workflow (5 tools)
- Import operations (4 tools)
- Search capabilities (2 tools)

**Authentication & Compatibility**:
- Uses same bearer token as ledger service ✅
- Same tenant ID header requirement ✅
- Consistent error handling patterns ✅
- Follows identical tool architecture ✅

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
- **`/formflow/[transport]`** - FormFlow-only tools (27 tools, production ready)
- **`/identifier/[transport]`** - Identifier-only tools (3 tools, production ready)
- **`/ledger/[transport]`** - Ledger-only tools (**135 tools - COMPLETE API COVERAGE**, production ready)
- **`/claim-management/[transport]`** - Claim Management-only tools (**92 tools - PLANNED**, full claim lifecycle)
- **`/[transport]`** - Unified endpoint with all tools (**165 total tools**, expanding to **257 with claim management**)

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

### FormFlow Tool Categories (27 Total)
- **Authentication**: Token exchange
- **Submissions**: CRUD operations, references, events, file uploads
- **Templates**: Full lifecycle management
- **Files**: Metadata and deletion operations
- **Webhooks**: Event notification management
- **AI Features**: Document processing, metadata generation, workflow processing, reference generation, schema generation

### Identifier Tool Categories (3 Total)
- **Authentication**: Client credentials, user login, token refresh

### Ledger Tool Categories (135 Total - COMPLETE API COVERAGE)

**🎯 COMPLETE COVERAGE ACHIEVED: All 135 Ledger API endpoints implemented!**

### Claim Management Tool Categories (92 Total - PLANNED)

**🎯 COMPREHENSIVE CLAIM LIFECYCLE: Complete claim management system from FNOL to settlement!**

**Core Claim Operations:**
- **Claims** (57): Complete claim lifecycle management including basic CRUD (6), comments (4), documents (8), objects (6), persons (4), reserves (9), decisions (6), payment decisions (5), tasks (4), alarms (3), and FNOL (1)
- **Dashboard** (7): Business intelligence for claim management including my claims (open, alarmed, inactive, recent), unassigned claims, and task management
- **Alarms** (3): Claim alarm and notification management
- **Documents** (8): Claim document generation, rendering, upload, and management

**FNOL (First Notice of Loss):**
- **External FNOL** (2): External claim reporting and document submission
- **FNOL** (3): Standard first notice of loss processing and link generation

**Business Intelligence & Management:**
- **Search** (2): Universal claim search and customer autocomplete
- **Dashboard** (7): Comprehensive claim analytics and task management
- **Imports** (4): Bulk claim data import operations
- **Tasks** (1): General task management and workflow

**Partner & Event Management:**
- **Partners** (5): External partner and service provider management
- **Major Events** (5): Catastrophe and major event claim processing
- **Entities** (7): Entity listing for objects, persons, reserves, decisions, payments, events, and users

**Access & Configuration:**
- **Access Management** (1): Permission and action management for claims

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
- **Claim Management Expansion**: Ready for implementation of 92 additional tools for complete insurance platform coverage
- **Component Architecture**: Refactored to modular React components following best practices
- **SSE Transport**: Requires `REDIS_URL` environment variable
- **Performance**: Optimized with `maxDuration` set to 800 seconds and modular component loading
- **Maintainability**: Main page reduced from ~1700 lines to 44 lines with component extraction
- **SEO Optimized**: Comprehensive metadata and Open Graph tags
- **Scalable Architecture**: Service isolation enables independent tool development and deployment
