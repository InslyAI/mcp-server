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
  private credentials?: FormFlowCredentials;
  private baseUrl: string;
  private token: string | null = null;
  private tokenExpiry: number = 0;
  private providedToken?: string;

  constructor(credentials: FormFlowCredentials, baseUrl?: string);
  constructor(token: string, baseUrl?: string);
  constructor(credentialsOrToken: FormFlowCredentials | string, baseUrl?: string) {
    this.baseUrl = baseUrl || 'https://develop.formflow-dev.net';
    
    if (typeof credentialsOrToken === 'string') {
      // Bearer token provided
      this.providedToken = credentialsOrToken;
    } else {
      // Credentials provided
      this.credentials = credentialsOrToken;
    }
  }

  /**
   * Get or refresh access token
   */
  private async getAccessToken(): Promise<string> {
    // If a token was provided directly, use it
    if (this.providedToken) {
      return this.providedToken;
    }

    // If no credentials available, throw error
    if (!this.credentials) {
      throw new Error('No credentials or token provided for FormFlow authentication');
    }

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
   * PATCH request to FormFlow API
   */
  async patch(endpoint: string, data: any): Promise<any> {
    const response = await this.makeRequest(endpoint, {
      method: 'PATCH',
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

  // Submission APIs
  async listSubmissions(params?: any): Promise<any> {
    const queryParams = new URLSearchParams(params);
    return this.get(`/api/submission?${queryParams}`);
  }

  async createSubmission(data: any): Promise<any> {
    return this.post('/api/submission', data);
  }

  async getSubmission(id: string): Promise<any> {
    return this.get(`/api/submission/${id}`);
  }

  async updateSubmission(id: string, data: any): Promise<any> {
    return this.patch(`/api/submission/${id}`, data);
  }

  async getSubmissionReferences(id: string): Promise<any> {
    return this.get(`/api/submission/${id}/references`);
  }

  async getSubmissionEvents(id: string): Promise<any> {
    return this.get(`/api/submission/${id}/events`);
  }

  async getUploadUrl(id: string, uploadRequest: any): Promise<any> {
    return this.post(`/api/submission/${id}/upload`, uploadRequest);
  }

  // Template APIs
  async listTemplates(params?: any): Promise<any> {
    const queryParams = new URLSearchParams(params);
    return this.get(`/api/template?${queryParams}`);
  }

  async createTemplate(data: any): Promise<any> {
    return this.post('/api/template', data);
  }

  async getTemplate(id: number): Promise<any> {
    return this.get(`/api/template/${id}`);
  }

  async updateTemplate(id: number, data: any): Promise<any> {
    return this.patch(`/api/template/${id}`, data);
  }

  async deleteTemplate(id: number): Promise<any> {
    return this.delete(`/api/template/${id}`);
  }

  // File APIs
  async getFile(id: string): Promise<any> {
    return this.get(`/api/file/${id}`);
  }

  async deleteFile(id: string): Promise<any> {
    return this.delete(`/api/file/${id}`);
  }

  // AI APIs
  async extractData(data: any): Promise<any> {
    return this.post('/api/ai/atomic-extract', data);
  }

  async generateMetadata(data: any): Promise<any> {
    return this.post('/api/ai/generateSubmissionMetadata', data);
  }

  async exchangeToken(credentials: FormFlowCredentials): Promise<TokenResponse> {
    const response = await fetch(`${this.baseUrl}/api/token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(`FormFlow Token Exchange Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Webhook APIs
  async createWebhook(data: any): Promise<any> {
    return this.post('/api/webhook/subscription', data);
  }

  async listWebhooks(): Promise<any> {
    return this.get('/api/webhook/subscriptions');
  }

  async getWebhook(id: string): Promise<any> {
    return this.get(`/api/webhook/subscription/${id}`);
  }

  async updateWebhook(id: string, data: any): Promise<any> {
    return this.put(`/api/webhook/subscription/${id}`, data);
  }

  async deleteWebhook(id: string): Promise<any> {
    return this.delete(`/api/webhook/subscription/${id}`);
  }
}