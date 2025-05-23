# insly.ai MCP Server

**AI-powered Model Context Protocol server for insly.com insurance platform**

This is the main MCP (Model Context Protocol) server for insly.ai, providing AI-powered tools and capabilities for insurance operations. Built with Next.js and the Vercel MCP Adapter.

## Features

- **Modular Tool Architecture** - Each MCP tool is implemented in separate files for easy maintenance
- **Insurance-focused AI Tools** - Designed specifically for insly.com insurance platform operations
- **Production Ready** - Deployed on Vercel with Redis support for SSE transport
- **Test Tools** - Echo and calculator tools for development and testing

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
```

## Architecture

### Tool Development

Tools are organized in the `app/tools/` directory:

- `app/tools/echo.ts` - Echo test tool
- `app/tools/calculator.ts` - Calculator test tool  
- `app/tools/index.ts` - Central tool registration

To add a new tool:

1. Create `app/tools/[toolname].ts` with a `register[ToolName]Tool(server)` function
2. Add registration to `app/tools/index.ts`
3. Update capabilities in `app/[transport]/route.ts`

### Transport Support

- **SSE (Server-Sent Events)** - For real-time communication (requires Redis)
- **HTTP** - Standard request/response

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

This MCP server enables AI-powered automation and assistance for these insurance operations.
