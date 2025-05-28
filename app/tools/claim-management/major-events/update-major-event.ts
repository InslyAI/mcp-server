import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerUpdateMajorEventToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_major_events_update',
    'Update information for an existing major event',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      majorEvent: z.string().describe('Major event identifier to update'),
      eventName: z.string().optional().describe('Updated event name'),
      description: z.string().optional().describe('Updated event description'),
      status: z.enum(['developing', 'active', 'stabilizing', 'recovery', 'closed']).optional().describe('Updated event status'),
      severityLevel: z.enum(['low', 'medium', 'high', 'critical', 'catastrophic']).optional().describe('Updated severity level'),
      timeframe: z.object({
        endDate: z.string().optional().describe('Updated end date (ISO 8601)'),
        estimatedDuration: z.string().optional().describe('Updated estimated duration')
      }).optional().describe('Updated timeframe information'),
      impactAssessment: z.object({
        estimatedAffectedPopulation: z.number().optional(),
        estimatedPropertyDamage: z.number().optional(),
        estimatedClaimsVolume: z.number().optional(),
        actualClaimsReceived: z.number().optional().describe('Actual number of claims received'),
        riskCategories: z.array(z.string()).optional()
      }).optional().describe('Updated impact assessment'),
      responseTeam: z.object({
        leadAdjuster: z.string().optional(),
        teamMembers: z.array(z.string()).optional(),
        emergencyContacts: z.array(z.object({
          name: z.string(),
          role: z.string(),
          contact: z.string()
        })).optional()
      }).optional().describe('Updated response team'),
      operationalSettings: z.object({
        fastTrackClaims: z.boolean().optional(),
        specialProcedures: z.array(z.string()).optional(),
        communicationPlan: z.string().optional(),
        resourceAllocation: z.string().optional()
      }).optional().describe('Updated operational settings'),
      progressNotes: z.string().optional().describe('Progress notes and updates'),
      lessonLearned: z.string().optional().describe('Lessons learned from the event'),
      tags: z.array(z.string()).optional().describe('Updated tags'),
      priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().describe('Updated priority'),
      updateReason: z.string().optional().describe('Reason for the update'),
      metadata: z.record(z.any()).optional().describe('Updated metadata')
    },
    async ({ bearerToken, tenantId, majorEvent, ...updateData }: any) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.put(`/api/v1/claim-management/major-events/${majorEvent}`, updateData);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Major event updated successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to update major event',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
