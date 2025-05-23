# insly.ai MCP Server

**AI-powered Model Context Protocol server for insly.com insurance platform**

This is the main MCP (Model Context Protocol) server for insly.ai, providing AI-powered tools and capabilities for insurance operations. Built with Next.js and the Vercel MCP Adapter.

## Features

- **Modular Tool Architecture** - Each MCP tool is implemented in separate files for easy maintenance
- **FormFlow Integration** - Complete API integration with Insly's FormFlow service for document processing
- **AI-Powered Tools** - Document data extraction and metadata generation using AI
- **Insurance-focused Operations** - Form submissions, templates, and AI-driven document analysis
- **Production Ready** - Deployed on Vercel with Redis support for SSE transport
- **Comprehensive Authentication** - JWT token-based authentication with automatic refresh

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

### Tool Development

Tools are organized in the `app/tools/` directory:

- `app/tools/echo.ts` - Echo test tool
- `app/tools/calculator.ts` - Calculator test tool  
- `app/tools/formflow/` - FormFlow integration tools
  - `list-submissions.ts` - List form submissions with filtering
  - `create-submission.ts` - Create new form submissions
  - `get-submission.ts` - Retrieve submission details
  - `list-templates.ts` - List available form templates
  - `ai-extract-data.ts` - AI-powered document data extraction
  - `ai-generate-metadata.ts` - AI-generated submission metadata
- `app/tools/index.ts` - Central tool registration

To add a new tool:

1. Create `app/tools/[toolname].ts` with a `register[ToolName]Tool(server)` function
2. Add registration to `app/tools/index.ts`
3. Update capabilities in `app/[transport]/route.ts`

### Transport Support

- **SSE (Server-Sent Events)** - For real-time communication (requires Redis)
- **HTTP** - Standard request/response

## Available MCP Tools

### Core Tools
- **`echo`** - Echo a message (testing)
- **`calculator`** - Perform basic mathematical calculations (testing)

### FormFlow Integration Tools

The server provides comprehensive integration with Insly's FormFlow service for document processing and AI-powered form management.

#### Submission Management
- **`formflow_list_submissions`** - List form submissions with optional filtering and pagination
  - Parameters: `clientId`, `clientSecret`, `organizationId`, `page`, `perPage`, `sortField`, `sortDirection`, `status`
  
- **`formflow_create_submission`** - Create a new form submission
  - Parameters: `clientId`, `clientSecret`, `organizationId`, `name`, `templateId`
  
- **`formflow_get_submission`** - Retrieve specific submission details by ID
  - Parameters: `clientId`, `clientSecret`, `organizationId`, `submissionId`

#### Template Management
- **`formflow_list_templates`** - List available form templates with optional pagination
  - Parameters: `clientId`, `clientSecret`, `organizationId`, `page`, `perPage`

#### AI-Powered Features
- **`formflow_ai_extract_data`** - Use AI to extract structured data from documents
  - Parameters: `clientId`, `clientSecret`, `organizationId`, `submissionId`, `extractionSchema`
  
- **`formflow_ai_generate_metadata`** - Generate metadata for submissions using AI
  - Parameters: `clientId`, `clientSecret`, `organizationId`, `submissionId`, `fileUrls`

### Authentication

All FormFlow tools require the following credentials:
- **`clientId`** - FormFlow client identifier
- **`clientSecret`** - FormFlow client secret
- **`organizationId`** - FormFlow organization identifier

The server automatically handles JWT token generation, refresh, and includes rate limiting awareness (60 requests/minute).

## Deployment

Deployed on Vercel at your insly.ai domain.

### Environment Variables

- `REDIS_URL` - Required for SSE transport in production

### Vercel Configuration

- Fluid compute enabled for optimal performance
- `maxDuration` set to 800 seconds
- Supports both SSE and HTTP transports

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
