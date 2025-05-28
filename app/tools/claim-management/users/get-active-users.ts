import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerGetActiveUsersToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_users_get_active_users',
    'Get list of active users in the claim management system',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      
      // User Status Filters
      includeOnline: z.boolean().optional().describe('Include currently online users'),
      includeOffline: z.boolean().optional().describe('Include offline but active users'),
      activityThresholdDays: z.number().optional().describe('Days threshold for considering user as active (default: 30)'),
      
      // Role and Permission Filters
      roles: z.array(z.string()).optional().describe('Filter by user roles (adjuster, supervisor, manager, etc.)'),
      permissions: z.array(z.string()).optional().describe('Filter by specific permissions'),
      department: z.array(z.string()).optional().describe('Filter by department'),
      team: z.array(z.string()).optional().describe('Filter by team assignment'),
      
      // Geographic and Office Filters
      office: z.array(z.string()).optional().describe('Filter by office location'),
      region: z.array(z.string()).optional().describe('Filter by geographic region'),
      timeZone: z.array(z.string()).optional().describe('Filter by time zone'),
      
      // Activity Filters
      lastLoginFrom: z.string().optional().describe('Users who logged in from this date (YYYY-MM-DD)'),
      lastLoginTo: z.string().optional().describe('Users who logged in to this date (YYYY-MM-DD)'),
      lastActivityFrom: z.string().optional().describe('Users with activity from this date (YYYY-MM-DD)'),
      minimumLogins: z.number().optional().describe('Minimum number of logins in the activity period'),
      
      // Workload and Assignment Filters
      availableForAssignment: z.boolean().optional().describe('Only users available for new assignments'),
      currentWorkloadMax: z.number().optional().describe('Maximum current workload (number of active claims)'),
      capacityMin: z.number().optional().describe('Minimum capacity percentage available'),
      
      // Skill and Specialization Filters
      skills: z.array(z.string()).optional().describe('Filter by user skills or specializations'),
      certifications: z.array(z.string()).optional().describe('Filter by professional certifications'),
      experienceLevel: z.array(z.string()).optional().describe('Filter by experience level (junior, senior, expert)'),
      
      // License and Compliance Filters
      licenseStatus: z.enum(['active', 'expired', 'pending', 'suspended']).optional().describe('Filter by license status'),
      licenseState: z.array(z.string()).optional().describe('Filter by states where user is licensed'),
      complianceStatus: z.enum(['compliant', 'non-compliant', 'pending-review']).optional().describe('Filter by compliance status'),
      
      // Employment Status
      employmentType: z.array(z.enum(['full-time', 'part-time', 'contractor', 'temporary'])).optional().describe('Filter by employment type'),
      isOnVacation: z.boolean().optional().describe('Filter users currently on vacation'),
      
      // Sorting Options
      sortBy: z.enum(['name', 'lastLogin', 'lastActivity', 'workload', 'role', 'department']).optional().describe('Sort field (default: name)'),
      sortOrder: z.enum(['asc', 'desc']).optional().describe('Sort order (default: asc)'),
      
      // Pagination
      limit: z.number().optional().describe('Number of users to return (default: 100, max: 500)'),
      offset: z.number().optional().describe('Offset for pagination'),
      
      // Include Options
      includeContactInfo: z.boolean().optional().describe('Include contact information'),
      includeWorkloadInfo: z.boolean().optional().describe('Include current workload details'),
      includeSkillsInfo: z.boolean().optional().describe('Include skills and certifications'),
      includeLicenseInfo: z.boolean().optional().describe('Include licensing information'),
      includeActivityMetrics: z.boolean().optional().describe('Include activity metrics and statistics'),
      includeAvailability: z.boolean().optional().describe('Include availability and schedule information'),
      
      // Performance Metrics
      includePerformanceMetrics: z.boolean().optional().describe('Include performance metrics'),
      performancePeriodDays: z.number().optional().describe('Number of days for performance metrics calculation'),
      
      // Search and Matching
      searchQuery: z.string().optional().describe('Search users by name, email, or ID'),
      exactMatch: z.boolean().optional().describe('Require exact match for search query'),
      
      // Output Format
      format: z.enum(['detailed', 'summary', 'minimal']).optional().describe('Level of detail in response'),
      includeStatistics: z.boolean().optional().describe('Include summary statistics'),
      
      // Real-time Status
      includeOnlineStatus: z.boolean().optional().describe('Include real-time online status'),
      includeCurrentActivity: z.boolean().optional().describe('Include current activity information')
    },
    async ({ bearerToken, tenantId, ...params }) => {
      try {
        const queryParams = new URLSearchParams();
        
        // Add query parameters
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(item => queryParams.append(key, item.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
        
        const response = await fetch(`/api/v1/claim-management/active-users?${queryParams.toString()}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
            'X-Tenant-ID': tenantId
          }
        });

        if (!response.ok) {
          const errorData = await response.text();
          return {
            content: [{
              type: 'text' as const,
              text: `Error getting active users: ${response.status} ${response.statusText} - ${errorData}`
            }]
          };
        }

        const result = await response.json();
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              data: result,
              message: `Retrieved ${result.users?.length || result.totalCount || 0} active users`,
              metadata: {
                totalUsers: result.totalCount,
                onlineUsers: result.summary?.onlineUsers,
                availableForAssignment: result.summary?.availableForAssignment,
                averageWorkload: result.summary?.averageWorkload,
                departmentCounts: result.summary?.departmentCounts
              }
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text' as const,
            text: `Error getting active users: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
