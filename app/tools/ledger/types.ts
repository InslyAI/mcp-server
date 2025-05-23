/**
 * Ledger API Types
 * 
 * Note: These are placeholder types until we receive the actual Ledger API schemas.
 * All types will be updated once the API documentation is available.
 */

// TODO: Replace with actual Ledger API types from schema documentation
export interface LedgerCredentials {
  // Placeholder - will be replaced with actual auth structure
  apiKey?: string;
  clientId?: string;
  // Add actual credential fields based on Ledger API requirements
}

export interface LedgerApiResponse<T = any> {
  // Placeholder - will be replaced with actual response structure  
  data: T;
  success: boolean;
  message?: string;
}

// TODO: Add actual Ledger-specific types based on API schema
export interface LedgerAccount {
  // Placeholder types
  id: string;
  name: string;
}

export interface LedgerTransaction {
  // Placeholder types
  id: string;
  amount: number;
  currency: string;
}