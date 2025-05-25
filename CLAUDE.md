# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**insly.ai MCP Server** - Main MCP (Model Context Protocol) server for insly.ai, the AI assistant for insly.com insurance platform. This server provides AI-powered tools and capabilities for insurance operations, featuring:

- **FormFlow integration** (25 tools) - Document processing, AI extraction, form management
- **Identifier service** (3 tools) - Authentication with Insly platform  
- **Ledger service** (1/148 tools implemented) - **MASSIVE TASK**: Business operations covering 148 API endpoints

**CRITICAL IMPLEMENTATION STATUS**: Currently implementing a massive expansion from 28 tools to 176+ total tools with complete Ledger API coverage.

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
- **`app/page.tsx`** - Main landing page with authentic Insly branding, comprehensive tool documentation, and professional design
- **`app/layout.tsx`** - Root layout with SEO optimization, Inter font integration, and Insly metadata
- **`app/globals.css`** - Global styles with exact Insly brand colors, custom CSS classes, and Tailwind integration
- **`app/tools/`** - Modular tool directory where each MCP tool is implemented in separate files
  - `app/tools/index.ts` - Central tool registration
  - `app/tools/formflow/` - FormFlow integration tools (25 tools total)
    - Authentication, submission management, template management, file operations, webhooks, AI features
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
- **`/ledger/[transport]`** - Ledger-only tools (structure ready, tools pending API schemas)  
- **`/[transport]`** - Unified endpoint with all tools (legacy support)

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

### Page Structure
- **Header**: Sticky navigation with real Insly logo and gradient branding
- **Hero Section**: Gradient background with performance statistics
- **Features Grid**: 6 insurance-focused feature cards
- **Tools Showcase**: Organized by categories (25 FormFlow tools)
- **Endpoints**: MCP transport documentation
- **Footer**: Professional footer with platform links

## FormFlow Integration

### Authentication Methods
- **Universal Dual Support**: ALL 25 tools support both credential-based and JWT bearer token authentication
- **Bearer Tokens**: 1-hour validity for enhanced security
- **Rate Limiting**: 60 requests/minute awareness
- **Consistent Implementation**: Every FormFlow tool follows the same authentication pattern

### Tool Categories (25 Total)
- **Authentication**: Token exchange
- **Submissions**: CRUD operations, references, events, file uploads
- **Templates**: Full lifecycle management
- **Files**: Metadata and deletion operations
- **Webhooks**: Event notification management
- **AI Features**: Document processing, metadata generation, workflow processing, reference generation, schema generation

### Deployment Notes

- **Production Ready**: Deployed for insly.ai with professional branding
- **SSE Transport**: Requires `REDIS_URL` environment variable
- **Performance**: Optimized with `maxDuration` set to 800 seconds
- **Static Generation**: Main page optimized for static generation (2.94 kB)
- **SEO Optimized**: Comprehensive metadata and Open Graph tags
