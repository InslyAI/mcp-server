import { createLedgerClient } from "../../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Reuse the same schemas from create-binder.ts
const InsurerSchema = z.object({
  insurer: z.string().describe("Insurer identifier (e.g., 'lloyds')"),
  isLead: z.boolean().describe("Whether this insurer is the lead insurer"),
  grossCommPct: z.number().describe("Gross commission percentage"),
  premiumSharePct: z.number().describe("Premium share percentage"),
  allowCommSacrifice: z.boolean().describe("Whether commission sacrifice is allowed"),
});

const ShareSchema = z.object({
  objectType: z.string().describe("Object type (e.g., 'vehicle')"),
  risk: z.string().describe("Risk type (e.g., 'theft')"),
  insurers: z.array(InsurerSchema).describe("Array of insurer configurations"),
});

const LimitationSchema = z.object({
  path: z.string().describe("JSONPath expression (e.g., '$.policy.country')"),
  values: z.array(z.string()).describe("Array of allowed values"),
});

const DocumentSchema = z.object({
  documentType: z.string().describe("Document type (e.g., 'other')"),
  fileUpload: z.boolean().describe("Whether file upload is enabled"),
  file: z.string().optional().describe("File identifier or path"),
});

// Update schema - same as create but all fields are optional for partial updates
const UpdateBinderSchema = z.object({
  summary: z.object({
    name: z.string().optional().describe("Binder name"),
    description: z.string().optional().describe("Binder description"),
    umr: z.string().optional().describe("Unique Market Reference"),
    group: z.string().optional().describe("Binder group"),
    underwriter: z.string().optional().describe("Underwriter name"),
  }).optional(),
  contractDetails: z.object({
    startDate: z.string().optional().describe("Start date (YYYY-MM-DD format)"),
    endDate: z.string().optional().describe("End date (YYYY-MM-DD format)"),
    product: z.string().optional().describe("Product identifier (e.g., 'insurer-warranty')"),
    status: z.string().optional().describe("Binder status (e.g., 'active')"),
  }).optional(),
  shares: z.array(ShareSchema).optional().describe("Array of risk sharing configurations"),
  limitations: z.array(z.array(LimitationSchema)).optional().describe("Array of limitation groups"),
  documents: z.array(z.object({
    documents: z.array(DocumentSchema)
  })).optional().describe("Array of document configurations"),
});

export function registerUpdateBinderTools(server: McpServer) {
  server.tool(
    "ledger_sales_binders_update",
    "Update an existing binder with new configuration. Only provided fields will be updated (partial update supported)",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      binderId: z.number().int().positive().describe("Unique identifier of the binder to update"),
      binderData: UpdateBinderSchema.describe("Binder fields to update (partial updates supported)"),
    },
    async ({ bearerToken, tenantId, binderId, binderData }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const data = await client.put(`/api/v1/ledger/sales/binders/${binderId}`, binderData);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                binder: data.data || data,
                links: data.links || {},
                message: `Binder ${binderId} updated successfully`,
                meta: {
                  binderId,
                  updatedAt: new Date().toISOString(),
                  fieldsUpdated: Object.keys(binderData),
                }
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