Please commit and push. # CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**insly.ai MCP Server** - Main MCP (Model Context Protocol) server for insly.ai, the AI assistant for insly.com insurance platform. This server provides AI-powered tools and capabilities for insurance operations.

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
- **`app/tools/`** - Modular tool directory where each MCP tool is implemented in separate files
  - `app/tools/index.ts` - Central tool registration
  - `app/tools/echo.ts` - Echo test tool
  - `app/tools/calculator.ts` - Calculator test tool
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

### Transport Support

The server supports multiple transport methods through the `[transport]` dynamic route:

- SSE (Server-Sent Events) - requires Redis for production deployment
- HTTP - standard request/response

### Vercel Deployment Notes

- Already deployed on Vercel for insly.ai
- SSE transport requires `REDIS_URL` environment variable
- Fluid compute should be enabled for efficient execution
- `maxDuration` set to 800 for optimal performance
