/**
 * Ledger MCP Endpoint
 * Complete Ledger API coverage with 162 tools
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
        "ledger_add_remove_invoice": {
          description: "Add or remove individual invoices from a consolidated invoice",
        },
        "ledger_approve_e_proposal": {
          description: "Approve or reject an electronic proposal after underwriting review with decision details",
        },
        "ledger_bind_policy": {
          description: "Bind/lock a policy draft to prevent further changes and prepare for issuance",
        },
        "ledger_calculate_endorsement": {
          description: "Calculate premium adjustments and pricing impact for a policy endorsement",
        },
        "ledger_calculate_policy": {
          description: "Calculate premium and pricing for a policy/quote based on current data",
        },
        "ledger_calculate_policy_debug": {
          description: "Perform debug calculation for policy pricing with detailed breakdown and debug information",
        },
        "ledger_calculate_quote": {
          description: "Calculate premiums and pricing for a quote by updating and calculating in one operation",
        },
        "ledger_chat_configuration": {
          description: "Configure chat settings, notifications, and communication preferences",
        },
        "ledger_copy_policy": {
          description: "Create a copy of an existing policy/quote for reuse or modification",
        },
        "ledger_copy_quote": {
          description: "Create a copy of an existing quote. Only non-MTA (non-Mid Term Adjustment) quotes can be copied",
        },
        "ledger_create_audit_entry": {
          description: "Create a manual audit entry for compliance tracking and regulatory documentation",
        },
        "ledger_create_bdx_report": {
          description: "Create a BDX broker payment report for an insurer at a specific time",
        },
        "ledger_create_binder": {
          description: "Create a new binder with comprehensive configuration including summary, contract details, shares, limitations, and documents",
        },
        "ledger_create_claim": {
          description: "Create a new insurance claim with comprehensive claimant, loss, and processing details",
        },
        "ledger_create_consolidated_invoice": {
          description: "Create a new consolidated invoice for multiple individual invoices",
        },
        "ledger_create_credit_note": {
          description: "Create a credit note for a consolidated invoice to handle refunds or adjustments",
        },
        "ledger_create_customer": {
          description: "Create a new customer with the provided information",
        },
        "ledger_create_e_proposal": {
          description: "Create a new electronic proposal for streamlined underwriting and approval workflow",
        },
        "ledger_create_endorsement": {
          description: "Create a new policy endorsement for modifying an existing policy",
        },
        "ledger_create_external_policy": {
          description: "Create a policy from external product sources and integrations",
        },
        "ledger_create_high_risk_case": {
          description: "Create a new high-risk case requiring special underwriting attention and management",
        },
        "ledger_create_mta": {
          description: "Create a Mid-Term Adjustment (MTA) for making changes to an existing policy during the policy term",
        },
        "ledger_create_policy": {
          description: "Create a new policy/quote using JSON schema validation - get schema from schemes section first",
        },
        "ledger_create_policy_e_proposal": {
          description: "Create an electronic proposal from a policy/quote for customer review and acceptance",
        },
        "ledger_create_quote": {
          description: "Create a new insurance quote using a specific product schema with customer and risk data",
        },
        "ledger_create_user": {
          description: "Create a new system user with specified roles, permissions, and profile information",
        },
        "ledger_create_workflow": {
          description: "Create automated business process workflows with triggers, conditions, and actions",
        },
        "ledger_debug_calculation_api": {
          description: "Debug calculation API issues and get diagnostic information for troubleshooting",
        },
        "ledger_decline_policy": {
          description: "Decline a policy draft with specified reason and optional details",
        },
        "ledger_delete_customer_note": {
          description: "Delete a specific note associated with a customer by note ID",
        },
        "ledger_delete_report": {
          description: "Delete a generated report file or cancel/delete a scheduled report configuration",
        },
        "ledger_escalate_high_risk_case": {
          description: "Escalate a high-risk case to higher authority levels for specialized review and decision-making",
        },
        "ledger_execute_workflow": {
          description: "Manually execute a workflow with optional parameters and real-time monitoring",
        },
        "ledger_generate_policy_document": {
          description: "Generate a policy document of a specific type. The document is generated based on the policy data and returns binary content",
        },
        "ledger_generate_quote_document": {
          description: "Generate the main quote document or a specific document type for a quote. Returns binary document content",
        },
        "ledger_generate_report": {
          description: "Generate comprehensive business reports with various data sources and output formats",
        },
        "ledger_get_action_schema": {
          description: "Get JSON schema for specific action types in the system",
        },
        "ledger_get_action_ui_schema": {
          description: "Get UI schema for rendering action type interfaces",
        },
        "ledger_get_available_invoices": {
          description: "Get list of invoices that can be added to a consolidated invoice",
        },
        "ledger_get_bdx_report": {
          description: "Get the generated BDX broker payment report data using the event ID",
        },
        "ledger_get_binder": {
          description: "Get detailed information about a specific binder by ID",
        },
        "ledger_get_binder_groups": {
          description: "Get list of available binder groups/categories for organizing binders",
        },
        "ledger_get_broker_policies_count": {
          description: "Get policy count for a broker to validate merge operations and assess impact",
        },
        "ledger_get_broker_short_names": {
          description: "Get quick reference list of broker short names and identifiers for lookups and integrations",
        },
        "ledger_get_claim": {
          description: "Get comprehensive information about a specific insurance claim including all details and history",
        },
        "ledger_get_compliance_report": {
          description: "Generate comprehensive compliance reports for regulatory requirements and internal audits",
        },
        "ledger_get_consolidated_invoice": {
          description: "Get detailed information about a specific consolidated invoice",
        },
        "ledger_get_customer": {
          description: "Get detailed information about a specific customer by ID",
        },
        "ledger_get_customer_history": {
          description: "Get historical activity and interaction history for a customer including policy changes, payments, claims, and communications",
        },
        "ledger_get_customer_notes": {
          description: "Get all notes and comments associated with a customer, including internal notes and customer communications",
        },
        "ledger_get_customer_profile": {
          description: "Get comprehensive profile information for a customer including personal details, preferences, and account settings",
        },
        "ledger_get_customer_totals": {
          description: "Get financial totals and statistics for a specific customer including premium amounts, policy counts, and overdue payments",
        },
        "ledger_get_e_proposal": {
          description: "Get detailed information about a specific electronic proposal including status and workflow",
        },
        "ledger_get_endorsement": {
          description: "Get detailed information about a specific policy endorsement",
        },
        "ledger_get_feature_schema": {
          description: "Get JSON schema for a specific product feature",
        },
        "ledger_get_feature_ui_schema": {
          description: "Get UI schema for rendering a specific product feature interface",
        },
        "ledger_get_high_risk_case": {
          description: "Get detailed information about a specific high-risk case including risk factors and workflow history",
        },
        "ledger_get_installments_schedule": {
          description: "Get payment installment schedule for a specific policy",
        },
        "ledger_get_invoice_documents": {
          description: "Get documents associated with a consolidated invoice including PDFs and supporting files",
        },
        "ledger_get_last_requested_period": {
          description: "Get information about the last requested payment period for broker payments",
        },
        "ledger_get_mta_renewal_schema": {
          description: "Get JSON schema for MTA (Mid-Term Adjustment) renewal processing with specific version",
        },
        "ledger_get_mta_renewal_ui_schema": {
          description: "Get UI schema for rendering MTA (Mid-Term Adjustment) renewal interfaces with specific version",
        },
        "ledger_get_notification_preferences": {
          description: "Get and manage user notification preferences including channels, frequency, and content settings",
        },
        "ledger_get_payment_detail": {
          description: "Get detailed information about a specific broker payment including commissions and breakdowns",
        },
        "ledger_get_payment_suggestion": {
          description: "Get payment suggestions and recommendations for broker payments",
        },
        "ledger_get_policies_renewal": {
          description: "Get dashboard data for policies that are eligible for renewal and don",
        },
        "ledger_get_policies_renewal_products": {
          description: "Get list of renewable products that are editable by the current user for policy renewals. These products support policy renewal workflows",
        },
        "ledger_get_policy": {
          description: "Get detailed information about a specific policy by ID",
        },
        "ledger_get_policy_broker_events": {
          description: "Get list of policy events for a specific broker within a date range",
        },
        "ledger_get_policy_changes": {
          description: "Get detailed change history and modifications for a specific policy",
        },
        "ledger_get_policy_customer": {
          description: "Get customer information associated with a specific policy",
        },
        "ledger_get_policy_documents": {
          description: "Get list of generated documents for a specific policy",
        },
        "ledger_get_policy_history": {
          description: "Get the complete change history for a specific policy including all modifications, endorsements, and status changes",
        },
        "ledger_get_policy_insurers": {
          description: "Get available insurers for policy schema configuration",
        },
        "ledger_get_policy_links": {
          description: "Get related links and resources for a policy including actions, documents, and related policies",
        },
        "ledger_get_policy_products": {
          description: "Get available products for a specific object type in policy schema",
        },
        "ledger_get_policy_termination_schema": {
          description: "Get JSON schema for policy termination process for a specific policy",
        },
        "ledger_get_policy_termination_ui_schema": {
          description: "Get UI schema for rendering policy termination interfaces for a specific policy",
        },
        "ledger_get_product_features": {
          description: "Get feature configuration settings for a specific insurance product schema",
        },
        "ledger_get_quote": {
          description: "Get detailed information about a specific quote by ID including all quote data and metadata",
        },
        "ledger_get_quotes_in_referral": {
          description: "Get dashboard data for quotes currently in referral status awaiting underwriter review. Supports filtering and search capabilities",
        },
        "ledger_get_quotes_renewal": {
          description: "Get dashboard data for renewal quotes that have been created by renewal processes and are not yet issued. Supports filtering by product, status, and broker",
        },
        "ledger_get_regular_schema": {
          description: "Get JSON schema for regular policy products - use with React JSON Schema Form to create quote payloads",
        },
        "ledger_get_renewal_products": {
          description: "Get list of renewable products that are editable by the current user. These products support renewal quote generation",
        },
        "ledger_get_renewal_schema": {
          description: "Get JSON schema for policy renewal products - use with React JSON Schema Form to create renewal payloads",
        },
        "ledger_get_renewal_ui_schema": {
          description: "Get UI schema for rendering policy renewal interfaces with specific version",
        },
        "ledger_get_report": {
          description: "Get detailed information about a specific business report including metadata and download access",
        },
        "ledger_get_request_status": {
          description: "Get status of asynchronous operations like quote processing, policy issuance, or bulk calculations",
        },
        "ledger_get_schema": {
          description: "Get JSON schema structure for a specific product type. This provides the validation rules and data structure for creating quotes and policies",
        },
        "ledger_get_schema_products": {
          description: "Get available products for a specific schema version",
        },
        "ledger_get_schema_ui": {
          description: "Get UI schema for form rendering of renewal quotes. UI schemas provide layout, widget, and display configuration for React JSON Schema Forms",
        },
        "ledger_get_specific_feature": {
          description: "Get detailed configuration for a specific tenant feature",
        },
        "ledger_get_tenant_features": {
          description: "Get tenant-wide feature configuration settings and capabilities",
        },
        "ledger_get_user": {
          description: "Get detailed information about a specific system user including profile, roles, and permissions",
        },
        "ledger_get_user_permissions": {
          description: "Get detailed permissions, access rights, and role-based capabilities for a specific user",
        },
        "ledger_import_policy_data": {
          description: "Import data into an existing policy from external sources or bulk data",
        },
        "ledger_invoice_file_validation": {
          description: "Validate invoice files for compliance, format, and content requirements",
        },
        "ledger_ireland_address_lookup": {
          description: "Look up and validate addresses in Ireland using official postal services",
        },
        "ledger_ireland_postcode_lookup": {
          description: "Look up postcodes and Eircode information for Ireland addresses",
        },
        "ledger_issue_consolidated_invoice": {
          description: "Issue a consolidated invoice to make it final and binding for payment",
        },
        "ledger_issue_endorsement": {
          description: "Issue an approved endorsement to officially apply the changes to the policy",
        },
        "ledger_issue_policy": {
          description: "Issue a final policy from a quote or draft, making it active and binding",
        },
        "ledger_issue_quote": {
          description: "Issue a quote to convert it into a policy. This is an asynchronous operation that returns a request ID for status tracking",
        },
        "ledger_list_audit_logs": {
          description: "Get paginated list of audit logs for compliance monitoring and security tracking",
        },
        "ledger_list_binder_names": {
          description: "Get list of binder names and IDs for dropdown/selection purposes. Returns simplified binder data optimized for UI components.",
        },
        "ledger_list_binders": {
          description: "Get paginated list of binders with full details and filtering options",
        },
        "ledger_list_claims": {
          description: "Get paginated list of insurance claims with comprehensive filtering and search options",
        },
        "ledger_list_consolidated_invoice_brokers": {
          description: "Get list of brokers available for consolidated invoicing",
        },
        "ledger_list_consolidated_invoices": {
          description: "Get paginated list of consolidated invoices with filtering options",
        },
        "ledger_list_customers": {
          description: "Get a list of all customers in the system",
        },
        "ledger_list_debt_policies": {
          description: "Get list of policies with outstanding debt and payment issues",
        },
        "ledger_list_e_proposals": {
          description: "Get paginated list of electronic proposals with filtering and search options",
        },
        "ledger_list_endorsements": {
          description: "Get paginated list of policy endorsements with filtering and search options",
        },
        "ledger_list_high_risk_cases": {
          description: "Get paginated list of high-risk cases requiring special underwriting attention and management",
        },
        "ledger_list_notifications": {
          description: "Get paginated list of sent notifications with comprehensive filtering and delivery tracking",
        },
        "ledger_list_payments_by_payer": {
          description: "Get broker payments filtered by a specific payer (broker or insurer)",
        },
        "ledger_list_payments_paginated": {
          description: "Get paginated list of broker payments with cursor-based navigation",
        },
        "ledger_list_policies": {
          description: "Get a paginated list of policies with comprehensive filtering and search options",
        },
        "ledger_list_reinsurance": {
          description: "Get list of reinsurance arrangements and related information",
        },
        "ledger_list_reports": {
          description: "Get paginated list of generated business reports with filtering and search options",
        },
        "ledger_list_users": {
          description: "Get paginated list of system users with filtering, search, and role-based options",
        },
        "ledger_list_workflows": {
          description: "Get paginated list of automated business workflows with filtering and execution statistics",
        },
        "ledger_manage_api_integrations": {
          description: "Create, configure, and manage external API integrations for third-party services and data sources",
        },
        "ledger_manage_consolidated_invoice_items": {
          description: "Add or remove individual invoices from a consolidated invoice",
        },
        "ledger_manage_high_risk_data": {
          description: "Manage bulk high-risk case data including export, import, and querying operations",
        },
        "ledger_manage_invoice_files": {
          description: "Manage invoice files including upload, download, and metadata operations",
        },
        "ledger_manage_notification_templates": {
          description: "Create, update, and manage notification templates for standardized communications",
        },
        "ledger_manage_policy_actions": {
          description: "Manage policy actions and workflow operations",
        },
        "ledger_manage_policy_calculations": {
          description: "Manage various policy calculation operations including specific and batch calculations",
        },
        "ledger_manage_policy_events": {
          description: "Manage policy events including listing, creating, and retrieving specific events",
        },
        "ledger_manage_policy_files": {
          description: "Upload and manage files associated with a policy",
        },
        "ledger_manage_policy_packages": {
          description: "Manage policy packages and perform aggregated calculations",
        },
        "ledger_manage_policy_referrals": {
          description: "Manage policy referrals including listing, accepting, and declining referrals",
        },
        "ledger_merge_brokers": {
          description: "Merge duplicate broker accounts and consolidate their policies, commissions, and data",
        },
        "ledger_monitor_workflow": {
          description: "Monitor workflow execution status, performance metrics, and real-time progress tracking",
        },
        "ledger_multi_search": {
          description: "Universal search across all platform entities including policies, customers, quotes, brokers, and more",
        },
        "ledger_process_claim": {
          description: "Process claim actions including approval, denial, payment authorization, and settlement",
        },
        "ledger_renew_binder": {
          description: "Renew an existing binder for the next period. Creates a renewal binder based on the original binder configuration",
        },
        "ledger_renew_policy": {
          description: "Prepare data for policy renewal by creating a renewal quote based on the existing policy",
        },
        "ledger_schedule_report": {
          description: "Schedule automatic generation of business reports on a recurring basis with customizable parameters",
        },
        "ledger_search_policies": {
          description: "Search for policies using various filters and search terms with pagination support",
        },
        "ledger_send_notification": {
          description: "Send notifications via multiple channels including email, SMS, push notifications, and in-app alerts",
        },
        "ledger_send_policy_email": {
          description: "Send email notifications and information requests related to policies",
        },
        "ledger_set_claim_reserve": {
          description: "Set or update the financial reserve amount for an insurance claim with detailed justification",
        },
        "ledger_submit_e_proposal": {
          description: "Submit an electronic proposal for underwriting review and approval workflow",
        },
        "ledger_terminate_policy": {
          description: "Terminate an existing policy with specified termination type and financial details",
        },
        "ledger_track_data_access": {
          description: "Track and monitor data access patterns for compliance, privacy, and security monitoring",
        },
        "ledger_unbind_policy": {
          description: "Unbind/unlock a policy to allow further changes and modifications",
        },
        "ledger_update_binder": {
          description: "Update an existing binder with new configuration. Only provided fields will be updated (partial update supported)",
        },
        "ledger_update_claim": {
          description: "Update an existing insurance claim with new information, status changes, or additional details",
        },
        "ledger_update_customer": {
          description: "Update an existing customer",
        },
        "ledger_update_e_proposal": {
          description: "Update an existing electronic proposal with new data, corrections, or additional information",
        },
        "ledger_update_endorsement": {
          description: "Update an existing policy endorsement with new data or changes",
        },
        "ledger_update_feature_config": {
          description: "Update feature configuration settings for products or tenant",
        },
        "ledger_update_high_risk_case": {
          description: "Update an existing high-risk case with new information, status changes, or additional risk factors",
        },
        "ledger_update_policy": {
          description: "Update an existing policy/quote with new data - follows JSON schema validation",
        },
        "ledger_update_quote": {
          description: "Update an existing quote with new data according to the product schema",
        },
        "ledger_update_user": {
          description: "Update an existing user",
        },
        "ledger_upload_calculator": {
          description: "Upload an Excel calculator file that can be used in policy schemas for premium calculations. Returns a calculator ID for use in schemas",
        },
        "ledger_upload_excel_calculator": {
          description: "Upload and configure Excel-based calculation tools for insurance pricing and underwriting",
        },
        "ledger_upload_policy_files": {
          description: "Upload one or more files to a policy. Files are attached as supporting documents to the policy record",
        },
        "ledger_upload_quote_files": {
          description: "Upload one or more files to a quote. Files are attached as supporting documents to the quote record",
        },
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