/**
 * Get High Risk Case Tool
 * Retrieves detailed information about a specific high-risk case
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../client";

export function registerGetHighRiskCaseTool(server: McpServer) {
  server.tool(
    "ledger_sales_high_risk_get",
    "Get detailed information about a specific high-risk case including risk factors and workflow history",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      caseId: z.string().describe("ID of the high-risk case to retrieve"),
      includeHistory: z.boolean().optional().describe("Whether to include workflow history"),
      includeDocuments: z.boolean().optional().describe("Whether to include related documents"),
      includeComments: z.boolean().optional().describe("Whether to include case comments"),
      includeRelatedEntity: z.boolean().optional().describe("Whether to include details of related entity (quote, policy, etc.)"),
    },
    async ({ bearerToken, tenantId, caseId, includeHistory, includeDocuments, includeComments, includeRelatedEntity }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (includeHistory) queryParams.append('include_history', 'true');
        if (includeDocuments) queryParams.append('include_documents', 'true');
        if (includeComments) queryParams.append('include_comments', 'true');
        if (includeRelatedEntity) queryParams.append('include_related_entity', 'true');
        
        const endpoint = `/high-risk-cases/${caseId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await client.get(endpoint);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                highRiskCase: {
                  id: response.id,
                  caseNumber: response.caseNumber,
                  status: response.status,
                  riskLevel: response.riskLevel,
                  riskScore: response.riskScore,
                  relatedEntityType: response.relatedEntityType,
                  relatedEntityId: response.relatedEntityId,
                  riskCategories: response.riskCategories,
                  riskFactors: response.riskFactors,
                  priority: response.priority,
                  assignedTo: response.assignedTo,
                  assignedToName: response.assignedToName,
                  escalationLevel: response.escalationLevel,
                  createdAt: response.createdAt,
                  createdBy: response.createdBy,
                  createdByName: response.createdByName,
                  lastUpdated: response.lastUpdated,
                  reviewDeadline: response.reviewDeadline,
                  detectedBy: response.detectedBy,
                  detectionMethod: response.detectionMethod,
                  workflow: response.workflow,
                  currentStage: response.currentStage,
                  resolution: response.resolution,
                  ...(includeHistory && { history: response.history }),
                  ...(includeDocuments && { documents: response.documents }),
                  ...(includeComments && { comments: response.comments }),
                  ...(includeRelatedEntity && { relatedEntity: response.relatedEntity })
                }
              }, null, 2)
            }
          ]
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: false,
                error: "Failed to retrieve high-risk case",
                details: error.message,
                statusCode: error.status
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}