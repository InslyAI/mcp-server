# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Development**: `pnpm dev` or `npm run dev` - starts Next.js development server
- **Build**: `pnpm build` or `npm run build` - builds the application for production
- **Start**: `pnpm start` or `npm run start` - starts the production server
- **Test client**: `node scripts/test-client.mjs [URL]` - tests the MCP server with a sample client

## Architecture

This is a Next.js application that implements an MCP (Model Context Protocol) server using the `@vercel/mcp-adapter` package.

### Core Components

- **`app/[transport]/route.ts`** - Main MCP server handler that defines tools, prompts, and resources. Uses dynamic routing for different transport methods (SSE, HTTP).
- **MCP Adapter Configuration** - Uses `createMcpHandler` with Redis support for SSE transport and configurable options like `maxDuration` and `verboseLogs`.

### Key Dependencies

- `@vercel/mcp-adapter` - Vercel's adapter for integrating MCP servers with Next.js
- `zod` - Schema validation for tool parameters
- `redis` - Required for SSE transport when deployed

### Transport Support

The server supports multiple transport methods through the `[transport]` dynamic route:
- SSE (Server-Sent Events) - requires Redis for production deployment
- HTTP - standard request/response

### Vercel Deployment Notes

- SSE transport requires `REDIS_URL` environment variable
- Fluid compute should be enabled for efficient execution
- `maxDuration` can be increased to 800 for Pro/Enterprise accounts