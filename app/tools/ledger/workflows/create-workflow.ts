/**
 * Create Workflow Tool
 * Creates automated business process workflows
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerCreateWorkflowTool(server: McpServer) {
  server.tool(
    "ledger_create_workflow",
    "Create automated business process workflows with triggers, conditions, and actions",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      workflowData: z.object({
        name: z.string().describe("Workflow name"),
        description: z.string().describe("Workflow description"),
        category: z.enum([
          'underwriting',
          'claims_processing',
          'policy_management',
          'renewals',
          'compliance',
          'document_processing',
          'notifications',
          'approvals',
          'data_validation',
          'integrations',
          'custom'
        ]).describe("Workflow category"),
        trigger: z.object({
          type: z.enum(['event', 'schedule', 'manual', 'api_call', 'condition']).describe("Trigger type"),
          eventType: z.string().optional().describe("Event type that triggers workflow (if event trigger)"),
          schedule: z.object({
            frequency: z.enum(['once', 'daily', 'weekly', 'monthly', 'yearly', 'cron']).optional(),
            cronExpression: z.string().optional().describe("Cron expression for custom scheduling"),
            timezone: z.string().optional(),
            startDate: z.string().optional().describe("When to start scheduled execution"),
            endDate: z.string().optional().describe("When to stop scheduled execution")
          }).optional().describe("Schedule configuration (if schedule trigger)"),
          conditions: z.array(z.object({
            field: z.string().describe("Field to evaluate"),
            operator: z.enum(['equals', 'not_equals', 'greater_than', 'less_than', 'contains', 'not_contains', 'exists', 'not_exists']),
            value: z.any().describe("Value to compare against"),
            logicalOperator: z.enum(['AND', 'OR']).optional().describe("Logical operator to combine with next condition")
          })).optional().describe("Trigger conditions")
        }).describe("Workflow trigger configuration"),
        steps: z.array(z.object({
          id: z.string().describe("Unique step identifier"),
          name: z.string().describe("Step name"),
          type: z.enum([
            'approval',
            'notification',
            'data_update',
            'calculation',
            'validation',
            'document_generation',
            'api_call',
            'delay',
            'conditional',
            'loop',
            'parallel',
            'manual_task',
            'script_execution'
          ]).describe("Step type"),
          description: z.string().optional().describe("Step description"),
          configuration: z.object({
            approvalConfig: z.object({
              approvers: z.array(z.string()).optional().describe("User IDs of approvers"),
              approvalType: z.enum(['any', 'all', 'majority']).optional(),
              escalationTime: z.number().optional().describe("Hours before escalation"),
              escalationTo: z.array(z.string()).optional().describe("Escalation recipients")
            }).optional(),
            notificationConfig: z.object({
              templateId: z.string().optional(),
              recipients: z.array(z.string()).optional(),
              channels: z.array(z.string()).optional(),
              priority: z.enum(['low', 'normal', 'high', 'urgent']).optional()
            }).optional(),
            dataUpdateConfig: z.object({
              entityType: z.string().optional(),
              entityId: z.string().optional(),
              fieldUpdates: z.record(z.any()).optional()
            }).optional(),
            calculationConfig: z.object({
              formula: z.string().optional(),
              inputFields: z.array(z.string()).optional(),
              outputField: z.string().optional()
            }).optional(),
            validationConfig: z.object({
              rules: z.array(z.object({
                field: z.string(),
                rule: z.string(),
                errorMessage: z.string()
              })).optional()
            }).optional(),
            documentConfig: z.object({
              templateId: z.string().optional(),
              outputFormat: z.enum(['pdf', 'docx', 'xlsx']).optional(),
              deliveryMethod: z.enum(['email', 'storage', 'download']).optional()
            }).optional(),
            apiCallConfig: z.object({
              url: z.string().optional(),
              method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).optional(),
              headers: z.record(z.string()).optional(),
              payload: z.record(z.any()).optional(),
              expectedResponse: z.any().optional()
            }).optional(),
            delayConfig: z.object({
              duration: z.number().optional().describe("Delay duration in minutes"),
              unit: z.enum(['minutes', 'hours', 'days']).optional()
            }).optional(),
            conditionalConfig: z.object({
              conditions: z.array(z.object({
                field: z.string(),
                operator: z.string(),
                value: z.any()
              })).optional(),
              trueStepId: z.string().optional(),
              falseStepId: z.string().optional()
            }).optional(),
            loopConfig: z.object({
              iterateOver: z.string().optional().describe("Field to iterate over"),
              maxIterations: z.number().optional(),
              loopSteps: z.array(z.string()).optional()
            }).optional(),
            parallelConfig: z.object({
              parallelSteps: z.array(z.string()).optional(),
              waitForAll: z.boolean().optional()
            }).optional(),
            manualTaskConfig: z.object({
              assignedTo: z.array(z.string()).optional(),
              instructions: z.string().optional(),
              dueDate: z.string().optional(),
              priority: z.enum(['low', 'normal', 'high']).optional()
            }).optional(),
            scriptConfig: z.object({
              language: z.enum(['javascript', 'python', 'sql']).optional(),
              script: z.string().optional(),
              timeout: z.number().optional().describe("Script timeout in seconds")
            }).optional()
          }).describe("Step-specific configuration"),
          nextStep: z.string().optional().describe("ID of next step"),
          errorHandling: z.object({
            onError: z.enum(['stop', 'continue', 'retry', 'escalate']).describe("Action on error"),
            retryAttempts: z.number().optional(),
            retryDelay: z.number().optional().describe("Delay between retries in minutes"),
            escalateTo: z.array(z.string()).optional()
          }).optional(),
          timeout: z.number().optional().describe("Step timeout in minutes"),
          required: z.boolean().optional().describe("Whether step is required for workflow completion")
        })).describe("Workflow steps"),
        settings: z.object({
          priority: z.enum(['low', 'normal', 'high', 'critical']).optional().describe("Workflow priority"),
          timeout: z.number().optional().describe("Overall workflow timeout in hours"),
          concurrent: z.boolean().optional().describe("Allow concurrent executions"),
          maxConcurrentExecutions: z.number().optional(),
          retryPolicy: z.object({
            enabled: z.boolean(),
            maxRetries: z.number().optional(),
            retryDelay: z.number().optional()
          }).optional(),
          notifications: z.object({
            onStart: z.boolean().optional(),
            onCompletion: z.boolean().optional(),
            onError: z.boolean().optional(),
            recipients: z.array(z.string()).optional()
          }).optional(),
          auditTrail: z.boolean().optional().describe("Enable detailed audit trail"),
          dataRetention: z.number().optional().describe("Days to retain workflow execution data")
        }).optional().describe("Workflow settings"),
        variables: z.array(z.object({
          name: z.string(),
          type: z.enum(['string', 'number', 'boolean', 'date', 'array', 'object']),
          defaultValue: z.any().optional(),
          required: z.boolean().optional(),
          description: z.string().optional()
        })).optional().describe("Workflow variables"),
        permissions: z.object({
          execute: z.array(z.string()).optional().describe("User IDs allowed to execute"),
          modify: z.array(z.string()).optional().describe("User IDs allowed to modify"),
          view: z.array(z.string()).optional().describe("User IDs allowed to view"),
          public: z.boolean().optional().describe("Whether workflow is publicly visible")
        }).optional().describe("Workflow permissions"),
        tags: z.array(z.string()).optional().describe("Tags for categorization"),
        active: z.boolean().optional().describe("Whether workflow is active")
      }).describe("Workflow configuration"),
    },
    async ({ bearerToken, tenantId, workflowData }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.post(
          `/workflows`,
          workflowData,
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
                workflow: {
                  id: response.id,
                  name: response.name,
                  description: response.description,
                  category: response.category,
                  version: response.version,
                  status: response.status,
                  createdAt: response.createdAt,
                  createdBy: response.createdBy,
                  createdByName: response.createdByName,
                  trigger: response.trigger,
                  stepCount: response.stepCount,
                  settings: response.settings,
                  permissions: response.permissions,
                  tags: response.tags,
                  active: response.active,
                  validationResults: response.validationResults,
                  estimatedExecutionTime: response.estimatedExecutionTime,
                  complexity: response.complexity,
                  dependencies: response.dependencies
                },
                message: "Workflow created successfully"
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
                error: "Failed to create workflow",
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