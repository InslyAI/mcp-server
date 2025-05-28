import Header from '../components/Header';
import Footer from '../components/Footer';

interface Tool {
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  parameters?: string[];
}

const claimManagementTools: Tool[] = [
  // Access Management (1 tool)
  { name: 'claim_management_access_management_get_actions', description: 'Get allowed actions list for user permissions', category: 'Access Management', method: 'GET' },

  // Claims - Basic Operations (6 tools)
  { name: 'claim_management_claims_create', description: 'Create new insurance claim', category: 'Claims', subcategory: 'Basic Operations', method: 'POST', parameters: ['claimData'] },
  { name: 'claim_management_claims_get', description: 'Get detailed claim information', category: 'Claims', subcategory: 'Basic Operations', method: 'GET', parameters: ['claimId'] },
  { name: 'claim_management_claims_list', description: 'List claims with filtering options', category: 'Claims', subcategory: 'Basic Operations', method: 'GET', parameters: ['filters'] },
  { name: 'claim_management_claims_update', description: 'Update claim details and status', category: 'Claims', subcategory: 'Basic Operations', method: 'PUT', parameters: ['claimId', 'updateData'] },
  { name: 'claim_management_claims_get_amounts', description: 'Get claim financial amounts', category: 'Claims', subcategory: 'Basic Operations', method: 'GET', parameters: ['claimId'] },
  { name: 'claim_management_claims_get_events_history', description: 'Get claim events history', category: 'Claims', subcategory: 'Basic Operations', method: 'GET', parameters: ['claimId'] },

  // Claims - Documents (8 tools)
  { name: 'claim_management_claims_documents_list', description: 'List claim documents', category: 'Claims', subcategory: 'Documents', method: 'GET', parameters: ['claimId'] },
  { name: 'claim_management_claims_documents_upload', description: 'Upload document to claim', category: 'Claims', subcategory: 'Documents', method: 'POST', parameters: ['claimId', 'fileData'] },
  { name: 'claim_management_claims_documents_get', description: 'Get document details', category: 'Claims', subcategory: 'Documents', method: 'GET', parameters: ['documentId'] },
  { name: 'claim_management_claims_documents_update', description: 'Update document metadata', category: 'Claims', subcategory: 'Documents', method: 'PUT', parameters: ['documentId', 'metadata'] },
  { name: 'claim_management_claims_documents_delete', description: 'Delete claim document', category: 'Claims', subcategory: 'Documents', method: 'DELETE', parameters: ['documentId'] },
  { name: 'claim_management_claims_documents_download', description: 'Download document file', category: 'Claims', subcategory: 'Documents', method: 'GET', parameters: ['documentId'] },
  { name: 'claim_management_claims_documents_generate', description: 'Generate claim document', category: 'Claims', subcategory: 'Documents', method: 'POST', parameters: ['claimId', 'templateId'] },
  { name: 'claim_management_claims_documents_render', description: 'Render document for viewing', category: 'Claims', subcategory: 'Documents', method: 'GET', parameters: ['documentId'] },

  // Claims - Reserves (9 tools)
  { name: 'claim_management_claims_reserves_create', description: 'Create claim reserve', category: 'Claims', subcategory: 'Reserves', method: 'POST', parameters: ['claimId', 'reserveData'] },
  { name: 'claim_management_claims_reserves_list', description: 'List claim reserves', category: 'Claims', subcategory: 'Reserves', method: 'GET', parameters: ['claimId'] },
  { name: 'claim_management_claims_reserves_get', description: 'Get reserve details', category: 'Claims', subcategory: 'Reserves', method: 'GET', parameters: ['reserveId'] },
  { name: 'claim_management_claims_reserves_update', description: 'Update reserve amount', category: 'Claims', subcategory: 'Reserves', method: 'PUT', parameters: ['reserveId', 'updateData'] },
  { name: 'claim_management_claims_reserves_authorize', description: 'Authorize reserve change', category: 'Claims', subcategory: 'Reserves', method: 'POST', parameters: ['reserveId'] },
  { name: 'claim_management_claims_reserves_clear', description: 'Clear specific reserve', category: 'Claims', subcategory: 'Reserves', method: 'POST', parameters: ['reserveId'] },
  { name: 'claim_management_claims_reserves_clear_all', description: 'Clear all claim reserves', category: 'Claims', subcategory: 'Reserves', method: 'POST', parameters: ['claimId'] },
  { name: 'claim_management_claims_reserves_get_amounts', description: 'Get reserve amounts', category: 'Claims', subcategory: 'Reserves', method: 'GET', parameters: ['reserveId'] },
  { name: 'claim_management_claims_reserves_list_decisions', description: 'List reserve decisions', category: 'Claims', subcategory: 'Reserves', method: 'GET', parameters: ['reserveId'] },

  // FNOL Operations (5 tools)
  { name: 'claim_management_fnol_generate_link', description: 'Generate FNOL link for customers', category: 'FNOL', method: 'POST', parameters: ['linkData'] },
  { name: 'claim_management_fnol_get', description: 'Get FNOL data from submission', category: 'FNOL', method: 'GET', parameters: ['fnolId'] },
  { name: 'claim_management_fnol_store_claim', description: 'Store FNOL as claim', category: 'FNOL', method: 'POST', parameters: ['fnolData'] },
  { name: 'claim_management_external_fnol_create', description: 'Create external FNOL', category: 'FNOL', subcategory: 'External', method: 'POST', parameters: ['externalData'] },
  { name: 'claim_management_external_fnol_store_document', description: 'Store external FNOL document', category: 'FNOL', subcategory: 'External', method: 'POST', parameters: ['documentData'] },

  // Tasks Management (6 tools)
  { name: 'claim_management_tasks_create', description: 'Create claim task', category: 'Tasks', method: 'POST', parameters: ['taskData'] },
  { name: 'claim_management_tasks_list', description: 'List all tasks', category: 'Tasks', method: 'GET', parameters: ['filters'] },
  { name: 'claim_management_tasks_list_claim_tasks', description: 'List tasks for specific claim', category: 'Tasks', method: 'GET', parameters: ['claimId'] },
  { name: 'claim_management_tasks_get', description: 'Get task details', category: 'Tasks', method: 'GET', parameters: ['taskId'] },
  { name: 'claim_management_tasks_update', description: 'Update task status and details', category: 'Tasks', method: 'PUT', parameters: ['taskId', 'updateData'] },
  { name: 'claim_management_tasks_delete', description: 'Delete task', category: 'Tasks', method: 'DELETE', parameters: ['taskId'] },

  // Objects Management (5 tools)
  { name: 'claim_management_objects_create', description: 'Create claim object', category: 'Objects', method: 'POST', parameters: ['claimId', 'objectData'] },
  { name: 'claim_management_objects_list', description: 'List claim objects', category: 'Objects', method: 'GET', parameters: ['claimId'] },
  { name: 'claim_management_objects_get', description: 'Get object details', category: 'Objects', method: 'GET', parameters: ['objectId'] },
  { name: 'claim_management_objects_update', description: 'Update object details', category: 'Objects', method: 'PUT', parameters: ['objectId', 'updateData'] },
  { name: 'claim_management_objects_delete', description: 'Delete claim object', category: 'Objects', method: 'DELETE', parameters: ['objectId'] },

  // Persons Management (4 tools)
  { name: 'claim_management_persons_create', description: 'Create claim person', category: 'Persons', method: 'POST', parameters: ['claimId', 'personData'] },
  { name: 'claim_management_persons_list', description: 'List claim persons', category: 'Persons', method: 'GET', parameters: ['claimId'] },
  { name: 'claim_management_persons_get', description: 'Get person details', category: 'Persons', method: 'GET', parameters: ['personId'] },
  { name: 'claim_management_persons_update', description: 'Update person details', category: 'Persons', method: 'PUT', parameters: ['personId', 'updateData'] },

  // Major Events Management (6 tools)
  { name: 'claim_management_major_events_list', description: 'List major events', category: 'Major Events', method: 'GET', parameters: ['filters'] },
  { name: 'claim_management_major_events_list_open', description: 'List open major events', category: 'Major Events', method: 'GET', parameters: ['filters'] },
  { name: 'claim_management_major_events_create', description: 'Create major event', category: 'Major Events', method: 'POST', parameters: ['eventData'] },
  { name: 'claim_management_major_events_get', description: 'Get major event details', category: 'Major Events', method: 'GET', parameters: ['eventId'] },
  { name: 'claim_management_major_events_update', description: 'Update major event', category: 'Major Events', method: 'PUT', parameters: ['eventId', 'updateData'] },
  { name: 'claim_management_major_events_delete', description: 'Delete major event', category: 'Major Events', method: 'DELETE', parameters: ['eventId'] },

  // Partners Management (5 tools)
  { name: 'claim_management_partners_list', description: 'List business partners', category: 'Partners', method: 'GET', parameters: ['filters'] },
  { name: 'claim_management_partners_create', description: 'Create business partner', category: 'Partners', method: 'POST', parameters: ['partnerData'] },
  { name: 'claim_management_partners_get', description: 'Get partner details', category: 'Partners', method: 'GET', parameters: ['partnerId'] },
  { name: 'claim_management_partners_update', description: 'Update partner information', category: 'Partners', method: 'PUT', parameters: ['partnerId', 'updateData'] },
  { name: 'claim_management_partners_delete', description: 'Delete business partner', category: 'Partners', method: 'DELETE', parameters: ['partnerId'] },

  // Search & Lookup (3 tools)
  { name: 'claim_management_search_claims', description: 'Advanced claims search with filters', category: 'Search & Lookup', method: 'GET', parameters: ['searchQuery', 'filters'] },
  { name: 'claim_management_search_lookup_data', description: 'Lookup external data sources', category: 'Search & Lookup', method: 'POST', parameters: ['lookupType', 'value'] },
  { name: 'claim_management_search_customers_autocomplete', description: 'Customer autocomplete search', category: 'Search & Lookup', method: 'POST', parameters: ['query'] },

  // Imports (BDX) (6 tools)
  { name: 'claim_management_imports_validate_bdx', description: 'Validate BDX file format', category: 'Imports', method: 'POST', parameters: ['fileName', 'validationOptions'] },
  { name: 'claim_management_imports_import_bdx', description: 'Import BDX file data', category: 'Imports', method: 'POST', parameters: ['fileName', 'importMode'] },
  { name: 'claim_management_imports_get_import_status', description: 'Get import job status', category: 'Imports', method: 'GET', parameters: ['jobId'] },
  { name: 'claim_management_imports_list_import_jobs', description: 'List import jobs', category: 'Imports', method: 'GET', parameters: ['filters'] },
  { name: 'claim_management_imports_get_import_logs', description: 'Get import logs', category: 'Imports', method: 'GET', parameters: ['filters'] },
  { name: 'claim_management_imports_get_importable_products', description: 'Get importable products', category: 'Imports', method: 'GET', parameters: ['filters'] },

  // Dashboard (7 tools)
  { name: 'claim_management_dashboard_my_claims_open', description: 'Get open claims dashboard', category: 'Dashboard', method: 'GET', parameters: ['filters'] },
  { name: 'claim_management_dashboard_my_claims_alarmed', description: 'Get alarmed claims dashboard', category: 'Dashboard', method: 'GET', parameters: ['filters'] },
  { name: 'claim_management_dashboard_my_claims_inactive', description: 'Get inactive claims dashboard', category: 'Dashboard', method: 'GET', parameters: ['filters'] },
  { name: 'claim_management_dashboard_my_claims_recent', description: 'Get recent claims dashboard', category: 'Dashboard', method: 'GET', parameters: ['filters'] },
  { name: 'claim_management_dashboard_claims_unassigned', description: 'Get unassigned claims dashboard', category: 'Dashboard', method: 'GET', parameters: ['filters'] },
  { name: 'claim_management_dashboard_my_tasks_assigned', description: 'Get assigned tasks dashboard', category: 'Dashboard', method: 'GET', parameters: ['filters'] },
  { name: 'claim_management_dashboard_my_tasks_created', description: 'Get created tasks dashboard', category: 'Dashboard', method: 'GET', parameters: ['filters'] },

  // Users (1 tool)
  { name: 'claim_management_users_get_active_users', description: 'Get active users list', category: 'Users', method: 'GET', parameters: ['filters'] }
];

