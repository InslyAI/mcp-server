/**
 * Scheme Management Tools Registration
 * Schema and UI schema management tools for products, policies, and features
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetFeatureSchemaTool } from './get-feature-schema';
import { registerGetFeatureUiSchemaTool } from './get-feature-ui-schema';
import { registerGetRegularSchemaTool } from './get-regular-schema';
import { registerGetRenewalSchemaTool } from './get-renewal-schema';
import { registerGetRenewalUiSchemaTool } from './get-renewal-ui-schema';
import { registerGetMtaRenewalSchemaTool } from './get-mta-renewal-schema';
import { registerGetMtaRenewalUiSchemaTool } from './get-mta-renewal-ui-schema';
import { registerGetActionSchemaTool } from './get-action-schema';
import { registerGetActionUiSchemaTool } from './get-action-ui-schema';
import { registerGetSchemaProductsTool } from './get-schema-products';
import { registerGetPolicyObjectTypesTool } from './get-policy-object-types';
import { registerGetPolicyProductsTool } from './get-policy-products';
import { registerGetPolicyInsurersTool } from './get-policy-insurers';
import { registerGetPolicyTerminationSchemaTool } from './get-policy-termination-schema';
import { registerGetPolicyTerminationUiSchemaTool } from './get-policy-termination-ui-schema';

/**
 * Register all Scheme Management MCP tools
 * These tools handle JSON schemas, UI schemas, and product configuration
 */
export function registerSchemeTools(server: McpServer) {
  registerGetFeatureSchemaTool(server);
  registerGetFeatureUiSchemaTool(server);
  registerGetRegularSchemaTool(server);
  registerGetRenewalSchemaTool(server);
  registerGetRenewalUiSchemaTool(server);
  registerGetMtaRenewalSchemaTool(server);
  registerGetMtaRenewalUiSchemaTool(server);
  registerGetActionSchemaTool(server);
  registerGetActionUiSchemaTool(server);
  registerGetSchemaProductsTool(server);
  registerGetPolicyObjectTypesTool(server);
  registerGetPolicyProductsTool(server);
  registerGetPolicyInsurersTool(server);
  registerGetPolicyTerminationSchemaTool(server);
  registerGetPolicyTerminationUiSchemaTool(server);
}