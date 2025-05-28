export default function MCPEndpoints() {
  return (
    <section id="endpoints" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <a
            href="/formflow"
            className="insly-card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-orange-600 font-bold text-xs">FF</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  FormFlow
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
            href="/identifier"
            className="insly-card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold text-xs">ID</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Identifier
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
            href="/ledger"
            className="insly-card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-emerald-600 font-bold text-xs">LG</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Ledger</h3>
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
            href="/claim-management"
            className="insly-card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-purple-600 font-bold text-xs">CM</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Claims</h3>
                <code className="text-xs text-gray-600">
                  /claim-management/[sse|mcp]
                </code>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              <strong>92 tools</strong> for complete claim lifecycle management
              including FNOL, tasks, objects, persons, and financial operations.
            </p>
            <div className="text-xs text-green-600 font-semibold">
              ✅ Production Ready
            </div>
          </a>

          <a
            href="/site-service"
            className="insly-card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-yellow-600 font-bold text-xs">SS</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Site Service</h3>
                <code className="text-xs text-gray-600">
                  /site-service/[sse|mcp]
                </code>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              <strong>32 tools</strong> for tenant configuration management,
              features, products, schemes, and static documents.
            </p>
            <div className="text-xs text-green-600 font-semibold">
              ✅ Production Ready
            </div>
          </a>

          <a
            href="/"
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
              <strong>289 tools</strong> from all services in a single
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
