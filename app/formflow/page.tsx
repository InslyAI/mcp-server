import Header from '../components/Header';
import Footer from '../components/Footer';

interface Tool {
  name: string;
  description: string;
  category: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint?: string;
  parameters?: string[];
}

const formflowTools: Tool[] = [
  // Authentication
  {
    name: 'formflow_exchange_token',
    description: 'Exchange credentials for JWT bearer token with 1-hour validity',
    category: 'Authentication',
    method: 'POST',
    endpoint: '/api/auth/token',
    parameters: ['apiKey', 'apiSecret', 'tenantId']
  },
  
  // Submissions Management
  {
    name: 'formflow_create_submission',
    description: 'Create a new form submission with optional template and metadata',
    category: 'Submissions',
    method: 'POST',
    endpoint: '/api/submissions',
    parameters: ['templateId', 'submissionData', 'metadata', 'clientSubmissionId']
  },
  {
    name: 'formflow_get_submission',
    description: 'Retrieve detailed information about a specific submission',
    category: 'Submissions',
    method: 'GET',
    endpoint: '/api/submissions/{id}',
    parameters: ['submissionId', 'includeEvents', 'includeFiles']
  },
  {
    name: 'formflow_update_submission',
    description: 'Update submission data, metadata, or processing status',
    category: 'Submissions',
    method: 'PUT',
    endpoint: '/api/submissions/{id}',
    parameters: ['submissionId', 'submissionData', 'metadata', 'processingStatus']
  },
  {
    name: 'formflow_list_submissions',
    description: 'List submissions with advanced filtering and pagination',
    category: 'Submissions',
    method: 'GET',
    endpoint: '/api/submissions',
    parameters: ['templateId', 'status', 'dateRange', 'limit', 'offset']
  },
  {
    name: 'formflow_get_submission_events',
    description: 'Get chronological events and processing history for submission',
    category: 'Submissions',
    method: 'GET',
    endpoint: '/api/submissions/{id}/events',
    parameters: ['submissionId', 'eventType', 'dateRange']
  },
  {
    name: 'formflow_get_submission_references',
    description: 'Get external references and related entities for submission',
    category: 'Submissions',
    method: 'GET',
    endpoint: '/api/submissions/{id}/references',
    parameters: ['submissionId', 'includeMetadata']
  },
  {
    name: 'formflow_start_processing',
    description: 'Initiate processing workflow for submission with custom options',
    category: 'Submissions',
    method: 'POST',
    endpoint: '/api/submissions/{id}/process',
    parameters: ['submissionId', 'processingOptions', 'priority']
  },

  // Templates Management
  {
    name: 'formflow_create_template',
    description: 'Create a new form template with schema and validation rules',
    category: 'Templates',
    method: 'POST',
    endpoint: '/api/templates',
    parameters: ['templateName', 'schema', 'validationRules', 'metadata']
  },
  {
    name: 'formflow_get_template',
    description: 'Retrieve template definition, schema, and configuration',
    category: 'Templates',
    method: 'GET',
    endpoint: '/api/templates/{id}',
    parameters: ['templateId', 'includeSchema', 'includeStats']
  },
  {
    name: 'formflow_update_template',
    description: 'Update template schema, validation rules, or metadata',
    category: 'Templates',
    method: 'PUT',
    endpoint: '/api/templates/{id}',
    parameters: ['templateId', 'schema', 'validationRules', 'metadata']
  },
  {
    name: 'formflow_delete_template',
    description: 'Delete template and optionally handle associated submissions',
    category: 'Templates',
    method: 'DELETE',
    endpoint: '/api/templates/{id}',
    parameters: ['templateId', 'handleExistingSubmissions']
  },
  {
    name: 'formflow_list_templates',
    description: 'List available templates with filtering and search',
    category: 'Templates',
    method: 'GET',
    endpoint: '/api/templates',
    parameters: ['search', 'category', 'status', 'limit']
  },
  {
    name: 'formflow_get_template_submissions',
    description: 'Get all submissions created from a specific template',
    category: 'Templates',
    method: 'GET',
    endpoint: '/api/templates/{id}/submissions',
    parameters: ['templateId', 'status', 'dateRange', 'limit']
  },

  // File Management
  {
    name: 'formflow_get_upload_url',
    description: 'Generate secure pre-signed URL for file upload',
    category: 'Files',
    method: 'POST',
    endpoint: '/api/files/upload-url',
    parameters: ['fileName', 'fileSize', 'mimeType', 'submissionId']
  },
  {
    name: 'formflow_get_file',
    description: 'Retrieve file metadata, content, or download information',
    category: 'Files',
    method: 'GET',
    endpoint: '/api/files/{id}',
    parameters: ['fileId', 'includeContent', 'downloadUrl']
  },
  {
    name: 'formflow_file_view',
    description: 'Get file viewer URL and preview information',
    category: 'Files',
    method: 'GET',
    endpoint: '/api/files/{id}/view',
    parameters: ['fileId', 'viewerType', 'downloadable']
  },
  {
    name: 'formflow_delete_file',
    description: 'Delete file and remove from associated submissions',
    category: 'Files',
    method: 'DELETE',
    endpoint: '/api/files/{id}',
    parameters: ['fileId', 'removeFromSubmissions']
  },

  // Webhooks Management
  {
    name: 'formflow_create_webhook',
    description: 'Create webhook endpoint for real-time event notifications',
    category: 'Webhooks',
    method: 'POST',
    endpoint: '/api/webhooks',
    parameters: ['url', 'events', 'secret', 'active']
  },
  {
    name: 'formflow_get_webhook',
    description: 'Retrieve webhook configuration and delivery statistics',
    category: 'Webhooks',
    method: 'GET',
    endpoint: '/api/webhooks/{id}',
    parameters: ['webhookId', 'includeStats']
  },
  {
    name: 'formflow_update_webhook',
    description: 'Update webhook URL, events, or configuration',
    category: 'Webhooks',
    method: 'PUT',
    endpoint: '/api/webhooks/{id}',
    parameters: ['webhookId', 'url', 'events', 'active']
  },
  {
    name: 'formflow_delete_webhook',
    description: 'Delete webhook and stop event deliveries',
    category: 'Webhooks',
    method: 'DELETE',
    endpoint: '/api/webhooks/{id}',
    parameters: ['webhookId']
  },
  {
    name: 'formflow_list_webhooks',
    description: 'List configured webhooks with filtering options',
    category: 'Webhooks',
    method: 'GET',
    endpoint: '/api/webhooks',
    parameters: ['active', 'events', 'url']
  },

  // AI Features
  {
    name: 'formflow_ai_extract_data',
    description: 'Extract structured data from documents using AI',
    category: 'AI Features',
    method: 'POST',
    endpoint: '/api/ai/extract',
    parameters: ['fileId', 'extractionType', 'schema', 'confidence']
  },
  {
    name: 'formflow_ai_generate_metadata',
    description: 'Generate metadata and tags for submissions using AI',
    category: 'AI Features',
    method: 'POST',
    endpoint: '/api/ai/metadata',
    parameters: ['submissionId', 'metadataTypes', 'includeCategories']
  },
  {
    name: 'formflow_ai_generate_references',
    description: 'Generate cross-references and related entity links',
    category: 'AI Features',
    method: 'POST',
    endpoint: '/api/ai/references',
    parameters: ['submissionId', 'referenceTypes', 'confidence']
  },
  {
    name: 'formflow_ai_generate_schema',
    description: 'Generate form schema from sample data or documents',
    category: 'AI Features',
    method: 'POST',
    endpoint: '/api/ai/schema',
    parameters: ['sampleData', 'documentIds', 'schemaType']
  }
];

