export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center mb-4">
              <img
                src="/insly-logo.png"
                alt="Insly"
                className="h-8 w-auto mr-3"
              />
            </div>
            <p className="text-gray-400 mb-4">Model Context Protocol (MCP) server for Insly's AI-powered insurance platform</p>
            <div className="flex flex-wrap gap-4">
              <span className="text-sm text-gray-400">257 Total Tools</span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-400">100% API Coverage</span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-400">Production Ready</span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/formflow" className="insly-footer-link">FormFlow (27 tools)</a></li>
              <li><a href="/identifier" className="insly-footer-link">Identifier (3 tools)</a></li>
              <li><a href="/ledger" className="insly-footer-link">Ledger (135 tools)</a></li>
              <li><a href="/claim-management" className="insly-footer-link">Claim Management (92 tools)</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="insly-footer-link">Home</a></li>
              <li><a href="https://insly.com" className="insly-footer-link" target="_blank" rel="noopener noreferrer">Insly Platform</a></li>
              <li><a href="https://docs.anthropic.com/en/docs/claude-code" className="insly-footer-link" target="_blank" rel="noopener noreferrer">Claude Code Docs</a></li>
              <li><a href="https://spec.modelcontextprotocol.io" className="insly-footer-link" target="_blank" rel="noopener noreferrer">MCP Specification</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">MCP Endpoints</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Server-Sent Events (SSE)</li>
              <li>HTTP Request/Response</li>
              <li>Service-Specific Endpoints</li>
              <li>Unified Access Point</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2025 Insly</p>
        </div>
      </div>
    </footer>
  );
}
