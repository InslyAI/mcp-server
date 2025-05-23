export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            insly.ai MCP Server
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            AI-powered Model Context Protocol server for insly.com insurance platform
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">🔧 MCP Tools</h3>
              <p className="text-blue-700 text-sm">
                Modular insurance AI tools for policy management, claims processing, and underwriting support
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">🚀 Production Ready</h3>
              <p className="text-green-700 text-sm">
                Deployed on Vercel with Redis support for real-time SSE transport
              </p>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Endpoints</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center bg-gray-50 rounded px-4 py-2">
                <code className="text-gray-800">/sse</code>
                <span className="text-gray-600">Server-Sent Events</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 rounded px-4 py-2">
                <code className="text-gray-800">/mcp</code>
                <span className="text-gray-600">HTTP Transport</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-gray-500">
              Powered by{' '}
              <a 
                href="https://insly.com" 
                className="text-blue-600 hover:text-blue-800 font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                insly.com
              </a>
              {' '}insurance platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}