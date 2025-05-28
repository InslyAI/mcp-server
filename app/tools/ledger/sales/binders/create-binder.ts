import { createLedgerClient } from "../../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Schema for insurer object
const InsurerSchema = z.object({
  insurer: z.string().describe("Insurer identifier (e.g., 'lloyds')"),
  isLead: z.boolean().describe("Whether this insurer is the lead insurer"),
  grossCommPct: z.number().describe("Gross commission percentage"),
  premiumSharePct: z.number().describe("Premium share percentage"),
  allowCommSacrifice: z.boolean().describe("Whether commission sacrifice is allowed"),
});

// Schema for share object
const ShareSchema = z.object({
  objectType: z.string().describe("Object type (e.g., 'vehicle')"),
  risk: z.string().describe("Risk type (e.g., 'theft')"),
  insurers: z.array(InsurerSchema).describe("Array of insurer configurations"),
});

// Schema for limitation object
const LimitationSchema = z.object({
  path: z.string().describe("JSONPath expression (e.g., '$.policy.country')"),
  values: z.array(z.string()).describe("Array of allowed values"),
});

// Schema for document object
const DocumentSchema = z.object({
  documentType: z.string().describe("Document type (e.g., 'other')"),
  fileUpload: z.boolean().describe("Whether file upload is enabled"),
  file: z.string().optional().describe("File identifier or path"),
});

// Main binder creation schema
const CreateBinderSchema = z.object({
  summary: z.object({
    name: z.string().describe("Binder name"),
    description: z.string().describe("Binder description"),
    umr: z.string().describe("Unique Market Reference"),
    group: z.string().describe("Binder group"),
    underwriter: z.string().describe("Underwriter name"),
  }),
  contractDetails: z.object({
    startDate: z.string().describe("Start date (YYYY-MM-DD format)"),
    endDate: z.string().describe("End date (YYYY-MM-DD format)"),
    product: z.string().describe("Product identifier (e.g., 'insurer-warranty')"),
    status: z.string().describe("Binder status (e.g., 'active')"),
  }),
  shares: z.array(ShareSchema).describe("Array of risk sharing configurations"),
  limitations: z.array(z.array(LimitationSchema)).optional().describe("Array of limitation groups"),
  documents: z.array(z.object({
    documents: z.array(DocumentSchema)
  })).optional().describe("Array of document configurations"),
});

export function registerCreateBinderTools(server: McpServer) {
  server.tool(
    "ledger_sales_binders_create",
    "Create a new sales binder with comprehensive configuration including summary, contract details, shares, limitations, and documents",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      binderData: CreateBinderSchema.describe("Complete binder configuration object"),
    },
    async ({ bearerToken, tenantId, binderData }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const data = await client.post('/api/v1/ledger/sales/binders', binderData);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                binder: data.data || data,
                links: data.links || {},
                message: "Binder created successfully",
              }, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}