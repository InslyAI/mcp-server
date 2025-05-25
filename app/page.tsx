"use client";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img
                src="/insly-logo-2.png"
                alt="Insly"
                className="h-10 w-auto"
              />
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#tools" className="insly-nav-link">
                Tools
              </a>
              <a href="#endpoints" className="insly-nav-link">
                Endpoints
              </a>
              <a
                href="https://insly.com"
                className="insly-nav-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Main Platform
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Endpoints Section */}
      <section id="endpoints" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Insly MCP Server
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <div className="insly-card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-orange-600 font-bold text-xs">FF</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    FormFlow Service
                  </h3>
                  <code className="text-xs text-gray-600">
                    /formflow/[sse|mcp]
                  </code>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                <strong>25 tools</strong> for insurance document processing, AI
                extraction, and form management.
              </p>
              <div className="text-xs text-green-600 font-semibold">
                ✅ Production Ready
              </div>
            </div>

            <div className="insly-card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold text-xs">ID</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Identifier Service
                  </h3>
                  <code className="text-xs text-gray-600">
                    /identifier/[sse|mcp]
                  </code>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                <strong>3 tools</strong> for authentication and identity
                management with the Insly platform.
              </p>
              <div className="text-xs text-green-600 font-semibold">
                ✅ Production Ready
              </div>
            </div>

            <div className="insly-card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-emerald-600 font-bold text-xs">LG</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Ledger Service
                  </h3>
                  <code className="text-xs text-gray-600">
                    /ledger/[sse|mcp]
                  </code>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                <strong>162 tools</strong> providing complete insurance business
                operations with 100% API coverage.
              </p>
              <div className="text-xs text-green-600 font-semibold">
                ✅ Production Ready
              </div>
            </div>

            <div className="insly-card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-gray-600 font-bold text-xs">ALL</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Unified Endpoint
                  </h3>
                  <code className="text-xs text-gray-600">/[sse|mcp]</code>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                <strong>190 tools</strong> from all services in a single
                connection for comprehensive access.
              </p>
              <div className="text-xs text-green-600 font-semibold">
                ✅ Production Ready
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MCP Tools Section */}
      <section id="tools" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Available MCP Tools (190 Total)
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive suite of 190 specialized tools across FormFlow (25),
              Identifier (3), and Ledger (162) services
            </p>
          </div>

          {/* Tool Categories */}
          <div className="space-y-12">
            {/* Authentication Tools */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                🔑 Authentication & Token Management
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  className="bg-white rounded-lg p-4"
                  style={{ border: "1px solid var(--insly-border)" }}
                >
                  <div
                    className="font-semibold mb-2"
                    style={{ color: "var(--insly-orange)" }}
                  >
                    formflow_exchange_token
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: "var(--insly-medium-gray)" }}
                  >
                    Exchange credentials for JWT bearer token
                  </div>
                </div>
              </div>
            </div>

            {/* Submission Tools */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                📄 Submission Management
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">
                    formflow_list_submissions
                  </div>
                  <div className="text-sm text-gray-600">
                    List submissions with filtering and pagination
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">
                    formflow_create_submission
                  </div>
                  <div className="text-sm text-gray-600">
                    Create new form submissions
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">
                    formflow_get_submission
                  </div>
                  <div className="text-sm text-gray-600">
                    Retrieve submission details by ID
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">
                    formflow_update_submission
                  </div>
                  <div className="text-sm text-gray-600">
                    Update submission details and metadata
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">
                    formflow_get_submission_references
                  </div>
                  <div className="text-sm text-gray-600">
                    Get AI-generated document references
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">
                    formflow_get_submission_events
                  </div>
                  <div className="text-sm text-gray-600">
                    Track processing lifecycle events
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">
                    formflow_get_upload_url
                  </div>
                  <div className="text-sm text-gray-600">
                    Get S3 upload URLs for files
                  </div>
                </div>
              </div>
            </div>

            {/* Template Tools */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                📋 Template Management
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">
                    formflow_list_templates
                  </div>
                  <div className="text-sm text-gray-600">
                    List available form templates
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">
                    formflow_get_template
                  </div>
                  <div className="text-sm text-gray-600">
                    Get template details by ID
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">
                    formflow_create_template
                  </div>
                  <div className="text-sm text-gray-600">
                    Create new form templates
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">
                    formflow_update_template
                  </div>
                  <div className="text-sm text-gray-600">
                    Update template configuration
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">
                    formflow_delete_template
                  </div>
                  <div className="text-sm text-gray-600">
                    Soft delete templates
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">
                    formflow_get_template_submissions
                  </div>
                  <div className="text-sm text-gray-600">
                    Get all submissions for a template
                  </div>
                </div>
              </div>
            </div>

            {/* AI Tools */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                🤖 AI-Powered Features
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">
                    formflow_ai_extract_data
                  </div>
                  <div className="text-sm text-gray-600">
                    AI-powered document data extraction
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">
                    formflow_ai_generate_metadata
                  </div>
                  <div className="text-sm text-gray-600">
                    Generate AI-driven submission metadata
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">
                    formflow_start_processing
                  </div>
                  <div className="text-sm text-gray-600">
                    Start AI processing workflows for submissions
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">
                    formflow_ai_generate_references
                  </div>
                  <div className="text-sm text-gray-600">
                    Generate document references using AI
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">
                    formflow_ai_generate_schema_for_submission
                  </div>
                  <div className="text-sm text-gray-600">
                    Generate submission schemas with AI
                  </div>
                </div>
              </div>
            </div>

            {/* Webhook Tools */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                🔗 Webhook Management
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">
                    formflow_create_webhook
                  </div>
                  <div className="text-sm text-gray-600">
                    Create webhook subscriptions
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">
                    formflow_list_webhooks
                  </div>
                  <div className="text-sm text-gray-600">
                    List webhook subscriptions
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">
                    formflow_get_webhook
                  </div>
                  <div className="text-sm text-gray-600">
                    Get webhook details by ID
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">
                    formflow_update_webhook
                  </div>
                  <div className="text-sm text-gray-600">
                    Update webhook configuration
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">
                    formflow_delete_webhook
                  </div>
                  <div className="text-sm text-gray-600">
                    Delete webhook subscriptions
                  </div>
                </div>
              </div>
            </div>

            {/* File Management */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                📁 File Management
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">
                    formflow_get_file
                  </div>
                  <div className="text-sm text-gray-600">
                    Get file metadata and details
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">
                    formflow_delete_file
                  </div>
                  <div className="text-sm text-gray-600">
                    Delete files permanently
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">
                    formflow_file_view
                  </div>
                  <div className="text-sm text-gray-600">
                    View and download files
                  </div>
                </div>
              </div>
            </div>

            {/* Identifier Service Tools */}
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                🆔 Identifier Service Tools (3 Total)
              </h2>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  🔐 Authentication & Identity Management
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white border border-blue-200 rounded-lg p-4">
                    <div className="font-semibold text-blue-600 mb-2">
                      identifier_login
                    </div>
                    <div className="text-sm text-gray-600">
                      Login with username and password to get JWT bearer token
                      for Ledger API access
                    </div>
                  </div>
                  <div className="bg-white border border-blue-200 rounded-lg p-4">
                    <div className="font-semibold text-blue-600 mb-2">
                      identifier_client_credentials
                    </div>
                    <div className="text-sm text-gray-600">
                      Authenticate with client credentials to get JWT bearer
                      token
                    </div>
                  </div>
                  <div className="bg-white border border-blue-200 rounded-lg p-4">
                    <div className="font-semibold text-blue-600 mb-2">
                      identifier_refresh_token
                    </div>
                    <div className="text-sm text-gray-600">
                      Refresh expired JWT bearer token using refresh token
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ledger Service Tools */}
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                📊 Ledger Service Tools (162 Total) - Complete API Coverage
              </h2>

              {/* Core Business Operations */}
              <div className="mb-12">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  🏢 Core Business Operations
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      Policies (33 tools)
                    </div>
                    <div className="text-sm text-gray-600">
                      Complete policy lifecycle, documents, files, calculations,
                      actions, notifications
                    </div>
                  </div>
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      Claims (6 tools)
                    </div>
                    <div className="text-sm text-gray-600">
                      Claims processing, reserves, and management
                    </div>
                  </div>
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      Quotes (6 tools)
                    </div>
                    <div className="text-sm text-gray-600">
                      Quote generation and management
                    </div>
                  </div>
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      Binders (7 tools)
                    </div>
                    <div className="text-sm text-gray-600">
                      Policy binder management and lifecycle operations
                    </div>
                  </div>
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      Endorsements (6 tools)
                    </div>
                    <div className="text-sm text-gray-600">
                      Policy change management
                    </div>
                  </div>
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      E-Proposals (6 tools)
                    </div>
                    <div className="text-sm text-gray-600">
                      Electronic proposal workflows
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Operations */}
              <div className="mb-12">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  💰 Financial Operations
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      Consolidated Invoices (10 tools)
                    </div>
                    <div className="text-sm text-gray-600">
                      Full invoice management, documents, credit notes
                    </div>
                  </div>
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      Broker Payments (7 tools)
                    </div>
                    <div className="text-sm text-gray-600">
                      Payment processing and management
                    </div>
                  </div>
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      Debt Policies (1 tool)
                    </div>
                    <div className="text-sm text-gray-600">
                      Debt policy management
                    </div>
                  </div>
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      Reinsurance (1 tool)
                    </div>
                    <div className="text-sm text-gray-600">
                      Reinsurance operations
                    </div>
                  </div>
                </div>
              </div>

              {/* Administrative & Configuration */}
              <div className="mb-12">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  ⚙️ Administrative & Configuration
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      Feature Configuration (4 tools)
                    </div>
                    <div className="text-sm text-gray-600">
                      Product, tenant, and feature management
                    </div>
                  </div>
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      Broker Management (3 tools)
                    </div>
                    <div className="text-sm text-gray-600">
                      Broker consolidation and administration
                    </div>
                  </div>
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      Users (5 tools)
                    </div>
                    <div className="text-sm text-gray-600">
                      User management and permissions
                    </div>
                  </div>
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      Chat Settings (1 tool)
                    </div>
                    <div className="text-sm text-gray-600">
                      Communication configuration
                    </div>
                  </div>
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      Request Tracking (1 tool)
                    </div>
                    <div className="text-sm text-gray-600">
                      Async operation monitoring
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk & Compliance */}
              <div className="mb-12">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  🛡️ Risk & Compliance
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      High-Risk Cases (5 tools)
                    </div>
                    <div className="text-sm text-gray-600">
                      Risk assessment and case management
                    </div>
                  </div>
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      High-Risk Data (1 tool)
                    </div>
                    <div className="text-sm text-gray-600">
                      Bulk high-risk data operations
                    </div>
                  </div>
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      Audit (4 tools)
                    </div>
                    <div className="text-sm text-gray-600">
                      Compliance reporting, audit logs, data access tracking
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents & Files */}
              <div className="mb-12">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  📄 Documents & Files
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      Documents (5 tools)
                    </div>
                    <div className="text-sm text-gray-600">
                      Policy and quote document generation
                    </div>
                  </div>
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      Invoice Files (2 tools)
                    </div>
                    <div className="text-sm text-gray-600">
                      Invoice file management and validation
                    </div>
                  </div>
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      Excel Calculator (2 tools)
                    </div>
                    <div className="text-sm text-gray-600">
                      Calculator upload and management
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Intelligence */}
              <div className="mb-12">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  📊 Business Intelligence
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      Reports (5 tools)
                    </div>
                    <div className="text-sm text-gray-600">
                      Business reporting and analytics
                    </div>
                  </div>
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      Dashboards (5 tools)
                    </div>
                    <div className="text-sm text-gray-600">
                      Business intelligence and renewal analytics
                    </div>
                  </div>
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      Search (1 tool)
                    </div>
                    <div className="text-sm text-gray-600">
                      Universal multi-search across all entities
                    </div>
                  </div>
                </div>
              </div>

              {/* Integrations & Services */}
              <div className="mb-12">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  🔗 Integrations & Services
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      Lookup Services (2 tools)
                    </div>
                    <div className="text-sm text-gray-600">
                      Ireland address and postcode lookup
                    </div>
                  </div>
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      Notifications (4 tools)
                    </div>
                    <div className="text-sm text-gray-600">
                      Communication and alert systems
                    </div>
                  </div>
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      Workflows (4 tools)
                    </div>
                    <div className="text-sm text-gray-600">
                      Process automation and monitoring
                    </div>
                  </div>
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      Customers (9 tools)
                    </div>
                    <div className="text-sm text-gray-600">
                      Customer management and CRM operations
                    </div>
                  </div>
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <div className="font-semibold text-emerald-600 mb-2">
                      Schemes (15 tools)
                    </div>
                    <div className="text-sm text-gray-600">
                      Schema and data structure management
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="/insly-logo.png"
                  alt="Insly"
                  className="h-8 w-auto brightness-0 invert"
                />
                <div className="text-2xl font-bold text-white">
                  <span style={{ color: "var(--insly-orange)" }}>insly</span>.ai
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                AI-powered Model Context Protocol server for the insurance
                industry
              </p>
            </div>

            <div>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: "var(--insly-orange)" }}
              >
                Platform
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://insly.com"
                    className="insly-footer-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    insly.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://develop.formflow-dev.net"
                    className="insly-footer-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    FormFlow
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: "var(--insly-orange)" }}
              >
                Documentation
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#tools" className="insly-footer-link">
                    Available Tools
                  </a>
                </li>
                <li>
                  <a href="#endpoints" className="insly-footer-link">
                    Endpoints
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 insly.ai - AI Assistant for Insurance Operations
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
