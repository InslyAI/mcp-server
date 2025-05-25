/**
 * Execute Workflow Tool
 * Manually executes a workflow with optional parameters
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerExecuteWorkflowTool(server: McpServer) {
  server.tool(
    "ledger_execute_workflow",
    "Manually execute a workflow with optional parameters and real-time monitoring",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      workflowId: z.string().describe("ID of the workflow to execute"),
      executionConfig: z.object({
        variables: z.record(z.any()).optional().describe("Input variables for workflow execution"),
        contextData: z.object({
          entityType: z.string().optional().describe("Type of entity this execution relates to"),
          entityId: z.string().optional().describe("ID of the entity this execution relates to"),
          triggeredBy: z.string().optional().describe("User ID who triggered the execution"),
          triggerReason: z.string().optional().describe("Reason for manual execution"),
          priority: z.enum(['low', 'normal', 'high', 'urgent']).optional().describe("Execution priority override"),
          customData: z.record(z.any()).optional().describe("Custom context data")
        }).optional().describe("Execution context information"),
        options: z.object({
          async: z.boolean().optional().describe("Whether to execute asynchronously (default: true)"),
          timeout: z.number().optional().describe("Execution timeout in minutes"),
          skipSteps: z.array(z.string()).optional().describe("Step IDs to skip during execution"),
          startFromStep: z.string().optional().describe("Step ID to start execution from"),
          dryRun: z.boolean().optional().describe("Perform a dry run without making actual changes"),
          debugMode: z.boolean().optional().describe("Enable detailed debug logging"),
          notifyOnCompletion: z.boolean().optional().describe("Send notification when execution completes"),
          notificationRecipients: z.array(z.string()).optional().describe("Recipients for completion notification"),
          retryFailedSteps: z.boolean().optional().describe("Automatically retry failed steps"),
          continueOnError: z.boolean().optional().describe("Continue execution even if non-critical steps fail"),
          auditLevel: z.enum(['basic', 'detailed', 'comprehensive']).optional().describe("Level of audit logging")
        }).optional().describe("Execution options"),
        scheduling: z.object({
          executeImmediately: z.boolean().optional().describe("Execute immediately (default: true)"),
          scheduledFor: z.string().optional().describe("Schedule execution for specific time (ISO date)"),
          timezone: z.string().optional().describe("Timezone for scheduled execution"),
          recurrence: z.object({
            pattern: z.enum(['daily', 'weekly', 'monthly', 'custom']).describe("Recurrence pattern"),
            interval: z.number().optional().describe("Interval for custom recurrence"),
            endDate: z.string().optional().describe("End date for recurring executions")
          }).optional().describe("Recurrence configuration for scheduled executions")
        }).optional().describe("Execution scheduling"),
        approvals: z.object({
          requireApproval: z.boolean().optional().describe("Whether execution requires approval"),
          approvers: z.array(z.string()).optional().describe("User IDs of required approvers"),
          approvalMessage: z.string().optional().describe("Message for approval request"),
          autoApprove: z.boolean().optional().describe("Auto-approve if requester has permissions")
        }).optional().describe("Approval requirements"),
        dependencies: z.object({
          waitForWorkflows: z.array(z.string()).optional().describe("Workflow IDs to wait for completion"),
          requiredData: z.array(z.object({
            source: z.string().describe("Data source identifier"),
            requirement: z.string().describe("Required data condition")
          })).optional().describe("Required data conditions"),
          externalServices: z.array(z.string()).optional().describe("External services that must be available")
        }).optional().describe("Execution dependencies")
      }).optional().describe("Workflow execution configuration"),
    },
    async ({ bearerToken, tenantId, workflowId, executionConfig }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const payload = {
          workflowId,
          ...(executionConfig && executionConfig)
        };
        
        const response = await client.post(
          `/workflows/${workflowId}/execute`,
          payload,
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
                execution: {
                  executionId: response.executionId,
                  workflowId: response.workflowId,
                  workflowName: response.workflowName,
                  status: response.status,
                  priority: response.priority,
                  startedAt: response.startedAt,
                  estimatedCompletionTime: response.estimatedCompletionTime,
                  executedBy: response.executedBy,
                  executedByName: response.executedByName,
                  triggerReason: response.triggerReason,
                  async: response.async,
                  dryRun: response.dryRun,
                  debugMode: response.debugMode,
                  contextData: response.contextData,
                  currentStep: {
                    stepId: response.currentStep.stepId,
                    stepName: response.currentStep.stepName,
                    stepType: response.currentStep.stepType,
                    status: response.currentStep.status,
                    startedAt: response.currentStep.startedAt
                  },
                  progress: {
                    totalSteps: response.progress.totalSteps,
                    completedSteps: response.progress.completedSteps,
                    failedSteps: response.progress.failedSteps,
                    skippedSteps: response.progress.skippedSteps,
                    percentComplete: response.progress.percentComplete
                  },
                  variables: response.variables,
                  logs: response.logs.map((log: any) => ({
                    timestamp: log.timestamp,
                    level: log.level,
                    stepId: log.stepId,
                    message: log.message,
                    data: log.data
                  })),
                  ...(response.scheduledFor && {
                    scheduled: {
                      scheduledFor: response.scheduledFor,
                      timezone: response.timezone,
                      recurrence: response.recurrence
                    }
                  }),
                  ...(response.approvalRequired && {
                    approval: {
                      required: response.approvalRequired,
                      approvers: response.approvers,
                      approvalRequestId: response.approvalRequestId,
                      status: response.approvalStatus
                    }
                  }),
                  monitoringUrl: response.monitoringUrl,
                  auditTrailId: response.auditTrailId
                },
                message: response.async 
                  ? "Workflow execution started successfully" 
                  : "Workflow execution completed successfully"
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
                error: "Failed to execute workflow",
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