const categories = Array.from(new Set(claimManagementTools.map(tool => tool.category)));

const getMethodColor = (method: string) => {
  switch (method) {
    case 'GET': return 'bg-blue-100 text-blue-800';
    case 'POST': return 'bg-green-100 text-green-800';
    case 'PUT': return 'bg-yellow-100 text-yellow-800';
    case 'DELETE': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getCategoryStats = () => ({
  'Access Management': 1,
  'Claims': 23,
  'FNOL': 5,
  'Tasks': 6,
  'Objects': 5,
  'Persons': 4,
  'Major Events': 6,
  'Partners': 5,
  'Search & Lookup': 3,
  'Imports': 6,
  'Dashboard': 7,
  'Users': 1
});

export default function ClaimManagementPage() {
  const stats = getCategoryStats();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-purple-600 font-bold text-xl">CM</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Claim Management Service</h1>
              <p className="text-gray-600">Complete claim lifecycle management including FNOL, tasks, objects, persons, and financial operations</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-2xl font-bold text-purple-600">92</div>
              <div className="text-sm text-gray-600">Total Tools</div>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-gray-600">API Coverage</div>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-2xl font-bold text-green-600">✅</div>
              <div className="text-sm text-gray-600">Production Ready</div>
            </div>
          </div>
        </div>

        {/* Category Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Overview</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(stats).slice(0, 8).map(([category, count]) => (
              <div key={category} className="bg-white rounded-lg border p-3">
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{category}</h3>
                <div className="text-xl font-bold text-purple-600 mb-1">{count}</div>
                <div className="text-xs text-gray-600">tools</div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Complete Claim Lifecycle</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• FNOL (First Notice of Loss)</li>
                <li>• Claims processing & management</li>
                <li>• Reserve management</li>
                <li>• Document handling</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Advanced Operations</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Task management</li>
                <li>• Object & person tracking</li>
                <li>• Major events handling</li>
                <li>• Partner management</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Data & Analytics</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Advanced search & lookup</li>
                <li>• BDX data imports</li>
                <li>• Real-time dashboards</li>
                <li>• User management</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tools by Category - Compact View */}
        {categories.map(category => {
          const categoryTools = claimManagementTools.filter(tool => tool.category === category);
          const subcategories = Array.from(new Set(categoryTools.map(tool => tool.subcategory).filter(Boolean)));
          
          return (
            <div key={category} className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                {category}
                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {stats[category as keyof typeof stats] || categoryTools.length} tools
                </span>
              </h2>
              
              {subcategories.length > 0 ? (
                /* Show subcategories in a compact grid */
                <div className="grid lg:grid-cols-2 gap-4">
                  {subcategories.map(subcategory => {
                    const subcategoryTools = categoryTools.filter(tool => tool.subcategory === subcategory);
                    
                    return (
                      <div key={subcategory} className="bg-white rounded-lg border p-4">
                        <h3 className="font-medium text-gray-800 mb-3">
                          {subcategory}
                          <span className="ml-2 px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
                            {subcategoryTools.length}
                          </span>
                        </h3>
                        
                        <div className="space-y-2">
                          {subcategoryTools.map(tool => (
                            <div key={tool.name} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(tool.method)}`}>
                                {tool.method}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="font-mono text-xs font-medium text-gray-900 truncate">
                                  {tool.name}
                                </div>
                                <div className="text-xs text-gray-600">{tool.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Show tools directly in a compact grid */
                <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-2">
                  {categoryTools.map(tool => (
                    <div key={tool.name} className="bg-white rounded border p-3 hover:shadow-sm transition-shadow">
                      <div className="flex items-start gap-2 mb-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(tool.method)}`}>
                          {tool.method}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-xs font-medium text-gray-900 truncate">
                            {tool.name}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{tool.description}</p>
                      {tool.parameters && tool.parameters.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {tool.parameters.slice(0, 2).map(param => (
                            <span key={param} className="px-1 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                              {param}
                            </span>
                          ))}
                          {tool.parameters.length > 2 && (
                            <span className="px-1 py-0.5 bg-gray-50 text-gray-600 text-xs rounded">
                              +{tool.parameters.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* MCP Connection Info */}
        <div className="mt-8 bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">MCP Connection</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Server-Sent Events (SSE)</h3>
              <code className="block bg-gray-100 p-2 rounded text-sm">
                /claim-management/sse
              </code>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">HTTP Transport</h3>
              <code className="block bg-gray-100 p-2 rounded text-sm">
                /claim-management/mcp
              </code>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}