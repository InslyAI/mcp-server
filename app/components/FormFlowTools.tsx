export default function FormFlowTools() {
  return (
    <div id="formflow-tools" className="mb-20">
      <div className="bg-gradient-to-r from-orange-50 to-white rounded-2xl p-8 mb-12">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mr-6">
            <span className="text-orange-600 font-bold text-xl">FF</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              FormFlow Service Tools (27 Total)
            </h2>
            <p className="text-lg text-gray-600">
              Professional document processing and AI-powered form management for insurance operations
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
            <span className="text-gray-700">Endpoint: <code className="text-orange-600 bg-orange-50 px-2 py-1 rounded">/formflow/[sse|mcp]</code></span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <span className="text-gray-700">Status: Production Ready</span>
          </div>
        </div>
      </div>

      {/* Tool Categories */}
      <div className="space-y-12">
        {/* Authentication Tools */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              🔑
            </span>
            Authentication & Token Management
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-semibold text-orange-600 font-mono">
                  formflow_exchange_token
                </div>
                <div className="px-2 py-1 bg-orange-50 text-orange-600 text-xs rounded-full font-medium">
                  AUTH
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                Exchange credentials for JWT bearer token with enhanced security and 1-hour validity
              </div>
            </div>
          </div>
        </div>

        {/* Submission Tools */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              📄
            </span>
            Submission Management
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-semibold text-orange-600 font-mono">
                  formflow_list_submissions
                </div>
                <div className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">
                  LIST
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                Retrieve submissions with advanced filtering, pagination, and sorting capabilities
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-semibold text-orange-600 font-mono">
                  formflow_create_submission
                </div>
                <div className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full font-medium">
                  CREATE
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                Initialize new form submissions with template binding and metadata
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-semibold text-orange-600 font-mono">
                  formflow_get_submission
                </div>
                <div className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">
                  READ
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                Retrieve detailed submission information including status and data
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-semibold text-orange-600 font-mono">
                  formflow_update_submission
                </div>
                <div className="px-2 py-1 bg-yellow-50 text-yellow-600 text-xs rounded-full font-medium">
                  UPDATE
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                Modify submission data, status, and associated metadata
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-semibold text-orange-600 font-mono">
                  formflow_get_submission_events
                </div>
                <div className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full font-medium">
                  EVENTS
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                Track submission lifecycle events and processing history
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-semibold text-orange-600 font-mono">
                  formflow_get_submission_references
                </div>
                <div className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-full font-medium">
                  REF
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                Access submission references and linked documents
              </div>
            </div>
          </div>
        </div>

        {/* Template Management */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              📋
            </span>
            Template Management
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-semibold text-orange-600 font-mono">
                  formflow_list_templates
                </div>
                <div className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">
                  LIST
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                Browse available form templates with filtering and search
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-semibold text-orange-600 font-mono">
                  formflow_create_template
                </div>
                <div className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full font-medium">
                  CREATE
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                Design and create new form templates with custom fields
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-semibold text-orange-600 font-mono">
                  formflow_get_template
                </div>
                <div className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">
                  READ
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                Retrieve template structure, fields, and configuration
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-semibold text-orange-600 font-mono">
                  formflow_update_template
                </div>
                <div className="px-2 py-1 bg-yellow-50 text-yellow-600 text-xs rounded-full font-medium">
                  UPDATE
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                Modify template fields, validation rules, and layout
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-semibold text-orange-600 font-mono">
                  formflow_delete_template
                </div>
                <div className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded-full font-medium">
                  DELETE
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                Remove templates with safety checks and dependency validation
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-semibold text-orange-600 font-mono">
                  formflow_get_template_submissions
                </div>
                <div className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full font-medium">
                  USAGE
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                View submissions created from specific templates
              </div>
            </div>
          </div>
        </div>

        {/* AI-Powered Features */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              🤖
            </span>
            AI-Powered Features
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-semibold text-orange-600 font-mono">
                  formflow_ai_extract_data
                </div>
                <div className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-full font-medium">
                  AI
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                Extract structured data from documents using advanced AI models
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-semibold text-orange-600 font-mono">
                  formflow_ai_generate_metadata
                </div>
                <div className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-full font-medium">
                  AI
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                Generate intelligent metadata and tags for document categorization
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-semibold text-orange-600 font-mono">
                  formflow_ai_generate_references
                </div>
                <div className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-full font-medium">
                  AI
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                Create smart references and cross-document relationships
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-semibold text-orange-600 font-mono">
                  formflow_ai_generate_schema
                </div>
                <div className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-full font-medium">
                  AI
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                Auto-generate form schemas from document analysis
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-semibold text-orange-600 font-mono">
                  formflow_start_processing
                </div>
                <div className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full font-medium">
                  PROCESS
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                Initiate AI-powered document processing workflows
              </div>
            </div>
          </div>
        </div>

        {/* Webhook Management */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              🔗
            </span>
            Webhook Management
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-semibold text-orange-600 font-mono">
                  formflow_list_webhooks
                </div>
                <div className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">
                  LIST
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                View configured webhook endpoints and their status
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-semibold text-orange-600 font-mono">
                  formflow_create_webhook
                </div>
                <div className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full font-medium">
                  CREATE
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                Set up new webhook endpoints for event notifications
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-semibold text-orange-600 font-mono">
                  formflow_get_webhook
                </div>
                <div className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">
                  READ
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                Retrieve webhook configuration and delivery statistics
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-semibold text-orange-600 font-mono">
                  formflow_update_webhook
                </div>
                <div className="px-2 py-1 bg-yellow-50 text-yellow-600 text-xs rounded-full font-medium">
                  UPDATE
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                Modify webhook settings, URLs, and event triggers
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-semibold text-orange-600 font-mono">
                  formflow_delete_webhook
                </div>
                <div className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded-full font-medium">
                  DELETE
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                Remove webhook endpoints with confirmation safeguards
              </div>
            </div>
          </div>
        </div>

        {/* File Management */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              📁
            </span>
            File Management
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-semibold text-orange-600 font-mono">
                  formflow_get_upload_url
                </div>
                <div className="px-2 py-1 bg-teal-50 text-teal-600 text-xs rounded-full font-medium">
                  UPLOAD
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                Generate secure upload URLs for file attachments
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-semibold text-orange-600 font-mono">
                  formflow_get_file
                </div>
                <div className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">
                  READ
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                Access file metadata and download information
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-semibold text-orange-600 font-mono">
                  formflow_file_view
                </div>
                <div className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full font-medium">
                  VIEW
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                Preview files and view processing results
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-semibold text-orange-600 font-mono">
                  formflow_delete_file
                </div>
                <div className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded-full font-medium">
                  DELETE
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                Remove files with secure deletion and cleanup
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}