const categories = Array.from(new Set(formflowTools.map(tool => tool.category)));

const getMethodColor = (method: string) => {
  switch (method) {
    case 'GET': return 'bg-blue-100 text-blue-800';
    case 'POST': return 'bg-green-100 text-green-800';
    case 'PUT': return 'bg-yellow-100 text-yellow-800';
    case 'DELETE': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function FormFlowPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-orange-600 font-bold text-xl">FF</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">FormFlow Service</h1>
              <p className="text-gray-600">Document processing, AI extraction, and form management</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-2xl font-bold text-orange-600">{formflowTools.length}</div>
              <div className="text-sm text-gray-600">Total Tools</div>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-2xl font-bold text-orange-600">{categories.length}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-2xl font-bold text-green-600">✅</div>
              <div className="text-sm text-gray-600">Production Ready</div>
            </div>
          </div>
        </div>

        {/* Tools by Category */}
        {categories.map(category => {
          const categoryTools = formflowTools.filter(tool => tool.category === category);
          
          return (
            <div key={category} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                {category}
                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {categoryTools.length} tools
                </span>
              </h2>
              
              <div className="grid gap-3">
                {categoryTools.map(tool => (
                  <div key={tool.name} className="bg-white rounded-lg border hover:shadow-md transition-shadow">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-mono text-sm font-medium text-gray-900 mb-1">
                            {tool.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">{tool.description}</p>
                          {tool.endpoint && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className={`px-2 py-1 rounded-md font-medium ${getMethodColor(tool.method)}`}>
                                {tool.method}
                              </span>
                              <code className="bg-gray-100 px-2 py-1 rounded">{tool.endpoint}</code>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {tool.parameters && tool.parameters.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="text-xs text-gray-500 mb-1">Key Parameters:</div>
                          <div className="flex flex-wrap gap-1">
                            {tool.parameters.map(param => (
                              <span key={param} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                                {param}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* MCP Connection Info */}
        <div className="mt-12 bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">MCP Connection</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Server-Sent Events (SSE)</h3>
              <code className="block bg-gray-100 p-2 rounded text-sm">
                /formflow/sse
              </code>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">HTTP Transport</h3>
              <code className="block bg-gray-100 p-2 rounded text-sm">
                /formflow/mcp
              </code>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}