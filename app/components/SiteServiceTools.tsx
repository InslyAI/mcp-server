export default function SiteServiceTools() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-[#22524A] mb-6">
        Site Service Tools
      </h2>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#FF7D00] to-[#22524A] text-white p-4">
          <h3 className="text-xl font-semibold">
            Tenant Configuration Management (32 tools)
          </h3>
          <p className="text-white/90 mt-1">
            Complete tenant configuration system for features, products,
            schemes, and static documents
          </p>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Features */}
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <h4 className="font-semibold text-[#22524A] mb-2">
                Features (5 tools)
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Get tenant broker features</li>
                <li>• Get/update tenant features</li>
                <li>• Get specific tenant feature</li>
                <li>• Get public features</li>
              </ul>
            </div>

            {/* Claim Features */}
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <h4 className="font-semibold text-[#22524A] mb-2">
                Claim Features (4 tools)
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Get claim features</li>
                <li>• Save claim features</li>
                <li>• Get/set specific feature</li>
                <li>• Sanctions search config</li>
              </ul>
            </div>

            {/* Products */}
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <h4 className="font-semibold text-[#22524A] mb-2">
                Products (2 tools)
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Create new product</li>
                <li>• Copy existing product</li>
              </ul>
            </div>

            {/* Product Features */}
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <h4 className="font-semibold text-[#22524A] mb-2">
                Product Features (7 tools)
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Get product features</li>
                <li>• Schema-specific features</li>
                <li>• Create/update features</li>
                <li>• Products list</li>
                <li>• Specific feature CRUD</li>
              </ul>
            </div>

            {/* Schemes */}
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <h4 className="font-semibold text-[#22524A] mb-2">
                Schemes (9 tools)
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Get/create schemes</li>
                <li>• Schemes list by type</li>
                <li>• Version management</li>
                <li>• UI schemes CRUD</li>
                <li>• Latest version tracking</li>
              </ul>
            </div>

            {/* Scheme Features */}
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <h4 className="font-semibold text-[#22524A] mb-2">
                Scheme Features (5 tools)
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Get scheme features</li>
                <li>• Save scheme features</li>
                <li>• Check enabled features</li>
                <li>• Get/set specific feature</li>
                <li>• Autocomplete settings</li>
              </ul>
            </div>

            {/* Static Documents */}
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <h4 className="font-semibold text-[#22524A] mb-2">
                Static Documents (4 tools)
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• List static documents</li>
                <li>• Upload documents</li>
                <li>• Get document content</li>
                <li>• Delete documents</li>
              </ul>
            </div>

            {/* Excel Calculator */}
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <h4 className="font-semibold text-[#22524A] mb-2">
                Excel Calculator (1 tool)
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Get calculators list</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              Authentication & Usage
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • <strong>Bearer Token</strong>: JWT from identifier_login
                required
              </li>
              <li>
                • <strong>Tenant ID</strong>: Required for X-Tenant-ID header
              </li>
              <li>
                • <strong>Tenant Tag</strong>: Tenant identifier for API paths
              </li>
              <li>
                • <strong>Base URL</strong>:
                https://&#123;tenantId&#125;.app.devbox.insly.training
              </li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">API Coverage</h4>
            <p className="text-sm text-gray-700">
              Complete coverage of Site Service API endpoints including tenant
              configuration management, product and schema administration,
              feature toggles, and static document management. All tools follow
              consistent authentication and error handling patterns.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
