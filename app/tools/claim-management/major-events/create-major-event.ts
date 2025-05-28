import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerCreateMajorEventToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_major_events_create',
    'Create a new major event (catastrophe, natural disaster, large-scale incident)',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      eventName: z.string().describe('Name of the major event'),
      eventType: z.string().describe('Type of event (e.g., "hurricane", "earthquake", "flood", "wildfire", "terrorist_attack")'),
      description: z.string().describe('Detailed description of the event'),
      location: z.object({
        country: z.string().optional(),
        region: z.string().optional(),
        city: z.string().optional(),
        coordinates: z.object({
          latitude: z.number().optional(),
          longitude: z.number().optional()
        }).optional(),
        affectedAreas: z.array(z.string()).optional().describe('List of affected areas/zones')
      }).describe('Location information for the event'),
      timeframe: z.object({
        startDate: z.string().describe('Event start date (ISO 8601)'),
        endDate: z.string().optional().describe('Event end date (ISO 8601)'),
        estimatedDuration: z.string().optional().describe('Estimated duration if ongoing')
      }).describe('Event timeframe'),
      severityLevel: z.enum(['low', 'medium', 'high', 'critical', 'catastrophic']).describe('Severity level of the event'),
      status: z.enum(['developing', 'active', 'stabilizing', 'recovery', 'closed']).describe('Current status of the event'),
      impactAssessment: z.object({
        estimatedAffectedPopulation: z.number().optional().describe('Number of people affected'),
        estimatedPropertyDamage: z.number().optional().describe('Estimated property damage amount'),
        estimatedClaimsVolume: z.number().optional().describe('Expected number of claims'),
        riskCategories: z.array(z.string()).optional().describe('Risk categories affected (motor, property, life, etc.)')
      }).optional().describe('Impact assessment details'),
      responseTeam: z.object({
        leadAdjuster: z.string().optional().describe('Lead adjuster assigned'),
        teamMembers: z.array(z.string()).optional().describe('Response team member IDs'),
        emergencyContacts: z.array(z.object({
          name: z.string(),
          role: z.string(),
          contact: z.string()
        })).optional().describe('Emergency contact information')
      }).optional().describe('Response team assignment'),
      operationalSettings: z.object({
        fastTrackClaims: z.boolean().optional().describe('Enable fast-track claim processing'),
        specialProcedures: z.array(z.string()).optional().describe('Special procedures to apply'),
        communicationPlan: z.string().optional().describe('Communication plan for affected customers'),
        resourceAllocation: z.string().optional().describe('Resource allocation strategy')
      }).optional().describe('Operational settings for handling the event'),
      externalReferences: z.object({
        governmentId: z.string().optional().describe('Government/official event ID'),
        mediaReferences: z.array(z.string()).optional().describe('Media coverage references'),
        officialDeclarations: z.array(z.string()).optional().describe('Official disaster declarations')
      }).optional().describe('External references and declarations'),
      tags: z.array(z.string()).optional().describe('Tags for categorization'),
      priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().describe('Priority level'),
      metadata: z.record(z.any()).optional().describe('Additional metadata')
    },
    async ({ bearerToken, tenantId, ...eventData }: any) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.post('/api/v1/claim-management/major-events', eventData);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Major event created successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to create major event',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
