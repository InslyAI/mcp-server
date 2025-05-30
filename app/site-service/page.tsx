import Header from "../components/Header";
import Footer from "../components/Footer";

interface Tool {
  name: string;
  description: string;
  category: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint?: string;
  parameters?: string[];
}

const siteServiceTools: Tool[] = [
  // Tenant Features
  {
    name: "site_service_features_broker_get",
    description:
      "Get tenant broker feature configuration for specific feature and broker",
    category: "Tenant Features",
    method: "GET",
    endpoint: "/api/v1/sites/features/{tenantTag}/{featureName}/{broker}",
    parameters: [
      "tenantTag",
      "featureName",
      "broker",
      "bearerToken",
      "tenantId",
    ],
  },
  {
    name: "site_service_features_tenant_get",
    description: "Get all tenant features configuration",
    category: "Tenant Features",
    method: "GET",
    endpoint: "/api/v1/sites/features/{tenantTag}",
    parameters: ["tenantTag", "bearerToken", "tenantId"],
  },
  {
    name: "site_service_features_tenant_update",
    description: "Update tenant features configuration",
    category: "Tenant Features",
    method: "PUT",
    endpoint: "/api/v1/sites/features/{tenantTag}",
    parameters: ["tenantTag", "features", "bearerToken", "tenantId"],
  },
  {
    name: "site_service_features_tenant_feature_get",
    description: "Get specific tenant feature configuration",
    category: "Tenant Features",
    method: "GET",
    endpoint: "/api/v1/sites/features/{tenantTag}/{featureName}",
    parameters: ["tenantTag", "featureName", "bearerToken", "tenantId"],
  },
  {
    name: "site_service_features_public_get",
    description: "Get tenant public features (no authentication required)",
    category: "Tenant Features",
    method: "GET",
    endpoint: "/api/v1/sites/public/features/{tenantTag}",
    parameters: ["tenantTag", "bearerToken", "tenantId"],
  },

  // Claim Features
  {
    name: "site_service_claim_features_get",
    description:
      "Get tenant claim features - internal use for deploy automation",
    category: "Claim Features",
    method: "GET",
    endpoint: "/api/v1/sites/claim-features/{tenantTag}",
    parameters: ["tenantTag", "bearerToken", "tenantId"],
  },
  {
    name: "site_service_claim_features_save",
    description: "Save claim features - internal use for deploy automation",
    category: "Claim Features",
    method: "POST",
    endpoint: "/api/v1/sites/claim-features/{tenantTag}/{schemaName}",
    parameters: [
      "tenantTag",
      "schemaName",
      "features",
      "bearerToken",
      "tenantId",
    ],
  },
  {
    name: "site_service_claim_features_feature_get",
    description: "Get specific claim feature configuration",
    category: "Claim Features",
    method: "GET",
    endpoint:
      "/api/v1/sites/claim-features/{tenantTag}/{schemaName}/{featureName}",
    parameters: [
      "tenantTag",
      "schemaName",
      "featureName",
      "bearerToken",
      "tenantId",
    ],
  },
  {
    name: "site_service_claim_features_feature_set",
    description: "Set specific claim feature (e.g., sanctions search config)",
    category: "Claim Features",
    method: "POST",
    endpoint:
      "/api/v1/sites/claim-features/{tenantTag}/{schemaName}/{featureName}",
    parameters: [
      "tenantTag",
      "schemaName",
      "featureName",
      "config",
      "bearerToken",
      "tenantId",
    ],
  },

  // Products
  {
    name: "site_service_products_create",
    description:
      "Create new product with schemas, schema features and product features",
    category: "Products",
    method: "POST",
    endpoint: "/api/v1/sites/products/{tenantTag}",
    parameters: ["tenantTag", "name", "title", "bearerToken", "tenantId"],
  },
  {
    name: "site_service_products_copy",
    description: "Copy existing product schemas, features to new product",
    category: "Products",
    method: "POST",
    endpoint: "/api/v1/sites/products/{tenantTag}/copy",
    parameters: [
      "tenantTag",
      "source",
      "targetName",
      "targetTitle",
      "bearerToken",
      "tenantId",
    ],
  },

  // Product Features
  {
    name: "site_service_product_features_get",
    description: "Get tenant product features for all products",
    category: "Product Features",
    method: "GET",
    endpoint: "/api/v1/sites/product-features/{tenantTag}",
    parameters: ["tenantTag", "bearerToken", "tenantId"],
  },
  {
    name: "site_service_product_features_schema_get",
    description: "Get product features for specific schema",
    category: "Product Features",
    method: "GET",
    endpoint: "/api/v1/sites/product-features/{tenantTag}/{schemaName}",
    parameters: ["tenantTag", "schemaName", "bearerToken", "tenantId"],
  },
  {
    name: "site_service_product_features_schema_update",
    description: "Update product features for schema using PUT method",
    category: "Product Features",
    method: "PUT",
    endpoint: "/api/v1/sites/product-features/{tenantTag}/{schemaName}",
    parameters: [
      "tenantTag",
      "schemaName",
      "features",
      "bearerToken",
      "tenantId",
    ],
  },
  {
    name: "site_service_product_features_schema_create",
    description: "Create product features for schema using POST method",
    category: "Product Features",
    method: "POST",
    endpoint: "/api/v1/sites/product-features/{tenantTag}/{schemaName}",
    parameters: [
      "tenantTag",
      "schemaName",
      "features",
      "bearerToken",
      "tenantId",
    ],
  },
  {
    name: "site_service_product_features_products_list",
    description: "Get list of configured tenant products",
    category: "Product Features",
    method: "GET",
    endpoint: "/api/v1/sites/product-features/{tenantTag}/products-list",
    parameters: ["tenantTag", "bearerToken", "tenantId"],
  },
  {
    name: "site_service_product_features_feature_get",
    description: "Get specific product feature configuration",
    category: "Product Features",
    method: "GET",
    endpoint:
      "/api/v1/sites/product-features/{tenantTag}/{schemaName}/{featureName}",
    parameters: [
      "tenantTag",
      "schemaName",
      "featureName",
      "bearerToken",
      "tenantId",
    ],
  },
  {
    name: "site_service_product_features_feature_update",
    description: "Update specific product feature configuration",
    category: "Product Features",
    method: "PUT",
    endpoint:
      "/api/v1/sites/product-features/{tenantTag}/{schemaName}/{featureName}",
    parameters: [
      "tenantTag",
      "schemaName",
      "featureName",
      "config",
      "bearerToken",
      "tenantId",
    ],
  },

  // Schemes
  {
    name: "site_service_schemes_configuration_get",
    description: "Get latest version JSON scheme configuration",
    category: "Schemes",
    method: "GET",
    endpoint: "/api/v1/sites/schemes/configurations/{tenantTag}/{type}/{name}",
    parameters: ["tenantTag", "type", "name", "bearerToken", "tenantId"],
  },
  {
    name: "site_service_schemes_configuration_create",
    description: "Create new scheme configuration",
    category: "Schemes",
    method: "POST",
    endpoint: "/api/v1/sites/schemes/configurations/{tenantTag}/{type}/{name}",
    parameters: [
      "tenantTag",
      "type",
      "name",
      "schema",
      "bearerToken",
      "tenantId",
    ],
  },
  {
    name: "site_service_schemes_configurations_list",
    description: "Get schemes list of latest version for tenant",
    category: "Schemes",
    method: "GET",
    endpoint: "/api/v1/sites/schemes/configurations/{tenantTag}",
    parameters: ["tenantTag", "name", "bearerToken", "tenantId"],
  },
  {
    name: "site_service_schemes_configurations_by_type_list",
    description: "Get schemes list by type with optional name filter",
    category: "Schemes",
    method: "GET",
    endpoint: "/api/v1/sites/schemes/configurations/{tenantTag}/{type}",
    parameters: ["tenantTag", "type", "name", "bearerToken", "tenantId"],
  },
  {
    name: "site_service_schemes_configuration_version_get",
    description: "Get JSON scheme by specific version",
    category: "Schemes",
    method: "GET",
    endpoint:
      "/api/v1/sites/schemes/configurations/{tenantTag}/{type}/{name}/{version}",
    parameters: [
      "tenantTag",
      "type",
      "name",
      "version",
      "bearerToken",
      "tenantId",
    ],
  },
  {
    name: "site_service_schemes_ui_version_get",
    description: "Get UI scheme by specific version",
    category: "Schemes",
    method: "GET",
    endpoint:
      "/api/v1/sites/schemes/configurations/{tenantTag}/{type}/{name}/{version}/ui",
    parameters: [
      "tenantTag",
      "type",
      "name",
      "version",
      "bearerToken",
      "tenantId",
    ],
  },
  {
    name: "site_service_schemes_ui_version_update",
    description: "Update UI scheme for specific version",
    category: "Schemes",
    method: "PUT",
    endpoint:
      "/api/v1/sites/schemes/configurations/{tenantTag}/{type}/{name}/{version}/ui",
    parameters: [
      "tenantTag",
      "type",
      "name",
      "version",
      "uiSchema",
      "bearerToken",
      "tenantId",
    ],
  },
  {
    name: "site_service_schemes_ui_latest_get",
    description: "Get latest version UI scheme",
    category: "Schemes",
    method: "GET",
    endpoint:
      "/api/v1/sites/schemes/configurations/{tenantTag}/{type}/{name}/ui",
    parameters: ["tenantTag", "type", "name", "bearerToken", "tenantId"],
  },
  {
    name: "site_service_schemes_version_get",
    description: "Get latest scheme version number",
    category: "Schemes",
    method: "GET",
    endpoint: "/api/v1/sites/schemes/version/{tenantTag}/{type}/{name}",
    parameters: ["tenantTag", "type", "name", "bearerToken", "tenantId"],
  },

  // Scheme Features
  {
    name: "site_service_scheme_features_get",
    description:
      "Get tenant scheme features - internal use for deploy automation",
    category: "Scheme Features",
    method: "GET",
    endpoint: "/api/v1/sites/scheme-features/{tenantTag}",
    parameters: ["tenantTag", "bearerToken", "tenantId"],
  },
  {
    name: "site_service_scheme_features_save",
    description: "Save scheme features - internal use for deploy automation",
    category: "Scheme Features",
    method: "POST",
    endpoint:
      "/api/v1/sites/scheme-features/{tenantTag}/{schemaType}/{schemaName}",
    parameters: [
      "tenantTag",
      "schemaType",
      "schemaName",
      "features",
      "bearerToken",
      "tenantId",
    ],
  },
  {
    name: "site_service_scheme_features_schema_type_check",
    description: "Check which features are enabled for schema type",
    category: "Scheme Features",
    method: "GET",
    endpoint: "/api/v1/sites/scheme-features/{tenantTag}/{schemaType}",
    parameters: ["tenantTag", "schemaType", "bearerToken", "tenantId"],
  },
  {
    name: "site_service_scheme_features_feature_get",
    description: "Get specific scheme feature configuration",
    category: "Scheme Features",
    method: "GET",
    endpoint:
      "/api/v1/sites/scheme-features/{tenantTag}/{schemaType}/{schemaName}/{featureName}",
    parameters: [
      "tenantTag",
      "schemaType",
      "schemaName",
      "featureName",
      "bearerToken",
      "tenantId",
    ],
  },
  {
    name: "site_service_scheme_features_feature_set",
    description: "Set specific scheme feature (e.g., autocomplete settings)",
    category: "Scheme Features",
    method: "POST",
    endpoint:
      "/api/v1/sites/scheme-features/{tenantTag}/{schemaType}/{schemaName}/{featureName}",
    parameters: [
      "tenantTag",
      "schemaType",
      "schemaName",
      "featureName",
      "config",
      "bearerToken",
      "tenantId",
    ],
  },

  // Static Documents
  {
    name: "site_service_static_documents_list",
    description: "Get list of static documents for tenant",
    category: "Static Documents",
    method: "GET",
    endpoint: "/api/v1/sites/static-documents/{tenantTag}",
    parameters: ["tenantTag", "bearerToken", "tenantId"],
  },
  {
    name: "site_service_static_documents_upload",
    description: "Upload static documents (requires multipart/form-data)",
    category: "Static Documents",
    method: "POST",
    endpoint: "/api/v1/sites/static-documents/{tenantTag}",
    parameters: ["tenantTag", "folder", "files", "bearerToken", "tenantId"],
  },
  {
    name: "site_service_static_documents_get",
    description: "Get static document content by path",
    category: "Static Documents",
    method: "GET",
    endpoint: "/api/v1/sites/static-documents/{tenantTag}/{path}",
    parameters: ["tenantTag", "path", "bearerToken", "tenantId"],
  },
  {
    name: "site_service_static_documents_delete",
    description: "Delete static document by path",
    category: "Static Documents",
    method: "DELETE",
    endpoint: "/api/v1/sites/static-documents/{tenantTag}/{path}",
    parameters: ["tenantTag", "path", "bearerToken", "tenantId"],
  },

  // Excel Calculator
  {
    name: "site_service_excel_calculator_list",
    description: "Get list of excel calculators for preloading",
    category: "Excel Calculator",
    method: "GET",
    endpoint: "/api/v1/sites/preload-excel-calc-api",
    parameters: ["bearerToken", "tenantId"],
  },
];

