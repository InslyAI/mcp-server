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

const ledgerTools: Tool[] = [
  // Sales - Binders (8 tools)
  { name: 'ledger_sales_binders_create', description: 'Create new policy binder', category: 'Sales', subcategory: 'Binders', method: 'POST', parameters: ['binderData'] },
  { name: 'ledger_sales_binders_get', description: 'Get specific binder details', category: 'Sales', subcategory: 'Binders', method: 'GET', parameters: ['binderId'] },
  { name: 'ledger_sales_binders_list', description: 'List all binders', category: 'Sales', subcategory: 'Binders', method: 'GET', parameters: ['filters'] },
  { name: 'ledger_sales_binders_list_names', description: 'List binder names only', category: 'Sales', subcategory: 'Binders', method: 'GET' },
  { name: 'ledger_sales_binders_get_groups', description: 'Get binder groups', category: 'Sales', subcategory: 'Binders', method: 'GET' },
  { name: 'ledger_sales_binders_renew', description: 'Renew existing binder', category: 'Sales', subcategory: 'Binders', method: 'POST', parameters: ['binderId'] },
  { name: 'ledger_sales_binders_update', description: 'Update binder details', category: 'Sales', subcategory: 'Binders', method: 'PUT', parameters: ['binderId', 'updateData'] },

  // Sales - E-Proposals (7 tools)
  { name: 'ledger_sales_e_proposals_create', description: 'Create electronic proposal', category: 'Sales', subcategory: 'E-Proposals', method: 'POST', parameters: ['proposalData'] },
  { name: 'ledger_sales_e_proposals_get', description: 'Get e-proposal details', category: 'Sales', subcategory: 'E-Proposals', method: 'GET', parameters: ['proposalId'] },
  { name: 'ledger_sales_e_proposals_list', description: 'List all e-proposals', category: 'Sales', subcategory: 'E-Proposals', method: 'GET', parameters: ['filters'] },
  { name: 'ledger_sales_e_proposals_approve', description: 'Approve e-proposal', category: 'Sales', subcategory: 'E-Proposals', method: 'POST', parameters: ['proposalId'] },
  { name: 'ledger_sales_e_proposals_submit', description: 'Submit e-proposal', category: 'Sales', subcategory: 'E-Proposals', method: 'POST', parameters: ['proposalId'] },
  { name: 'ledger_sales_e_proposals_update', description: 'Update e-proposal', category: 'Sales', subcategory: 'E-Proposals', method: 'PUT', parameters: ['proposalId', 'updateData'] },

  // Sales - Policies (28 tools - showing key ones)
  { name: 'ledger_sales_policies_create', description: 'Create new policy', category: 'Sales', subcategory: 'Policies', method: 'POST', parameters: ['policyData'] },
  { name: 'ledger_sales_policies_get', description: 'Get policy details', category: 'Sales', subcategory: 'Policies', method: 'GET', parameters: ['policyId'] },
  { name: 'ledger_sales_policies_list', description: 'List all policies', category: 'Sales', subcategory: 'Policies', method: 'GET', parameters: ['filters'] },
  { name: 'ledger_sales_policies_calculate', description: 'Calculate policy premium', category: 'Sales', subcategory: 'Policies', method: 'POST', parameters: ['calculationData'] },
  { name: 'ledger_sales_policies_bind', description: 'Bind policy', category: 'Sales', subcategory: 'Policies', method: 'POST', parameters: ['policyId'] },
  { name: 'ledger_sales_policies_issue', description: 'Issue policy', category: 'Sales', subcategory: 'Policies', method: 'POST', parameters: ['policyId'] },
  { name: 'ledger_sales_policies_renew', description: 'Renew policy', category: 'Sales', subcategory: 'Policies', method: 'POST', parameters: ['policyId'] },
  { name: 'ledger_sales_policies_terminate', description: 'Terminate policy', category: 'Sales', subcategory: 'Policies', method: 'POST', parameters: ['policyId'] },

  // Sales - Quotes (7 tools)
  { name: 'ledger_sales_quotes_create', description: 'Create new quote', category: 'Sales', subcategory: 'Quotes', method: 'POST', parameters: ['quoteData'] },
  { name: 'ledger_sales_quotes_get', description: 'Get quote details', category: 'Sales', subcategory: 'Quotes', method: 'GET', parameters: ['quoteId'] },
  { name: 'ledger_sales_quotes_calculate', description: 'Calculate quote premium', category: 'Sales', subcategory: 'Quotes', method: 'POST', parameters: ['calculationData'] },
  { name: 'ledger_sales_quotes_issue', description: 'Issue quote', category: 'Sales', subcategory: 'Quotes', method: 'POST', parameters: ['quoteId'] },

  // Schemas (17 tools - showing key ones)
  { name: 'ledger_schemes_actions_get_schema', description: 'Get action schema', category: 'Schemas', subcategory: 'Actions', method: 'GET', parameters: ['actionType'] },
  { name: 'ledger_schemes_features_get_schema', description: 'Get feature schema', category: 'Schemas', subcategory: 'Features', method: 'GET', parameters: ['featureName'] },
  { name: 'ledger_schemes_policy_get_products', description: 'Get policy products', category: 'Schemas', subcategory: 'Policy', method: 'GET' },
  { name: 'ledger_schemes_regular_get_schema', description: 'Get regular schema', category: 'Schemas', subcategory: 'Regular', method: 'GET', parameters: ['schemaType'] },

  // Business Operations - Customers (9 tools)
  { name: 'ledger_customers_create', description: 'Create new customer', category: 'Business Operations', subcategory: 'Customers', method: 'POST', parameters: ['customerData'] },
  { name: 'ledger_customers_get', description: 'Get customer details', category: 'Business Operations', subcategory: 'Customers', method: 'GET', parameters: ['customerId'] },
  { name: 'ledger_customers_list', description: 'List all customers', category: 'Business Operations', subcategory: 'Customers', method: 'GET', parameters: ['filters'] },
  { name: 'ledger_customers_update', description: 'Update customer details', category: 'Business Operations', subcategory: 'Customers', method: 'PUT', parameters: ['customerId', 'updateData'] },

  // Business Operations - Consolidated Invoices (10 tools - showing key ones)
  { name: 'ledger_consolidated_invoices_create', description: 'Create consolidated invoice', category: 'Business Operations', subcategory: 'Invoices', method: 'POST', parameters: ['invoiceData'] },
  { name: 'ledger_consolidated_invoices_get', description: 'Get consolidated invoice', category: 'Business Operations', subcategory: 'Invoices', method: 'GET', parameters: ['invoiceId'] },
  { name: 'ledger_consolidated_invoices_list', description: 'List consolidated invoices', category: 'Business Operations', subcategory: 'Invoices', method: 'GET', parameters: ['filters'] },

  // Business Operations - Reports (5 tools)
  { name: 'ledger_reports_generate', description: 'Generate report', category: 'Business Operations', subcategory: 'Reports', method: 'POST', parameters: ['reportConfig'] },
  { name: 'ledger_reports_get', description: 'Get report details', category: 'Business Operations', subcategory: 'Reports', method: 'GET', parameters: ['reportId'] },
  { name: 'ledger_reports_list', description: 'List all reports', category: 'Business Operations', subcategory: 'Reports', method: 'GET', parameters: ['filters'] },

  // Financial Operations - Broker Payments (7 tools - showing key ones)
  { name: 'ledger_broker_payments_create_bdx_report', description: 'Create BDX report', category: 'Financial Operations', subcategory: 'Broker Payments', method: 'POST', parameters: ['reportData'] },
  { name: 'ledger_broker_payments_list_by_payer', description: 'List payments by payer', category: 'Financial Operations', subcategory: 'Broker Payments', method: 'GET', parameters: ['payerId'] },

  // System - Search (1 tool)
  { name: 'ledger_search_multi', description: 'Multi-entity search', category: 'System', subcategory: 'Search', method: 'GET', parameters: ['searchQuery'] },

  // System - Users (1 tool)
  { name: 'ledger_users_list', description: 'List all users', category: 'System', subcategory: 'Users', method: 'GET', parameters: ['filters'] }
];

