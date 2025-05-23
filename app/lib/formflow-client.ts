/**
 * FormFlow API Client
 * Handles authentication and API calls to the Insly FormFlow service
 */

export interface FormFlowCredentials {
  clientId: string;
  clientSecret: string;
  organizationId: string;
}

export interface TokenResponse {
  token: string;
  expires_in: number;
  token_type: string;
}

export class FormFlowClient {
  private credentials: FormFlowCredentials;
  private baseUrl: string;
  private token: string | null = null;
  private tokenExpiry: number = 0;

  constructor(credentials: FormFlowCredentials, baseUrl?: string) {
    this.credentials = credentials;
    this.baseUrl = baseUrl || 'https://main.formflow-dev.net';
  }

  /**
   * Get or refresh access token
   */
  private async getAccessToken(): Promise<string> {
    const now = Date.now();
    
    // Return existing token if still valid (with 5 minute buffer)
    if (this.token && now < (this.tokenExpiry - 300000)) {
      return this.token;
    }

    // Request new token
    const response = await fetch(`${this.baseUrl}/api/token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.credentials),
    });

    if (!response.ok) {
      throw new Error(`FormFlow Token Error: ${response.status} ${response.statusText}`);
    }

    const tokenData: TokenResponse = await response.json();
    this.token = tokenData.token;
    this.tokenExpiry = now + (tokenData.expires_in * 1000);

    return this.token;
  }

  /**
   * Make authenticated API request to FormFlow service
   */
  private async makeRequest(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<Response> {
    const token = await this.getAccessToken();
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`FormFlow API Error: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  /**
   * GET request to FormFlow API
   */
  async get(endpoint: string): Promise<any> {
    const response = await this.makeRequest(endpoint, { method: 'GET' });
    return response.json();
  }

  /**
   * POST request to FormFlow API
   */
  async post(endpoint: string, data: any): Promise<any> {
    const response = await this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  /**
   * PUT request to FormFlow API
   */
  async put(endpoint: string, data: any): Promise<any> {
    const response = await this.makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  /**
   * DELETE request to FormFlow API
   */
  async delete(endpoint: string): Promise<any> {
    const response = await this.makeRequest(endpoint, { method: 'DELETE' });
    return response.json();
  }
}