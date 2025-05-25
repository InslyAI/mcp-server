/**
 * Ledger MCP Endpoint
 * 
 * Note: This endpoint is prepared but tools are not yet implemented.
 * Once Ledger API schemas are available, tools will be added to the capabilities.
 */

import { createMcpHandler } from "@vercel/mcp-adapter";
import { registerLedgerTools } from "../../tools/ledger";

const handler = createMcpHandler(
  (server) => {
    registerLedgerTools(server);
  },
  {
    capabilities: {
      tools: {
        ledger_list_binder_names: {
          description: "Get list of binder names and IDs for dropdown/selection purposes",
        },
        ledger_list_binders: {
          description: "Get paginated list of binders with full details and filtering options",
        },
        ledger_create_binder: {
          description: "Create a new binder with comprehensive configuration",
        },
        ledger_get_binder: {
          description: "Get detailed information about a specific binder by ID",
        },
        ledger_update_binder: {
          description: "Update an existing binder with new configuration",
        },
        ledger_renew_binder: {
          description: "Renew an existing binder for the next period",
        },
        ledger_get_binder_groups: {
          description: "Get list of available binder groups/categories",
        },
        ledger_search_policies: {
          description: "Search for policies using various filters and search terms",
        },
        ledger_get_policy: {
          description: "Get detailed information about a specific policy by ID",
        },
        ledger_get_policy_history: {
          description: "Get the complete change history for a specific policy",
        },
        ledger_terminate_policy: {
          description: "Terminate an existing policy with specified termination type",
        },
        ledger_renew_policy: {
          description: "Prepare data for policy renewal by creating a renewal quote",
        },
        ledger_get_policy_broker_events: {
          description: "Get list of policy events for a specific broker within a date range",
        },
        ledger_create_quote: {
          description: "Create a new insurance quote using a specific product schema",
        },
        ledger_get_quote: {
          description: "Get detailed information about a specific quote by ID",
        },
        ledger_update_quote: {
          description: "Update an existing quote with new data according to the product schema",
        },
        ledger_calculate_quote: {
          description: "Calculate premiums and pricing for a quote",
        },
        ledger_issue_quote: {
          description: "Issue a quote to convert it into a policy",
        },
        ledger_copy_quote: {
          description: "Create a copy of an existing quote",
        },
        ledger_get_schema: {
          description: "Get JSON schema structure for a specific product type",
        },
        ledger_get_renewal_schema: {
          description: "Get JSON schema structure specifically for renewal quotes",
        },
        ledger_get_schema_ui: {
          description: "Get UI schema for form rendering of renewal quotes",
        },
        ledger_get_feature_schema: {
          description: "Get JSON schema structure for a specific product feature",
        },
        ledger_get_feature_ui_schema: {
          description: "Get UI schema for form rendering of a specific product feature",
        },
        ledger_upload_calculator: {
          description: "Upload an Excel calculator file for premium calculations",
        },
        ledger_get_document_types: {
          description: "Get list of available document types for a specific policy",
        },
        ledger_generate_policy_document: {
          description: "Generate a policy document of a specific type",
        },
        ledger_generate_quote_document: {
          description: "Generate the main quote document or a specific document type",
        },
        ledger_upload_policy_files: {
          description: "Upload one or more files to a policy as supporting documents",
        },
        ledger_upload_quote_files: {
          description: "Upload one or more files to a quote as supporting documents",
        },
        ledger_get_quotes_in_referral: {
          description: "Get dashboard data for quotes currently in referral status awaiting underwriter review",
        },
        ledger_get_quotes_renewal: {
          description: "Get dashboard data for renewal quotes that are due but not yet issued",
        },
        ledger_get_renewal_products: {
          description: "Get list of products that can be renewed as quotes",
        },
        ledger_get_policies_renewal: {
          description: "Get dashboard data for policies eligible for renewal",
        },
        ledger_get_policies_renewal_products: {
          description: "Get list of products that can be renewed as policies",
        },
        ledger_create_endorsement: {
          description: "Create a new policy endorsement for modifying an existing policy",
        },
        ledger_get_endorsement: {
          description: "Get detailed information about a specific policy endorsement",
        },
        ledger_update_endorsement: {
          description: "Update an existing policy endorsement with new data or changes",
        },
        ledger_calculate_endorsement: {
          description: "Calculate premium adjustments and pricing impact for a policy endorsement",
        },
        ledger_issue_endorsement: {
          description: "Issue an approved endorsement to officially apply the changes to the policy",
        },
        ledger_list_endorsements: {
          description: "Get paginated list of policy endorsements with filtering and search options",
        },
        ledger_create_e_proposal: {
          description: "Create a new electronic proposal for streamlined underwriting and approval workflow",
        },
        ledger_get_e_proposal: {
          description: "Get detailed information about a specific electronic proposal including status and workflow",
        },
        ledger_update_e_proposal: {
          description: "Update an existing electronic proposal with new data, corrections, or additional information",
        },
        ledger_submit_e_proposal: {
          description: "Submit an electronic proposal for underwriting review and approval workflow",
        },
        ledger_approve_e_proposal: {
          description: "Approve or reject an electronic proposal after underwriting review with decision details",
        },
        ledger_list_e_proposals: {
          description: "Get paginated list of electronic proposals with filtering and search options",
        },
        ledger_list_high_risk_cases: {
          description: "Get paginated list of high-risk cases requiring special underwriting attention and management",
        },
        ledger_create_high_risk_case: {
          description: "Create a new high-risk case requiring special underwriting attention and management",
        },
        ledger_get_high_risk_case: {
          description: "Get detailed information about a specific high-risk case including risk factors and workflow history",
        },
        ledger_update_high_risk_case: {
          description: "Update an existing high-risk case with new information, status changes, or additional risk factors",
        },
        ledger_escalate_high_risk_case: {
          description: "Escalate a high-risk case to higher authority levels for specialized review and decision-making",
        },
        ledger_generate_report: {
          description: "Generate comprehensive business reports with various data sources and output formats",
        },
        ledger_list_reports: {
          description: "Get paginated list of generated business reports with filtering and search options",
        },
        ledger_get_report: {
          description: "Get detailed information about a specific business report including metadata and download access",
        },
        ledger_schedule_report: {
          description: "Schedule automatic generation of business reports on a recurring basis with customizable parameters",
        },
        ledger_delete_report: {
          description: "Delete a generated report file or cancel/delete a scheduled report configuration",
        },
        ledger_list_users: {
          description: "Get paginated list of system users with filtering, search, and role-based options",
        },
        ledger_get_user: {
          description: "Get detailed information about a specific system user including profile, roles, and permissions",
        },
        ledger_create_user: {
          description: "Create a new system user with specified roles, permissions, and profile information",
        },
        ledger_update_user: {
          description: "Update an existing user's profile information, roles, permissions, and settings",
        },
        ledger_get_user_permissions: {
          description: "Get detailed permissions, access rights, and role-based capabilities for a specific user",
        },
        ledger_list_claims: {
          description: "Get paginated list of insurance claims with comprehensive filtering and search options",
        },
        ledger_create_claim: {
          description: "Create a new insurance claim with comprehensive claimant, loss, and processing details",
        },
        ledger_get_claim: {
          description: "Get comprehensive information about a specific insurance claim including all details and history",
        },
        ledger_update_claim: {
          description: "Update an existing insurance claim with new information, status changes, or additional details",
        },
        ledger_process_claim: {
          description: "Process claim actions including approval, denial, payment authorization, and settlement",
        },
        ledger_set_claim_reserve: {
          description: "Set or update the financial reserve amount for an insurance claim with detailed justification",
        },
        ledger_list_audit_logs: {
          description: "Get paginated list of audit logs for compliance monitoring and security tracking",
        },
        ledger_create_audit_entry: {
          description: "Create a manual audit entry for compliance tracking and regulatory documentation",
        },
        ledger_get_compliance_report: {
          description: "Generate comprehensive compliance reports for regulatory requirements and internal audits",
        },
        ledger_track_data_access: {
          description: "Track and monitor data access patterns for compliance, privacy, and security monitoring",
        },
        ledger_send_notification: {
          description: "Send notifications via multiple channels including email, SMS, push notifications, and in-app alerts",
        },
        ledger_list_notifications: {
          description: "Get paginated list of sent notifications with comprehensive filtering and delivery tracking",
        },
        ledger_manage_notification_templates: {
          description: "Create, update, and manage notification templates for standardized communications",
        },
        ledger_get_notification_preferences: {
          description: "Get and manage user notification preferences including channels, frequency, and content settings",
        },
        ledger_create_workflow: {
          description: "Create automated business process workflows with triggers, conditions, and actions",
        },
        ledger_list_workflows: {
          description: "Get paginated list of automated business workflows with filtering and execution statistics",
        },
        ledger_execute_workflow: {
          description: "Manually execute a workflow with optional parameters and real-time monitoring",
        },
        ledger_monitor_workflow: {
          description: "Monitor workflow execution status, performance metrics, and real-time progress tracking",
        },
        // MAJOR MILESTONE: 84/148 tools complete (56.8%)!
        // TODO: Add remaining Ledger tools as they are implemented (64 remaining):
        // Integration tools, Analytics tools, Backup tools, etc.
      },
    },
  },
  {
    redisUrl: process.env.REDIS_URL,
    basePath: "/ledger",
    verboseLogs: true,
    maxDuration: 800,
  }
);

export { handler as GET, handler as POST, handler as DELETE };