const categories = Array.from(
  new Set(siteServiceTools.map((tool) => tool.category)),
);

const getMethodColor = (method: string) => {
  switch (method) {
    case "GET":
      return "bg-blue-100 text-blue-800";
    case "POST":
      return "bg-green-100 text-green-800";
    case "PUT":
      return "bg-yellow-100 text-yellow-800";
    case "DELETE":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function SiteServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center">
              <span className="text-yellow-600 font-bold text-xl">SS</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Site Service</h1>
              <p className="text-gray-600">
                Tenant configuration management, features, products, and schemes
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-2xl font-bold text-yellow-600">
                {siteServiceTools.length}
              </div>
              <div className="text-sm text-gray-600">Total Tools</div>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-2xl font-bold text-yellow-600">
                {categories.length}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-2xl font-bold text-green-600">✅</div>
              <div className="text-sm text-gray-600">Production Ready</div>
            </div>
          </div>
        </div>

        {/* Configuration Features */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Configuration Management
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Tenant Features
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Complete tenant configuration management including feature
                toggles, broker settings, and public feature access.
              </p>
              <div className="text-xs text-yellow-600">Multi-Tenant Ready</div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Product Management
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Product creation, copying, and feature configuration with
                complete schema and feature management.
              </p>
              <div className="text-xs text-yellow-600">Schema Driven</div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Scheme Administration
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                JSON schema management with versioning, UI schema support, and
                configuration deployment.
              </p>
              <div className="text-xs text-yellow-600">Version Control</div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Document Management
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Static document upload, storage, and management with folder
                organization and path-based access.
              </p>
              <div className="text-xs text-yellow-600">File Storage</div>
            </div>
          </div>
        </div>

        {/* Tools by Category */}
        {categories.map((category) => {
          const categoryTools = siteServiceTools.filter(
            (tool) => tool.category === category,
          );

          return (
            <div key={category} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                {category}
                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {categoryTools.length} tools
                </span>
              </h2>

              <div className="grid gap-3">
                {categoryTools.map((tool) => (
                  <div
                    key={tool.name}
                    className="bg-white rounded-lg border hover:shadow-md transition-shadow"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-mono text-sm font-medium text-gray-900 mb-1">
                            {tool.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {tool.description}
                          </p>
                          {tool.endpoint && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span
                                className={`px-2 py-1 rounded-md font-medium ${getMethodColor(tool.method)}`}
                              >
                                {tool.method}
                              </span>
                              <code className="bg-gray-100 px-2 py-1 rounded">
                                {tool.endpoint}
                              </code>
                            </div>
                          )}
                        </div>
                      </div>

                      {tool.parameters && tool.parameters.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="text-xs text-gray-500 mb-1">
                            Key Parameters:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {tool.parameters.map((param) => (
                              <span
                                key={param}
                                className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded"
                              >
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

        {/* Authentication Requirements */}
        <div className="mt-8 bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Authentication & Configuration
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Required Authentication
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Bearer token from identifier_login</li>
                <li>• Tenant ID for X-Tenant-ID header</li>
                <li>• Tenant tag for API path parameters</li>
                <li>
                  • Base URL:
                  https://&#123;tenantId&#125;.app.devbox.insly.training
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Configuration Scope
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Tenant-specific configuration isolation</li>
                <li>• Feature toggle management</li>
                <li>• Product and schema lifecycle</li>
                <li>• Document and asset management</li>
              </ul>
            </div>
          </div>
        </div>

        {/* MCP Connection Info */}
        <div className="mt-8 bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            MCP Connection
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Server-Sent Events (SSE)
              </h3>
              <code className="block bg-gray-100 p-2 rounded text-sm">
                /site-service/sse
              </code>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">HTTP Transport</h3>
              <code className="block bg-gray-100 p-2 rounded text-sm">
                /site-service/mcp
              </code>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
