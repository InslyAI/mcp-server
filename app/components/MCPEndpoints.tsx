export default function MCPEndpoints() {
  return (
    <section id="endpoints" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">MCP Server</h2>
          <p className="text-xl text-gray-600">
            Model Context Protocol (MCP) service for Insly's applications
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          <a
            href="#formflow-tools"
            className="insly-card hover:shadow-lg transition-shadow cursor-pointer"
          >
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
              <strong>27 tools</strong> for insurance document processing, AI
              extraction, and form management.
            </p>
            <div className="text-xs text-green-600 font-semibold">
              ✅ Production Ready
            </div>
          </a>

          <a
            href="#identifier-tools"
            className="insly-card hover:shadow-lg transition-shadow cursor-pointer"
          >
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
          </a>

          <a
            href="#ledger-tools"
            className="insly-card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-emerald-600 font-bold text-xs">LG</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Ledger Service
                </h3>
                <code className="text-xs text-gray-600">/ledger/[sse|mcp]</code>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              <strong>135 tools</strong> providing complete insurance business
              operations with 100% API coverage.
            </p>
            <div className="text-xs text-green-600 font-semibold">
              ✅ Production Ready
            </div>
          </a>

          <a
            href="#claim-management-tools"
            className="insly-card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-purple-600 font-bold text-xs">CM</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Claim Management
                </h3>
                <code className="text-xs text-gray-600">/claim-management/[sse|mcp]</code>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              <strong>66 tools</strong> for complete claim lifecycle management 
              including FNOL, tasks, objects, persons, and financial operations (Phase 4).
            </p>
            <div className="text-xs text-green-600 font-semibold">
              ✅ Production Ready
            </div>
          </a>

          <a
            href="#tools"
            className="insly-card hover:shadow-lg transition-shadow cursor-pointer"
          >
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
              <strong>231 tools</strong> from all services in a single
              connection for comprehensive access.
            </p>
            <div className="text-xs text-green-600 font-semibold">
              ✅ Production Ready
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
