export default function LedgerTools() {
  return (
    <div id="ledger-tools" className="mb-20">
      <div className="bg-gradient-to-r from-green-50 to-white rounded-2xl p-8 mb-12">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mr-6">
            <span className="text-green-600 font-bold text-xl">📊</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Ledger Service Tools (162 Total) - Complete API Coverage
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive insurance business operations platform with complete API coverage across all domains
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <span className="text-gray-700">Endpoint: <code className="text-green-600 bg-green-50 px-2 py-1 rounded">/ledger/[sse|mcp]</code></span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <span className="text-gray-700">Status: Production Ready - 100% API Coverage</span>
          </div>
        </div>
      </div>

      {/* Policies - Core Business Operations */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
            📋
          </span>
          Policies (33 Tools) - Complete Policy Lifecycle
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-green-100">
            <div className="flex items-start justify-between mb-3">
              <div className="text-lg font-semibold text-green-600 font-mono">
                ledger_create_policy
              </div>
              <div className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full font-medium">
                CREATE
              </div>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed">
              Create new insurance policies with comprehensive coverage details and risk assessment
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-green-100">
            <div className="flex items-start justify-between mb-3">
              <div className="text-lg font-semibold text-green-600 font-mono">
                ledger_get_policy
              </div>
              <div className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">
                READ
              </div>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed">
              Retrieve detailed policy information including coverage, terms, and current status
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-green-100">
            <div className="flex items-start justify-between mb-3">
              <div className="text-lg font-semibold text-green-600 font-mono">
                ledger_update_policy
              </div>
              <div className="px-2 py-1 bg-yellow-50 text-yellow-600 text-xs rounded-full font-medium">
                UPDATE
              </div>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed">
              Modify existing policy details, coverage amounts, and beneficiary information
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-green-100">
            <div className="flex items-start justify-between mb-3">
              <div className="text-lg font-semibold text-green-600 font-mono">
                ledger_list_policies
              </div>
              <div className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">
                LIST
              </div>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed">
              Browse policies with advanced filtering, sorting, and pagination capabilities
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-green-100">
            <div className="flex items-start justify-between mb-3">
              <div className="text-lg font-semibold text-green-600 font-mono">
                ledger_bind_policy
              </div>
              <div className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-full font-medium">
                ACTION
              </div>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed">
              Finalize policy binding with coverage activation and premium calculation
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-green-100">
            <div className="flex items-start justify-between mb-3">
              <div className="text-lg font-semibold text-green-600 font-mono">
                ledger_calculate_policy
              </div>
              <div className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full font-medium">
                CALC
              </div>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed">
              Perform premium calculations with risk assessment and pricing algorithms
            </div>
          </div>
        </div>
      </div>

      {/* Quotes */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
            💼
          </span>
          Quotes (6 Tools) - Quote Generation & Management
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-green-100">
            <div className="flex items-start justify-between mb-3">
              <div className="text-lg font-semibold text-green-600 font-mono">
                ledger_create_quote
              </div>
              <div className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full font-medium">
                CREATE
              </div>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed">
              Generate new insurance quotes with premium calculations and coverage options
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-green-100">
            <div className="flex items-start justify-between mb-3">
              <div className="text-lg font-semibold text-green-600 font-mono">
                ledger_get_quote
              </div>
              <div className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">
                READ
              </div>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed">
              Retrieve detailed quote information including terms, coverage, and pricing
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-green-100">
            <div className="flex items-start justify-between mb-3">
              <div className="text-lg font-semibold text-green-600 font-mono">
                ledger_calculate_quote
              </div>
              <div className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full font-medium">
                CALC
              </div>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed">
              Perform quote calculations with risk assessment and pricing algorithms
            </div>
          </div>
        </div>
      </div>

      {/* Claims */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
            🛡️
          </span>
          Claims (6 Tools) - Claims Processing & Management
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-green-100">
            <div className="flex items-start justify-between mb-3">
              <div className="text-lg font-semibold text-green-600 font-mono">
                ledger_create_claim
              </div>
              <div className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full font-medium">
                CREATE
              </div>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed">
              Initialize new insurance claims with incident details and documentation
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-green-100">
            <div className="flex items-start justify-between mb-3">
              <div className="text-lg font-semibold text-green-600 font-mono">
                ledger_process_claim
              </div>
              <div className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-full font-medium">
                PROCESS
              </div>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed">
              Execute claim processing workflows and settlement procedures
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-green-100">
            <div className="flex items-start justify-between mb-3">
              <div className="text-lg font-semibold text-green-600 font-mono">
                ledger_set_claim_reserve
              </div>
              <div className="px-2 py-1 bg-teal-50 text-teal-600 text-xs rounded-full font-medium">
                FINANCE
              </div>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed">
              Set and manage financial reserves for claim settlement amounts
            </div>
          </div>
        </div>
      </div>

      {/* Additional categories summary note */}
      <div className="bg-green-50 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-semibold text-green-900 mb-4">
          Complete Ledger API Coverage - 162 Tools
        </h3>
        <p className="text-lg text-green-700 mb-6">
          This represents comprehensive coverage of all Ledger API endpoints including additional specialized categories:
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-green-700">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <strong>Consolidated Invoices (10)</strong><br/>
            Invoice management & billing
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <strong>Binders (7)</strong><br/>
            Policy binder management
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <strong>Endorsements (6)</strong><br/>
            Policy change management
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <strong>E-Proposals (6)</strong><br/>
            Electronic proposal workflows
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <strong>Customers (8)</strong><br/>
            Customer management & profiles
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <strong>Users (5)</strong><br/>
            User management & permissions
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <strong>Documents (5)</strong><br/>
            Document generation & management
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <strong>Reports (5)</strong><br/>
            Business intelligence & analytics
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <strong>Dashboards (5)</strong><br/>
            Business dashboards & metrics
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <strong>Schemas (5)</strong><br/>
            Data structure & validation
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <strong>Feature Config (4)</strong><br/>
            Product & tenant features
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <strong>Audit (4)</strong><br/>
            Compliance & audit logging
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <strong>High-Risk (5)</strong><br/>
            Risk assessment & cases
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <strong>Workflows (4)</strong><br/>
            Process automation
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <strong>Notifications (4)</strong><br/>
            Communication systems
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <strong>Broker Management (3)</strong><br/>
            Broker administration
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <strong>Broker Payments (7)</strong><br/>
            Payment processing
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <strong>Search & More (30+)</strong><br/>
            Search, lookup, integrations
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-green-200">
          <p className="text-green-600 font-medium">
            🎯 Production Ready • 100% API Coverage • 162 Specialized Tools
          </p>
        </div>
      </div>
    </div>
  );
}