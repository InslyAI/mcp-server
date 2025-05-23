'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/insly-logo.png" 
                alt="Insly" 
                className="h-8 w-auto"
              />
              <div className="text-2xl font-bold" style={{ color: 'var(--insly-black)' }}>
                <span style={{ color: 'var(--insly-orange)' }}>insly</span>.ai
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="insly-nav-link">
                Features
              </a>
              <a href="#tools" className="insly-nav-link">
                Tools
              </a>
              <a 
                href="https://insly.com" 
                className="insly-nav-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Main Platform
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, var(--insly-light-gray) 0%, white 100%)' }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: 'var(--insly-black)' }}>
            <span className="insly-gradient-text">AI-Powered</span>
            <br />
            Insurance Platform
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto" style={{ color: 'var(--insly-medium-gray)' }}>
            Advanced Model Context Protocol server providing intelligent automation and AI-driven tools 
            for insurance operations, document processing, and workflow optimization.
          </p>
          
          {/* Stats */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold" style={{ color: 'var(--insly-orange)' }}>20</div>
              <div style={{ color: 'var(--insly-medium-gray)' }}>FormFlow Tools</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold" style={{ color: 'var(--insly-orange)' }}>60</div>
              <div style={{ color: 'var(--insly-medium-gray)' }}>Requests/Min</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold" style={{ color: 'var(--insly-orange)' }}>24/7</div>
              <div style={{ color: 'var(--insly-medium-gray)' }}>AI Processing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--insly-black)' }}>
              Intelligent Insurance Solutions
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--insly-medium-gray)' }}>
              Comprehensive MCP integration with FormFlow for document processing, 
              AI-powered data extraction, and automated insurance workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="insly-card">
              <div className="w-16 h-16 insly-gradient rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--insly-black)' }}>AI Document Processing</h3>
              <p style={{ color: 'var(--insly-medium-gray)' }}>
                Advanced AI extraction of structured data from insurance documents with 
                intelligent form processing and automated metadata generation.
              </p>
            </div>

            <div className="insly-card">
              <div className="w-16 h-16 insly-gradient rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Form Management</h3>
              <p className="text-gray-600">
                Complete submission lifecycle management with template creation, 
                updates, and real-time processing event tracking.
              </p>
            </div>

            <div className="insly-card">
              <div className="w-16 h-16 insly-gradient rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure Authentication</h3>
              <p className="text-gray-600">
                Dual authentication support with JWT bearer tokens and credential-based 
                access for enhanced security and flexibility.
              </p>
            </div>

            <div className="insly-card">
              <div className="w-16 h-16 insly-gradient rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Webhook Integration</h3>
              <p className="text-gray-600">
                Real-time event notifications with comprehensive webhook management 
                for seamless system integrations.
              </p>
            </div>

            <div className="insly-card">
              <div className="w-16 h-16 insly-gradient rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">☁️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Cloud Storage</h3>
              <p className="text-gray-600">
                Secure S3 file management with temporary upload URLs and 
                comprehensive file lifecycle operations.
              </p>
            </div>

            <div className="insly-card">
              <div className="w-16 h-16 insly-gradient rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">High Performance</h3>
              <p className="text-gray-600">
                Optimized for insurance operations with rate limiting awareness 
                and enterprise-grade reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MCP Tools Section */}
      <section id="tools" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Available MCP Tools</h2>
            <p className="text-xl text-gray-600">
              Comprehensive suite of insurance-focused AI tools and integrations
            </p>
          </div>

          {/* Tool Categories */}
          <div className="space-y-12">
            {/* Authentication Tools */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">🔑 Authentication & Token Management</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4" style={{ border: '1px solid var(--insly-border)' }}>
                  <div className="font-semibold mb-2" style={{ color: 'var(--insly-orange)' }}>formflow_exchange_token</div>
                  <div className="text-sm" style={{ color: 'var(--insly-medium-gray)' }}>Exchange credentials for JWT bearer token</div>
                </div>
              </div>
            </div>

            {/* Submission Tools */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">📄 Submission Management</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">formflow_list_submissions</div>
                  <div className="text-sm text-gray-600">List submissions with filtering and pagination</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">formflow_create_submission</div>
                  <div className="text-sm text-gray-600">Create new form submissions</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">formflow_get_submission</div>
                  <div className="text-sm text-gray-600">Retrieve submission details by ID</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">formflow_update_submission</div>
                  <div className="text-sm text-gray-600">Update submission details and metadata</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">formflow_get_submission_references</div>
                  <div className="text-sm text-gray-600">Get AI-generated document references</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">formflow_get_submission_events</div>
                  <div className="text-sm text-gray-600">Track processing lifecycle events</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">formflow_get_upload_url</div>
                  <div className="text-sm text-gray-600">Get S3 upload URLs for files</div>
                </div>
              </div>
            </div>

            {/* Template Tools */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">📋 Template Management</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">formflow_list_templates</div>
                  <div className="text-sm text-gray-600">List available form templates</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">formflow_get_template</div>
                  <div className="text-sm text-gray-600">Get template details by ID</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">formflow_create_template</div>
                  <div className="text-sm text-gray-600">Create new form templates</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">formflow_update_template</div>
                  <div className="text-sm text-gray-600">Update template configuration</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">formflow_delete_template</div>
                  <div className="text-sm text-gray-600">Soft delete templates</div>
                </div>
              </div>
            </div>

            {/* AI Tools */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">🤖 AI-Powered Features</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">formflow_ai_extract_data</div>
                  <div className="text-sm text-gray-600">AI-powered document data extraction</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">formflow_ai_generate_metadata</div>
                  <div className="text-sm text-gray-600">Generate AI-driven submission metadata</div>
                </div>
              </div>
            </div>

            {/* Webhook Tools */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">🔗 Webhook Management</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">formflow_create_webhook</div>
                  <div className="text-sm text-gray-600">Create webhook subscriptions</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">formflow_list_webhooks</div>
                  <div className="text-sm text-gray-600">List webhook subscriptions</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">formflow_get_webhook</div>
                  <div className="text-sm text-gray-600">Get webhook details by ID</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">formflow_update_webhook</div>
                  <div className="text-sm text-gray-600">Update webhook configuration</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">formflow_delete_webhook</div>
                  <div className="text-sm text-gray-600">Delete webhook subscriptions</div>
                </div>
              </div>
            </div>

            {/* File Management */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">📁 File Management</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">formflow_get_file</div>
                  <div className="text-sm text-gray-600">Get file metadata and details</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-orange-600 mb-2">formflow_delete_file</div>
                  <div className="text-sm text-gray-600">Delete files permanently</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Endpoints Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">MCP Endpoints</h2>
            <p className="text-xl text-gray-600">
              Connect to our Model Context Protocol server using these endpoints
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="insly-card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-orange-600 font-bold">SSE</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Server-Sent Events</h3>
                  <code className="text-sm text-gray-600">/sse</code>
                </div>
              </div>
              <p className="text-gray-600">
                Real-time communication with streaming responses for live updates and notifications.
              </p>
            </div>

            <div className="insly-card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-emerald-600 font-bold">HTTP</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">HTTP Transport</h3>
                  <code className="text-sm text-gray-600">/mcp</code>
                </div>
              </div>
              <p className="text-gray-600">
                Standard request/response pattern for traditional API integration and compatibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/insly-logo.png" 
                  alt="Insly" 
                  className="h-8 w-auto brightness-0 invert"
                />
                <div className="text-2xl font-bold text-white">
                  <span style={{ color: 'var(--insly-orange)' }}>insly</span>.ai
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                AI-powered Model Context Protocol server for the insurance industry
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--insly-orange)' }}>Platform</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://insly.com" 
                    className="insly-footer-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    insly.com
                  </a>
                </li>
                <li>
                  <a 
                    href="https://develop.formflow-dev.net" 
                    className="insly-footer-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    FormFlow
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--insly-orange)' }}>Documentation</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#tools" className="insly-footer-link">
                    Available Tools
                  </a>
                </li>
                <li>
                  <a href="#features" className="insly-footer-link">
                    Features
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 insly.ai - AI Assistant for Insurance Operations
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}