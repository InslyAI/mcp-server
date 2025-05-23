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
  - `exchange-token.ts` - Exchange credentials for JWT bearer token
  - `list-submissions.ts` - List form submissions with filtering
  - `create-submission.ts` - Create new form submissions
  - `get-submission.ts` - Retrieve submission details
  - `update-submission.ts` - Update submission details and metadata
  - `get-submission-references.ts` - Get AI-generated references
  - `get-submission-events.ts` - Get processing lifecycle events
  - `get-upload-url.ts` - Get S3 upload URLs for files
  - `list-templates.ts` - List available form templates
  - `get-template.ts` - Get template details by ID
  - `create-template.ts` - Create new form templates
  - `update-template.ts` - Update template configuration
  - `delete-template.ts` - Soft delete templates
  - `get-file.ts` - Get file metadata
  - `delete-file.ts` - Delete files permanently
  - `ai-extract-data.ts` - AI-powered document data extraction
  - `ai-generate-metadata.ts` - AI-generated submission metadata
  - `create-webhook.ts` - Create webhook subscriptions
  - `list-webhooks.ts` - List webhook subscriptions
  - `get-webhook.ts` - Get webhook details by ID
  - `update-webhook.ts` - Update webhook configuration
  - `delete-webhook.ts` - Delete webhook subscriptions
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

#### File Management
- **`formflow_get_file`** - Get detailed file information and metadata
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `fileId`

- **`formflow_delete_file`** - Permanently delete a file (irreversible)
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
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `submissionId`, `extractionSchema`
  
- **`formflow_ai_generate_metadata`** - Generate metadata for submissions using AI
  - Parameters: `bearerToken` OR (`clientId`, `clientSecret`, `organizationId`), `submissionId`, `fileUrls`

### Authentication

FormFlow tools support **dual authentication methods**:

**Option 1: Direct Credentials** (traditional)
- **`clientId`** - FormFlow client identifier
- **`clientSecret`** - FormFlow client secret  
- **`organizationId`** - FormFlow organization identifier

**Option 2: Bearer Token** (recommended for security)
- **`bearerToken`** - JWT token obtained from `formflow_exchange_token` (1-hour validity)

The server automatically handles JWT token generation, refresh, and includes rate limiting awareness (60 requests/minute). Bearer tokens provide better security by avoiding credential exposure in each request.

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
