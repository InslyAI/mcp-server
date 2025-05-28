/**
 * Claim Management API Client
 * Handles claim lifecycle operations with Insly Claim Management service
 * Requires JWT bearer token from Identifier service + tenant ID
 * Uses same authentication pattern as Ledger service
 */

export class ClaimManagementClient {
  private bearerToken: string;
  private tenantId: string;
  private baseUrl: string;

  constructor(bearerToken: string, tenantId: string, baseUrl?: string) {
    this.bearerToken = bearerToken;
    this.tenantId = tenantId;
    // URL pattern based on tenant: https://{{tenant}}.app.beta.insly.training
    this.baseUrl = baseUrl || `https://${tenantId}.app.beta.insly.training`;
  }

  /**
   * Make authenticated API request to Claim Management service
   * Includes both Authorization header and X-Tenant-ID header
   */
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Authorization': `Bearer ${this.bearerToken}`,
      'X-Tenant-ID': this.tenantId,  // CRITICAL: Required for all Claim Management API calls
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Try to get error details from response
      let errorMessage = `Claim Management API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          errorMessage = errorData.errors[0].message || errorMessage;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // Failed to parse error response, use default message
      }
      throw new Error(errorMessage);
    }

    return response;
  }

  /**
   * GET request to Claim Management API
   */
  async get(endpoint: string): Promise<any> {
    const response = await this.makeRequest(endpoint, { method: 'GET' });
    return response.json();
  }

  /**
   * POST request to Claim Management API
   */
  async post(endpoint: string, data: any, headers?: Record<string, string>): Promise<any> {
    const response = await this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers,
    });
    return response.json();
  }

  /**
   * PUT request to Claim Management API
   */
  async put(endpoint: string, data: any, headers?: Record<string, string>): Promise<any> {
    const response = await this.makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers,
    });
    return response.json();
  }

  /**
   * PATCH request to Claim Management API
   */
  async patch(endpoint: string, data: any): Promise<any> {
    const response = await this.makeRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  /**
   * DELETE request to Claim Management API
   */
  async delete(endpoint: string, data?: any): Promise<any> {
    const response = await this.makeRequest(endpoint, { 
      method: 'DELETE',
      ...(data && { body: JSON.stringify(data) })
    });
    return response.json();
  }
}

/**
 * Create Claim Management client with bearer token and tenant ID
 */
export function createClaimManagementClient(bearerToken: string, tenantId: string): ClaimManagementClient {
  return new ClaimManagementClient(bearerToken, tenantId);
}