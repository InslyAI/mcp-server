/**
 * Identifier API Client
 * Handles authentication with Insly Identifier service
 */

import type { 
  IdentifierCredentials,
  ClientCredentials, 
  LoginRequest,
  LoginResult,
  ClientCredentialsResult,
  RefreshTokenRequest,
  RefreshTokenResult,
  ErrorResponse
} from './types';

export class IdentifierClient {
  private baseUrl: string;

  constructor(tenant: string) {
    // URL pattern: https://{{tenant}}.app.beta.insly.training/api/v1/identifier
    this.baseUrl = `https://${tenant}.app.beta.insly.training/api/v1/identifier`;
  }

  /**
   * Make authenticated API request to Identifier service
   */
  private async makeRequest(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<Response> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    return response;
  }

  /**
   * Login with username and password
   * POST /login/{tenant_tag}
   */
  async login(credentials: IdentifierCredentials): Promise<LoginResult> {
    const { username, password, tenantTag } = credentials;
    
    const loginRequest: LoginRequest = {
      username,
      password
    };

    const response = await this.makeRequest(`/login/${tenantTag}`, {
      method: 'POST',
      body: JSON.stringify(loginRequest),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json().catch(() => ({
        errors: [{ message: `HTTP ${response.status}: ${response.statusText}` }]
      }));
      throw new Error(`Identifier login failed: ${errorData.errors?.[0]?.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Client credentials authentication
   * POST /token/client/{tenant_tag}
   */
  async clientCredentials(credentials: ClientCredentials): Promise<ClientCredentialsResult> {
    const { clientId, clientSecret, tenantTag, scope } = credentials;
    
    const requestBody = {
      client_id: clientId,
      client_secret: clientSecret,
      ...(scope && { scope })
    };

    const response = await this.makeRequest(`/token/client/${tenantTag}`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json().catch(() => ({
        errors: [{ message: `HTTP ${response.status}: ${response.statusText}` }]
      }));
      throw new Error(`Identifier client credentials failed: ${errorData.errors?.[0]?.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Refresh access token
   * POST /token/refresh/{tenant_tag}
   */
  async refreshToken(request: RefreshTokenRequest & { tenantTag: string }): Promise<RefreshTokenResult> {
    const { refresh_token, username, tenantTag } = request;
    
    const requestBody: RefreshTokenRequest = {
      refresh_token,
      username
    };

    const response = await this.makeRequest(`/token/refresh/${tenantTag}`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json().catch(() => ({
        errors: [{ message: `HTTP ${response.status}: ${response.statusText}` }]
      }));
      throw new Error(`Identifier token refresh failed: ${errorData.errors?.[0]?.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Logout (requires bearer token)
   * GET /logout
   */
  async logout(bearerToken: string): Promise<string> {
    const response = await this.makeRequest('/logout', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json().catch(() => ({
        errors: [{ message: `HTTP ${response.status}: ${response.statusText}` }]
      }));
      throw new Error(`Identifier logout failed: ${errorData.errors?.[0]?.message || response.statusText}`);
    }

    return response.text();
  }
}