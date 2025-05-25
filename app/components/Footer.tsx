export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center mb-4">
              <img src="/insly-logo.png" alt="Insly" className="h-8 w-auto mr-3" />
              <span className="text-xl font-bold">MCP Server</span>
            </div>
            <p className="text-gray-400 mb-4">
              AI-powered insurance operations platform with comprehensive API coverage across FormFlow, Identifier, and Ledger services.
            </p>
            <div className="flex space-x-4">
              <span className="text-sm text-gray-400">190 Total Tools</span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-400">100% API Coverage</span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-400">Production Ready</span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>FormFlow (25 tools)</li>
              <li>Identifier (3 tools)</li>
              <li>Ledger (162 tools)</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Transport</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Server-Sent Events (SSE)</li>
              <li>HTTP Request/Response</li>
              <li>WebSocket Support</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2024 Insly. Powered by Model Context Protocol (MCP).</p>
        </div>
      </div>
    </footer>
  );
}