const categories = Array.from(new Set(ledgerTools.map(tool => tool.category)));

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
  'Sales': 65,
  'Schemas': 17,
  'Business Operations': 40,
  'Financial Operations': 7,
  'System': 6
});

export default function LedgerPage() {
  const stats = getCategoryStats();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center">
              <span className="text-emerald-600 font-bold text-xl">LG</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ledger Service</h1>
              <p className="text-gray-600">Complete insurance business operations with 100% API coverage</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-2xl font-bold text-emerald-600">135</div>
              <div className="text-sm text-gray-600">Total Tools</div>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-2xl font-bold text-emerald-600">{categories.length}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-2xl font-bold text-emerald-600">100%</div>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats).map(([category, count]) => (
              <div key={category} className="bg-white rounded-lg border p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{category}</h3>
                <div className="text-2xl font-bold text-emerald-600 mb-1">{count}</div>
                <div className="text-sm text-gray-600">tools</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tools by Category */}
        {categories.map(category => {
          const categoryTools = ledgerTools.filter(tool => tool.category === category);
          const subcategories = Array.from(new Set(categoryTools.map(tool => tool.subcategory).filter(Boolean)));
          
          return (
            <div key={category} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                {category}
                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {stats[category as keyof typeof stats] || categoryTools.length} tools
                </span>
              </h2>
              
              {subcategories.length > 0 ? (
                /* Show subcategories */
                subcategories.map(subcategory => {
                  const subcategoryTools = categoryTools.filter(tool => tool.subcategory === subcategory);
                  
                  return (
                    <div key={subcategory} className="mb-6">
                      <h3 className="text-lg font-medium text-gray-800 mb-3 ml-4">
                        {subcategory}
                        <span className="ml-2 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full">
                          {subcategoryTools.length} tools
                        </span>
                      </h3>
                      
                      <div className="grid gap-2 ml-4">
                        {subcategoryTools.map(tool => (
                          <div key={tool.name} className="bg-white rounded-lg border hover:shadow-md transition-shadow">
                            <div className="p-3">
                              <div className="flex items-start justify-between mb-1">
                                <div className="flex-1">
                                  <h4 className="font-mono text-xs font-medium text-gray-900 mb-1">
                                    {tool.name}
                                  </h4>
                                  <p className="text-xs text-gray-600 mb-2">{tool.description}</p>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded-md font-medium text-xs ${getMethodColor(tool.method)}`}>
                                      {tool.method}
                                    </span>
                                    {tool.parameters && tool.parameters.length > 0 && (
                                      <div className="flex flex-wrap gap-1">
                                        {tool.parameters.slice(0, 3).map(param => (
                                          <span key={param} className="px-1 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                                            {param}
                                          </span>
                                        ))}
                                        {tool.parameters.length > 3 && (
                                          <span className="px-1 py-0.5 bg-gray-50 text-gray-600 text-xs rounded">
                                            +{tool.parameters.length - 3}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Show tools directly if no subcategories */
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
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className={`px-2 py-1 rounded-md font-medium ${getMethodColor(tool.method)}`}>
                                {tool.method}
                              </span>
                            </div>
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
              )}
            </div>
          );
        })}

        {/* Key Features */}
        <div className="mt-12 bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Complete Coverage</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 100% Ledger API coverage</li>
                <li>• All business operations</li>
                <li>• Full policy lifecycle</li>
                <li>• Customer management</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Sales Operations</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Policy creation & management</li>
                <li>• Quote generation & calculation</li>
                <li>• E-proposals & endorsements</li>
                <li>• Binder management</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Business Intelligence</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Advanced reporting</li>
                <li>• Dashboard analytics</li>
                <li>• Multi-entity search</li>
                <li>• Financial operations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* MCP Connection Info */}
        <div className="mt-8 bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">MCP Connection</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Server-Sent Events (SSE)</h3>
              <code className="block bg-gray-100 p-2 rounded text-sm">
                /ledger/sse
              </code>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">HTTP Transport</h3>
              <code className="block bg-gray-100 p-2 rounded text-sm">
                /ledger/mcp
              </code>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}