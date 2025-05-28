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

const identifierTools: Tool[] = [
  {
    name: 'identifier_client_credentials',
    description: 'Authenticate using client credentials (API key and secret) to obtain access token',
    category: 'Authentication',
    method: 'POST',
    endpoint: '/oauth/token',
    parameters: ['clientId', 'clientSecret', 'scope']
  },
  {
    name: 'identifier_login',
    description: 'User login with username/password to obtain JWT bearer token and user session',
    category: 'Authentication',
    method: 'POST',
    endpoint: '/auth/login',
    parameters: ['username', 'password', 'tenantId', 'rememberMe']
  },
  {
    name: 'identifier_refresh_token',
    description: 'Refresh expired JWT token using refresh token to maintain session',
    category: 'Authentication',
    method: 'POST',
    endpoint: '/auth/refresh',
    parameters: ['refreshToken', 'tenantId']
  }
];

const categories = Array.from(new Set(identifierTools.map(tool => tool.category)));

const getMethodColor = (method: string) => {
  switch (method) {
    case 'GET': return 'bg-blue-100 text-blue-800';
    case 'POST': return 'bg-green-100 text-green-800';
    case 'PUT': return 'bg-yellow-100 text-yellow-800';
    case 'DELETE': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function IdentifierPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">ID</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Identifier Service</h1>
              <p className="text-gray-600">Authentication and identity management with the Insly platform</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-2xl font-bold text-blue-600">{identifierTools.length}</div>
              <div className="text-sm text-gray-600">Total Tools</div>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-2xl font-bold text-green-600">✅</div>
              <div className="text-sm text-gray-600">Production Ready</div>
            </div>
          </div>
        </div>

        {/* Authentication Features */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication Methods</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Client Credentials Flow</h3>
              <p className="text-sm text-gray-600 mb-3">
                Server-to-server authentication using API key and secret. Ideal for backend services and automated workflows.
              </p>
              <div className="text-xs text-blue-600">OAuth 2.0 Compatible</div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold text-gray-900 mb-2">User Login Flow</h3>
              <p className="text-sm text-gray-600 mb-3">
                Interactive user authentication with username/password. Returns JWT tokens with user context and permissions.
              </p>
              <div className="text-xs text-blue-600">JWT with Refresh</div>
            </div>
          </div>
        </div>

        {/* Tools by Category */}
        {categories.map(category => {
          const categoryTools = identifierTools.filter(tool => tool.category === category);
          
          return (
            <div key={category} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
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

        {/* Security Features */}
        <div className="mt-8 bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Token Security</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• JWT tokens with configurable expiration</li>
                <li>• Refresh token rotation</li>
                <li>• Secure token storage recommendations</li>
                <li>• Token revocation support</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Multi-Tenant Support</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Tenant-specific authentication</li>
                <li>• Isolated user contexts</li>
                <li>• Cross-tenant access controls</li>
                <li>• Tenant-aware token validation</li>
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
                /identifier/sse
              </code>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">HTTP Transport</h3>
              <code className="block bg-gray-100 p-2 rounded text-sm">
                /identifier/mcp
              </code>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}