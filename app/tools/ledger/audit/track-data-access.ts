/**
 * Track Data Access Tool
 * Tracks and monitors data access patterns for compliance
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerTrackDataAccessTool(server: McpServer) {
  server.tool(
    "ledger_track_data_access",
    "Track and monitor data access patterns for compliance, privacy, and security monitoring",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      trackingConfig: z.object({
        userId: z.string().optional().describe("Specific user ID to track (optional for system-wide tracking)"),
        dataCategory: z.enum(['pii', 'financial', 'medical', 'sensitive', 'confidential', 'all']).describe("Category of data to track"),
        accessType: z.enum(['read', 'write', 'delete', 'export', 'share', 'all']).describe("Type of access to track"),
        entityTypes: z.array(z.enum(['policy', 'claim', 'quote', 'user', 'binder', 'endorsement', 'document'])).optional().describe("Entity types to track"),
        timeframe: z.object({
          startDate: z.string().describe("Start date for tracking period (ISO date)"),
          endDate: z.string().describe("End date for tracking period (ISO date)")
        }).describe("Time period to analyze"),
        analysisType: z.enum(['real_time', 'batch', 'scheduled']).describe("Type of analysis to perform"),
        alertThresholds: z.object({
          unusualVolumeThreshold: z.number().optional().describe("Threshold for unusual access volume"),
          sensitiveDataAccessLimit: z.number().optional().describe("Limit for sensitive data access"),
          offHoursAccessAlert: z.boolean().optional().describe("Alert for off-hours access"),
          multipleFailedAttemptsThreshold: z.number().optional().describe("Threshold for failed access attempts"),
          geographicalAnomalyDetection: z.boolean().optional().describe("Enable geographical anomaly detection")
        }).optional().describe("Alert threshold configuration"),
        complianceFrameworks: z.array(z.enum(['gdpr', 'hipaa', 'pci_dss', 'sox', 'ccpa', 'lgpd'])).optional().describe("Compliance frameworks to check against"),
        includeMetadata: z.boolean().optional().describe("Whether to include detailed metadata"),
        anonymizeResults: z.boolean().optional().describe("Whether to anonymize user data in results"),
        generateAlerts: z.boolean().optional().describe("Whether to generate alerts for anomalies"),
        customRules: z.array(z.object({
          ruleName: z.string(),
          condition: z.string().describe("Rule condition expression"),
          severity: z.enum(['low', 'medium', 'high', 'critical']),
          action: z.enum(['log', 'alert', 'block'])
        })).optional().describe("Custom tracking rules")
      }).describe("Data access tracking configuration"),
    },
    async ({ bearerToken, tenantId, trackingConfig }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.post(
          `/audit/data-access-tracking`,
          trackingConfig,
          {
            "Accept-Language": "en"
          }
        );

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                dataAccessTracking: {
                  trackingId: response.trackingId,
                  status: response.status,
                  analysisType: response.analysisType,
                  timeframe: response.timeframe,
                  summary: {
                    totalAccesses: response.summary.totalAccesses,
                    uniqueUsers: response.summary.uniqueUsers,
                    dataVolume: response.summary.dataVolume,
                    sensitiveDataAccesses: response.summary.sensitiveDataAccesses,
                    anomaliesDetected: response.summary.anomaliesDetected,
                    complianceViolations: response.summary.complianceViolations
                  },
                  accessPatterns: response.accessPatterns.map((pattern: any) => ({
                    userId: pattern.userId,
                    userName: pattern.userName,
                    entityType: pattern.entityType,
                    accessType: pattern.accessType,
                    frequency: pattern.frequency,
                    lastAccess: pattern.lastAccess,
                    dataCategories: pattern.dataCategories,
                    riskScore: pattern.riskScore,
                    complianceStatus: pattern.complianceStatus
                  })),
                  anomalies: response.anomalies.map((anomaly: any) => ({
                    id: anomaly.id,
                    type: anomaly.type,
                    severity: anomaly.severity,
                    description: anomaly.description,
                    userId: anomaly.userId,
                    timestamp: anomaly.timestamp,
                    entityType: anomaly.entityType,
                    dataCategory: anomaly.dataCategory,
                    riskLevel: anomaly.riskLevel,
                    recommendedAction: anomaly.recommendedAction
                  })),
                  complianceStatus: {
                    gdprCompliance: response.complianceStatus.gdprCompliance,
                    hipaaCompliance: response.complianceStatus.hipaaCompliance,
                    pciCompliance: response.complianceStatus.pciCompliance,
                    overallRating: response.complianceStatus.overallRating,
                    violations: response.complianceStatus.violations,
                    recommendations: response.complianceStatus.recommendations
                  },
                  alerts: response.alerts,
                  generatedAt: response.generatedAt,
                  expiresAt: response.expiresAt,
                  downloadUrl: response.downloadUrl
                },
                message: "Data access tracking analysis completed successfully"
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
                error: "Failed to track data access",
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