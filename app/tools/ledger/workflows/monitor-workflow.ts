/**
 * Monitor Workflow Tool
 * Monitors workflow execution status and performance
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerMonitorWorkflowTool(server: McpServer) {
  server.tool(
    "ledger_monitor_workflow",
    "Monitor workflow execution status, performance metrics, and real-time progress tracking",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      monitoringTarget: z.object({
        type: z.enum(['execution', 'workflow', 'system']).describe("Type of monitoring target"),
        executionId: z.string().optional().describe("Specific execution ID to monitor"),
        workflowId: z.string().optional().describe("Specific workflow ID to monitor"),
        timeframe: z.object({
          startDate: z.string().optional().describe("Start date for monitoring period (ISO date)"),
          endDate: z.string().optional().describe("End date for monitoring period (ISO date)"),
          duration: z.enum(['1h', '6h', '24h', '7d', '30d', 'custom']).optional().describe("Predefined monitoring duration")
        }).optional().describe("Time frame for monitoring")
      }).describe("Monitoring target configuration"),
      monitoringOptions: z.object({
        includeStepDetails: z.boolean().optional().describe("Include detailed step-by-step information"),
        includeLogs: z.boolean().optional().describe("Include execution logs"),
        includeMetrics: z.boolean().optional().describe("Include performance metrics"),
        includeErrors: z.boolean().optional().describe("Include error details and stack traces"),
        includeResourceUsage: z.boolean().optional().describe("Include system resource usage"),
        includeUserActivity: z.boolean().optional().describe("Include user interaction tracking"),
        realTimeUpdates: z.boolean().optional().describe("Enable real-time status updates"),
        alertThresholds: z.object({
          executionTime: z.number().optional().describe("Alert if execution exceeds minutes"),
          errorRate: z.number().optional().describe("Alert if error rate exceeds percentage"),
          resourceUsage: z.number().optional().describe("Alert if resource usage exceeds percentage"),
          queueDepth: z.number().optional().describe("Alert if queue depth exceeds number")
        }).optional().describe("Alert threshold configuration")
      }).optional().describe("Monitoring configuration options"),
      reportingOptions: z.object({
        format: z.enum(['summary', 'detailed', 'dashboard', 'raw']).optional().describe("Report format"),
        aggregation: z.enum(['none', 'hourly', 'daily', 'weekly']).optional().describe("Data aggregation level"),
        includeCharts: z.boolean().optional().describe("Include visual charts and graphs"),
        includeComparisons: z.boolean().optional().describe("Include historical comparisons"),
        exportFormat: z.enum(['json', 'csv', 'pdf', 'excel']).optional().describe("Export format for reports"),
        recipients: z.array(z.string()).optional().describe("Email recipients for monitoring reports"),
        scheduledReports: z.object({
          enabled: z.boolean().optional(),
          frequency: z.enum(['hourly', 'daily', 'weekly', 'monthly']).optional(),
          recipients: z.array(z.string()).optional()
        }).optional().describe("Scheduled reporting configuration")
      }).optional().describe("Reporting options"),
    },
    async ({ bearerToken, tenantId, monitoringTarget, monitoringOptions, reportingOptions }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const payload = {
          monitoringTarget,
          ...(monitoringOptions && { options: monitoringOptions }),
          ...(reportingOptions && { reporting: reportingOptions })
        };
        
        const response = await client.post(
          `/workflows/monitor`,
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
                monitoring: {
                  monitoringId: response.monitoringId,
                  targetType: response.targetType,
                  status: response.status,
                  startedAt: response.startedAt,
                  lastUpdated: response.lastUpdated,
                  ...(monitoringTarget.type === 'execution' && {
                    execution: {
                      executionId: response.execution.executionId,
                      workflowId: response.execution.workflowId,
                      workflowName: response.execution.workflowName,
                      status: response.execution.status,
                      startedAt: response.execution.startedAt,
                      completedAt: response.execution.completedAt,
                      duration: response.execution.duration,
                      progress: {
                        totalSteps: response.execution.progress.totalSteps,
                        completedSteps: response.execution.progress.completedSteps,
                        currentStep: response.execution.progress.currentStep,
                        percentComplete: response.execution.progress.percentComplete
                      },
                      performance: {
                        averageStepTime: response.execution.performance.averageStepTime,
                        slowestStep: response.execution.performance.slowestStep,
                        fastestStep: response.execution.performance.fastestStep,
                        resourceUsage: response.execution.performance.resourceUsage
                      },
                      ...(monitoringOptions?.includeStepDetails && {
                        steps: response.execution.steps.map((step: any) => ({
                          stepId: step.stepId,
                          stepName: step.stepName,
                          status: step.status,
                          startedAt: step.startedAt,
                          completedAt: step.completedAt,
                          duration: step.duration,
                          output: step.output,
                          error: step.error
                        }))
                      }),
                      ...(monitoringOptions?.includeLogs && {
                        logs: response.execution.logs
                      }),
                      ...(monitoringOptions?.includeErrors && {
                        errors: response.execution.errors
                      })
                    }
                  }),
                  ...(monitoringTarget.type === 'workflow' && {
                    workflow: {
                      workflowId: response.workflow.workflowId,
                      workflowName: response.workflow.workflowName,
                      statistics: {
                        totalExecutions: response.workflow.statistics.totalExecutions,
                        successfulExecutions: response.workflow.statistics.successfulExecutions,
                        failedExecutions: response.workflow.statistics.failedExecutions,
                        successRate: response.workflow.statistics.successRate,
                        averageExecutionTime: response.workflow.statistics.averageExecutionTime,
                        currentlyRunning: response.workflow.statistics.currentlyRunning,
                        queuedExecutions: response.workflow.statistics.queuedExecutions
                      },
                      performance: {
                        peakExecutionsPerHour: response.workflow.performance.peakExecutionsPerHour,
                        averageExecutionsPerDay: response.workflow.performance.averageExecutionsPerDay,
                        resourceUtilization: response.workflow.performance.resourceUtilization,
                        bottleneckSteps: response.workflow.performance.bottleneckSteps
                      },
                      healthStatus: {
                        overall: response.workflow.healthStatus.overall,
                        availability: response.workflow.healthStatus.availability,
                        reliability: response.workflow.healthStatus.reliability,
                        performance: response.workflow.healthStatus.performance,
                        lastHealthCheck: response.workflow.healthStatus.lastHealthCheck
                      }
                    }
                  }),
                  ...(monitoringTarget.type === 'system' && {
                    system: {
                      overview: {
                        totalWorkflows: response.system.overview.totalWorkflows,
                        activeWorkflows: response.system.overview.activeWorkflows,
                        totalExecutions: response.system.overview.totalExecutions,
                        currentlyRunning: response.system.overview.currentlyRunning,
                        queuedExecutions: response.system.overview.queuedExecutions,
                        systemLoad: response.system.overview.systemLoad
                      },
                      performance: {
                        throughput: response.system.performance.throughput,
                        averageResponseTime: response.system.performance.averageResponseTime,
                        errorRate: response.system.performance.errorRate,
                        resourceUtilization: response.system.performance.resourceUtilization
                      },
                      alerts: response.system.alerts.map((alert: any) => ({
                        id: alert.id,
                        type: alert.type,
                        severity: alert.severity,
                        message: alert.message,
                        timestamp: alert.timestamp,
                        resolved: alert.resolved
                      }))
                    }
                  }),
                  ...(monitoringOptions?.includeMetrics && {
                    metrics: {
                      executionMetrics: response.metrics.executionMetrics,
                      performanceMetrics: response.metrics.performanceMetrics,
                      resourceMetrics: response.metrics.resourceMetrics,
                      businessMetrics: response.metrics.businessMetrics
                    }
                  }),
                  alerts: response.alerts,
                  recommendations: response.recommendations,
                  dashboardUrl: response.dashboardUrl,
                  realTimeUrl: response.realTimeUrl,
                  exportUrl: response.exportUrl
                },
                message: "Workflow monitoring data retrieved successfully"
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
                error: "Failed to retrieve workflow monitoring data",
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