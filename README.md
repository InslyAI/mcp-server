# insly.ai MCP Server

**AI-powered Model Context Protocol server for insly.com insurance platform**

This is the main MCP (Model Context Protocol) server for insly.ai, providing AI-powered tools and capabilities for insurance operations. Built with Next.js and featuring comprehensive FormFlow integration with 25 specialized tools for document processing, AI-powered data extraction, and automated insurance workflows.

## 🌟 Features Highlights

- **Professional Landing Page** - Authentic Insly branding with exact colors and real logo from insly.com
- **Comprehensive Tool Suite** - 25 FormFlow MCP tools covering all insurance workflow needs
- **Dual Authentication** - Both credential-based and JWT bearer token support for enhanced security
- **Enterprise Ready** - Production-deployed with professional design and performance optimization

## Features

- **Professional Landing Page** - Authentic Insly branding with exact colors (#FF7D00 orange, #22524A dark green) and real logo
- **Modular Tool Architecture** - Each MCP tool is implemented in separate files for easy maintenance
- **Comprehensive FormFlow Integration** - Complete API integration with 25 specialized tools covering all FormFlow endpoints
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
- `app/page.tsx` - Professional landing page with authentic Insly branding and comprehensive tool documentation
- `app/layout.tsx` - Root layout with SEO optimization, Inter font, and Insly metadata
- `app/globals.css` - Global styles with exact Insly brand colors and custom CSS classes
- `app/[transport]/route.ts` - MCP server handler with transport support (SSE/HTTP)

**Tool Development:**

Tools are organized in the `app/tools/` directory:

- `app/tools/formflow/` - **FormFlow integration tools (25 total)**
  - **Authentication**: `exchange-token.ts` - Exchange credentials for JWT bearer token
  - **Submissions**: `list-submissions.ts`, `create-submission.ts`, `get-submission.ts`, `update-submission.ts`, `get-submission-references.ts`, `get-submission-events.ts`, `get-upload-url.ts`
  - **Templates**: `list-templates.ts`, `get-template.ts`, `create-template.ts`, `update-template.ts`, `delete-template.ts`, `get-template-submissions.ts`
  - **Files**: `get-file.ts`, `delete-file.ts`, `file-view.ts`
  - **AI Features**: `ai-extract-data.ts`, `ai-generate-metadata.ts`, `start-processing.ts`, `ai-generate-references.ts`, `ai-generate-schema.ts`
  - **Webhooks**: `create-webhook.ts`, `list-webhooks.ts`, `get-webhook.ts`, `update-webhook.ts`, `delete-webhook.ts`
- `app/tools/index.ts` - Central tool registration
- `app/lib/formflow-client.ts` - FormFlow API client with dual authentication support

To add a new tool:

1. Create `app/tools/[toolname].ts` with a `register[ToolName]Tool(server)` function
2. Add registration to `app/tools/index.ts`
3. Update capabilities in `app/[transport]/route.ts`

### Transport Support

- **SSE (Server-Sent Events)** - For real-time communication (requires Redis)
- **HTTP** - Standard request/response

## Available MCP Tools

### FormFlow Integration Tools

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

**All 25 FormFlow tools** support **dual authentication methods** for maximum flexibility and security:

**Option 1: Direct Credentials** (traditional)
- **`clientId`** - FormFlow client identifier
- **`clientSecret`** - FormFlow client secret  
- **`organizationId`** - FormFlow organization identifier

**Option 2: Bearer Token** (recommended for security)
- **`bearerToken`** - JWT token obtained from `formflow_exchange_token` (1-hour validity)

The server automatically handles JWT token generation, refresh, and includes rate limiting awareness (60 requests/minute). Bearer tokens provide better security by avoiding credential exposure in each request.

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

### Page Components
- **Header**: Sticky navigation with real Insly logo and professional branding
- **Hero Section**: Gradient background with performance statistics (25 tools, 60 req/min, 24/7 AI)
- **Features Grid**: 6 insurance-focused feature cards with icons and descriptions
- **Tools Showcase**: Categorized display of all 25 FormFlow MCP tools
- **Endpoints Documentation**: Clear presentation of SSE and HTTP transport options
- **Professional Footer**: Platform links and comprehensive documentation

## Deployment

**Production Ready** - Deployed for insly.ai with enterprise-grade performance and professional branding.

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
