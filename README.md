# insly.ai MCP Server

**AI-powered Model Context Protocol server for insly.com insurance platform**

This is the main MCP (Model Context Protocol) server for insly.ai, providing AI-powered tools and capabilities for insurance operations. Built with Next.js and featuring comprehensive service integrations with **263 specialized tools** across five services: FormFlow (27 tools), Identifier (3 tools), Ledger (135 tools), Claim Management (66 tools), and **Site Service (32 tools - COMPLETE TENANT CONFIGURATION)**.

## 🌟 Features Highlights

- **Professional Landing Page** - Authentic Insly branding with detailed service subpages and responsive design
- **Comprehensive Tool Suite** - **263 MCP tools** across five services covering all insurance workflow needs
- **Service-Specific Subpages** - Dedicated pages for each service with structured tool documentation
- **Dual Authentication** - Both credential-based and JWT bearer token support for enhanced security
- **Enterprise Ready** - Production-deployed with professional design and performance optimization

## Features

- **Professional Landing Page** - Authentic Insly branding with exact colors (#FF7D00 orange, #22524A dark green) and real logo
- **Service-Specific Subpages** - Dedicated documentation pages for each service with comprehensive tool listings
- **Modular Tool Architecture** - Each MCP tool is implemented in separate files for easy maintenance
- **Multi-Service Integration** - Complete API integration with **263 specialized tools** across five services:
  - **FormFlow (27 tools)** - Document processing and AI extraction
  - **Identifier (3 tools)** - Authentication and identity management
  - **Ledger (135 tools)** - Complete insurance business operations
  - **Claim Management (66 tools)** - Full claim lifecycle management
  - **Site Service (32 tools)** - Complete tenant configuration management
- **Dual Authentication System** - Both credential-based and JWT bearer token authentication for enhanced security
- **AI-Powered Document Processing** - Advanced data extraction and metadata generation using AI
- **Insurance-focused Operations** - Form submissions, templates, webhooks, and AI-driven document analysis
- **Enterprise Performance** - Production-ready with Redis support, static generation, and optimized builds
- **Professional Design** - Responsive design with Tailwind CSS, custom Insly components, and SEO optimization

## Development

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Testing

```bash
# Test with sample client
node scripts/test-client.mjs http://localhost:3000

# Quick test of all tools
node scripts/quick-test.mjs http://localhost:3000

# Test MCP tools registration
node scripts/test-mcp-tools.mjs http://localhost:3000
```

## Architecture

### Project Structure

**Main Application Files:**
- `app/page.tsx` - Main application layout importing modular components (44 lines)
- `app/layout.tsx` - Root layout with SEO optimization, Inter font, and Insly metadata
- `app/globals.css` - Global styles with exact Insly brand colors and custom CSS classes
- `app/[transport]/route.ts` - MCP server handler with transport support (SSE/HTTP)

**Service Subpages:**
- `app/formflow/page.tsx` - FormFlow service documentation with 27 tools across 6 categories
- `app/identifier/page.tsx` - Identifier service documentation with 3 authentication tools
- `app/ledger/page.tsx` - Ledger service documentation with 135 tools hierarchically organized
- `app/claim-management/page.tsx` - Claim Management service documentation with 92 tools across 12 categories

**Component Architecture:**
- `app/components/Header.tsx` - Clean navigation header with Insly branding
- `app/components/Footer.tsx` - Professional footer with service navigation and links
- `app/components/MCPEndpoints.tsx` - Service overview cards linking to subpages
- `app/components/FormFlowTools.tsx` - Complete FormFlow service tools documentation (legacy)
- `app/components/IdentifierTools.tsx` - Identifier service authentication tools (legacy)
- `app/components/LedgerTools.tsx` - Comprehensive Ledger service tools overview (legacy)

**Tool Development:**

Tools are organized in the `app/tools/` directory by service:

- `app/tools/formflow/` - **FormFlow integration tools (27 total)**
  - Authentication, submissions, templates, files, AI features, webhooks
- `app/tools/identifier/` - **Identifier service tools (3 total)**
  - Authentication: `client-credentials.ts`, `login.ts`, `refresh-token.ts`
- `app/tools/ledger/` - **Ledger business operations tools (135 total)**
  - 20+ categories: sales operations, schemas, business operations, financial operations, system tools
- `app/tools/claim-management/` - **Claim Management tools (92 total - COMPLETE API COVERAGE)**
  - 12 categories: claims, FNOL, tasks, objects, persons, major events, partners, search, imports, dashboard, users
- `app/tools/index.ts` - Central tool registration for all services

To add a new tool:

1. Create `app/tools/[toolname].ts` with a `register[ToolName]Tool(server)` function
2. Add registration to `app/tools/index.ts`
3. Update capabilities in `app/[transport]/route.ts`

### Transport Support

- **SSE (Server-Sent Events)** - For real-time communication (requires Redis)
- **HTTP** - Standard request/response

## MCP Endpoints

The server provides **multiple MCP endpoints** for service separation and specialized tool access:

### **FormFlow Endpoint** (Production Ready)
- **SSE**: `/formflow/sse`
- **HTTP**: `/formflow/mcp`
- **Documentation**: `/formflow`
- **Tools**: 27 FormFlow-specific tools
- **Authentication**: Bearer tokens OR FormFlow credentials
- **Use Case**: Insurance document processing, AI extraction, form management

### **Identifier Endpoint** (Production Ready)
- **SSE**: `/identifier/sse`
- **HTTP**: `/identifier/mcp`
- **Documentation**: `/identifier`
- **Tools**: 3 Identifier authentication tools
- **Authentication**: Insly platform credentials
- **Use Case**: Authentication and identity management for Insly platform

### **Ledger Endpoint** (Production Ready)
- **SSE**: `/ledger/sse` 
- **HTTP**: `/ledger/mcp`
- **Documentation**: `/ledger`
- **Tools**: 135 comprehensive business operation tools
- **Authentication**: Ledger API authentication
- **Use Case**: Complete insurance business operations - policies, claims, quotes, endorsements, reports

### **Claim Management Endpoint** (Production Ready)
- **SSE**: `/claim-management/sse`
- **HTTP**: `/claim-management/mcp`
- **Documentation**: `/claim-management`
- **Tools**: 92 comprehensive claim lifecycle tools (100% API coverage)
- **Authentication**: Claim Management API authentication
- **Use Case**: Complete claim lifecycle management - FNOL, tasks, objects, persons, financial operations

### **Unified Endpoint** (Legacy Support)
- **SSE**: `/sse`
- **HTTP**: `/mcp` 
- **Tools**: All available tools from all services
- **Use Case**: Single connection for clients that want access to all services

### **Connecting to Specific Services**
Agents can connect to specific service endpoints to discover only relevant tools:
```bash
# FormFlow-only tools (27 tools)
curl https://your-domain/formflow/mcp

# Identifier-only tools (3 tools)
curl https://your-domain/identifier/mcp

# Ledger-only tools (135 tools)
curl https://your-domain/ledger/mcp

# Claim Management-only tools (92 tools)
curl https://your-domain/claim-management/mcp

# All tools (257 total)
curl https://your-domain/mcp
```

## Available MCP Tools (257 Total)

### FormFlow Integration Tools (27 tools)

The server provides comprehensive integration with Insly's FormFlow service for document processing and AI-powered form management.

#### Authentication & Token Management
- **`formflow_exchange_token`** - Exchange credentials for JWT bearer token (1-hour validity)
  - Parameters: `clientId`, `clientSecret`, `organizationId`

#### Submission Management
- **`formflow_list_submissions`** - List form submissions with optional filtering and pagination
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `page`, `perPage`, `sortField`, `sortDirection`, `status`
  
- **`formflow_create_submission`** - Create a new form submission
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `name`, `templateId`
  
- **`formflow_get_submission`** - Retrieve specific submission details by ID
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `submissionId`

- **`formflow_update_submission`** - Update submission details and metadata
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `submissionId`, plus optional fields to update

- **`formflow_get_submission_references`** - Get AI-generated references linking answers to source documents
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `submissionId`

- **`formflow_get_submission_events`** - Get processing lifecycle events for a submission
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `submissionId`

- **`formflow_get_upload_url`** - Get temporary S3 upload URL for client-side file uploads
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `submissionId`, `fileName`, `contentType`, `fileSize`

#### Template Management
- **`formflow_list_templates`** - List available form templates with optional pagination
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `page`, `perPage`

- **`formflow_get_template`** - Get detailed template information by ID
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `templateId`

- **`formflow_create_template`** - Create new form template with schema definition
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `name`, `schema`, plus optional fields

- **`formflow_update_template`** - Update existing template configuration
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `templateId`, plus optional fields to update

- **`formflow_delete_template`** - Soft delete a template (reversible)
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `templateId`

- **`formflow_get_template_submissions`** - Get all submissions for a specific template
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `templateId`

#### File Management
- **`formflow_get_file`** - Get detailed file information and metadata
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `fileId`

- **`formflow_delete_file`** - Permanently delete a file (irreversible)
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `fileId`

- **`formflow_file_view`** - View or download a file by its ID
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `fileId`

#### Webhook Management
- **`formflow_create_webhook`** - Create webhook subscription for event notifications
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `url`, `event`

- **`formflow_list_webhooks`** - List all webhook subscriptions
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`)

- **`formflow_get_webhook`** - Get webhook subscription details by ID
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `webhookId`

- **`formflow_update_webhook`** - Update webhook subscription configuration
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `webhookId`, plus optional fields to update

- **`formflow_delete_webhook`** - Delete webhook subscription
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `webhookId`

#### AI-Powered Features
- **`formflow_ai_extract_data`** - Use AI to extract structured data from documents
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `submissionId`, `schema`
  
- **`formflow_ai_generate_metadata`** - Generate metadata for submissions using AI
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `submissionId`, `fileUrls`

- **`formflow_start_processing`** - Start processing a FormFlow submission with AI workflows
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `submissionId`, `generateTemplate` (boolean)

- **`formflow_ai_generate_references`** - Generate references linking answers to source documents using AI
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `submissionId`

- **`formflow_ai_generate_schema_for_submission`** - Generate schema for submission using AI based on documents
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `submissionId`, `model` (optional)

### Authentication

**All 27 FormFlow tools** support **dual authentication methods** for maximum flexibility and security:

**Option 1: Direct Credentials** (traditional)
- **`clientId`** - FormFlow client identifier
- **`clientSecret`** - FormFlow client secret  
- **`organizationId`** - FormFlow organization identifier

**Option 2: Bearer Token** (recommended for security)
- **`bearerToken`** - JWT token obtained from `formflow_exchange_token` (1-hour validity)

The server automatically handles JWT token generation, refresh, and includes rate limiting awareness (60 requests/minute). Bearer tokens provide better security by avoiding credential exposure in each request.

### Identifier Service Tools (3 tools)

The Identifier service provides authentication tools for the Insly platform:

- **`identifier_client_credentials`** - Obtain access tokens using client credentials flow
- **`identifier_login`** - Authenticate users with username/password
- **`identifier_refresh_token`** - Refresh expired access tokens

### Ledger Service Tools (135 tools)

The Ledger service provides **comprehensive insurance business operations** across 20+ categories:

**Core Business Operations:**
- **Policies** (33 tools): Complete policy lifecycle, documents, files, calculations, actions, notifications
- **Consolidated Invoices** (10 tools): Full invoice management, documents, credit notes
- **Claims** (6 tools): Claims processing, reserves, and management
- **Quotes** (6 tools): Quote generation and management
- **Binders** (7 tools): Policy binder management and lifecycle operations
- **Endorsements** (6 tools): Policy change management
- **E-Proposals** (6 tools): Electronic proposal workflows

**Administrative & Configuration:**
- **Feature Configuration** (4 tools): Product, tenant, and feature management
- **Broker Management** (3 tools): Broker consolidation and administration
- **Users** (5 tools): User management and permissions
- **Chat Settings** (1 tool): Communication configuration
- **Request Tracking** (1 tool): Async operation monitoring

**Risk & Compliance:**
- **High-Risk Cases** (5 tools): Risk assessment and case management
- **High-Risk Data** (1 tool): Bulk high-risk data operations
- **Audit** (4 tools): Compliance reporting, audit logs, data access tracking

**Documents & Files:**
- **Documents** (5 tools): Policy and quote document generation
- **Invoice Files** (2 tools): Invoice file management and validation
- **Excel Calculator** (2 tools): Calculator upload and management

**Business Intelligence:**
- **Reports** (5 tools): Business reporting and analytics
- **Dashboards** (5 tools): Business intelligence and renewal analytics
- **Search** (1 tool): Universal multi-search across all entities

**Integrations & Services:**
- **Lookup Services** (2 tools): Ireland address and postcode lookup
- **Notifications** (4 tools): Communication and alert systems
- **Workflows** (4 tools): Process automation and monitoring
- **Schemas** (5 tools): Data structure and validation

**Financial Operations:**
- **Broker Payments** (7 tools): Payment processing and management
- **Debt Policies** (1 tool): Debt policy management
- **Reinsurance** (1 tool): Reinsurance operations

**And many more specialized tools covering every aspect of insurance operations!**

### Claim Management Service Tools (92 tools - COMPLETE API COVERAGE)

The Claim Management service provides **complete claim lifecycle management** across 12 categories with **100% API coverage**:

**Core Claim Operations:**
- **Claims** (23 tools): Basic operations, documents, reserves, decisions, payment processing
- **FNOL** (5 tools): First Notice of Loss processing and external FNOL handling
- **Tasks** (6 tools): Complete task management and workflow operations
- **Objects** (5 tools): Claim object creation, management, and tracking
- **Persons** (4 tools): Person management for claims (claimants, witnesses, etc.)

**Advanced Operations:**
- **Major Events** (6 tools): Catastrophe and large-scale incident management
- **Partners** (5 tools): Business partner management (adjusters, lawyers, repair shops)
- **Search & Lookup** (3 tools): Advanced search, data lookup, and autocomplete
- **Imports** (6 tools): BDX file validation, import, and job management
- **Dashboard** (7 tools): Real-time dashboards for claims, tasks, and analytics

**System & Administration:**
- **Users** (1 tool): Active user management and permissions
- **Access Management** (1 tool): Permission and action management

**Complete claim lifecycle coverage from initial report to final settlement!**

## Design System

### Insly Brand Colors (Exact from insly.com)
- **Primary Orange**: `#FF7D00` - Main brand color
- **Dark Green**: `#22524A` - Secondary brand color  
- **Button Hover**: `#B14D00` - Darker orange for hover states
- **Black**: `#121212` - Text and button color
- **Typography**: Inter font family throughout

### Custom CSS Classes
- `.insly-gradient` - Orange to dark green gradient backgrounds
- `.insly-gradient-text` - Gradient text effects for headings
- `.insly-card` - Feature card styling with hover animations
- `.insly-button` - Primary button with authentic Insly styling
- `.insly-nav-link` - Navigation links with hover effects
- `.insly-footer-link` - Footer link styling

### Component-Based Architecture

The application follows React best practices with modular components:

- **Header Component**: Sticky navigation with Insly branding and platform links
- **MCP Endpoints Section**: Service endpoint overview with clickable navigation cards
- **Tool Documentation Components**: Modular sections for each service (FormFlow, Identifier, Ledger)
- **Footer Component**: Professional footer with service statistics and platform information

**Benefits:**
- **Maintainable**: Each component has single responsibility
- **Reusable**: Components can be easily modified or replaced
- **Performance**: Smaller bundle sizes and better rendering efficiency
- **Developer Experience**: Easier to work with individual sections

## Deployment

**Production Ready** - Deployed for insly.ai with enterprise-grade performance, professional branding, and **complete API coverage across 4 services (257 total tools)**.

### Environment Variables

- `REDIS_URL` - Required for SSE transport in production

### Performance Optimization

- **Static Generation**: Main page optimized for static generation (2.94 kB)
- **Build Optimization**: Fluid compute enabled with `maxDuration` set to 800 seconds
- **Transport Support**: Both SSE and HTTP transports with Redis backing
- **SEO Optimized**: Comprehensive metadata, Open Graph tags, and semantic HTML

## About insly.ai

insly.ai is the AI assistant for [insly.com](https://insly.com), a comprehensive insurance platform that provides:

- Policy management and administration
- Claims processing and management
- Underwriting and risk assessment
- Broker and customer portals
- Analytics and reporting
- Payment processing and billing

### FormFlow Integration

This MCP server includes complete integration with [FormFlow](https://develop.formflow-dev.net), Insly's advanced document processing service that provides:

- **Intelligent Form Processing** - AI-powered extraction of structured data from insurance documents
- **Template Management** - Pre-built and custom form templates for various insurance products
- **Submission Workflows** - End-to-end document submission and processing pipelines
- **AI-Generated Metadata** - Automatic classification and tagging of insurance documents
- **Real-time Processing** - Fast document analysis with 60 requests/minute capacity

The MCP server enables seamless integration of these FormFlow capabilities into AI assistants and automation workflows for insurance operations.

### Complete Insurance Platform Coverage

This MCP server now provides **comprehensive coverage** of the Insly insurance platform with **257 specialized tools** across 4 services:

**FormFlow Service (27 tools):**
- Complete document processing and AI extraction
- Template management and workflow automation
- Advanced AI-powered data analysis

**Identifier Service (3 tools):**
- Full authentication and identity management
- Multi-tenant support and security

**Ledger Service (135 tools):**
- Complete insurance business operations
- Policy lifecycle management
- Financial operations and reporting

**Claim Management Service (92 tools):**
- Complete claim lifecycle coverage (100% API coverage)
- FNOL to settlement processing
- Advanced claim analytics and management

This represents the most comprehensive MCP integration available for insurance platforms, providing AI assistants with complete access to all insurance operations through well-structured, service-specific APIs with dedicated documentation pages.
