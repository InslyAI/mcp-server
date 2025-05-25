export default function IdentifierTools() {
  return (
    <div id="identifier-tools" className="mb-20">
      <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl p-8 mb-12">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mr-6">
            <span className="text-blue-600 font-bold text-xl">ID</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Identifier Service Tools (3 Total)
            </h2>
            <p className="text-lg text-gray-600">
              Enterprise authentication and identity management for secure platform access
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <span className="text-gray-700">Endpoint: <code className="text-blue-600 bg-blue-50 px-2 py-1 rounded">/identifier/[sse|mcp]</code></span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <span className="text-gray-700">Status: Production Ready</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            🔐
          </span>
          Authentication & Identity Management
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-blue-100">
            <div className="flex items-start justify-between mb-3">
              <div className="text-lg font-semibold text-blue-600 font-mono">
                identifier_login
              </div>
              <div className="px-2 py-1 bg-orange-50 text-orange-600 text-xs rounded-full font-medium">
                AUTH
              </div>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed">
              Username/password authentication with JWT bearer token generation for secure API access
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-blue-100">
            <div className="flex items-start justify-between mb-3">
              <div className="text-lg font-semibold text-blue-600 font-mono">
                identifier_client_credentials
              </div>
              <div className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-full font-medium">
                CLIENT
              </div>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed">
              Client credentials flow authentication for service-to-service communication
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-blue-100">
            <div className="flex items-start justify-between mb-3">
              <div className="text-lg font-semibold text-blue-600 font-mono">
                identifier_refresh_token
              </div>
              <div className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full font-medium">
                REFRESH
              </div>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed">
              Token refresh mechanism for seamless session management and extended access
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}