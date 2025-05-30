export interface SiteServiceClientConfig {
  bearerToken: string;
  tenantId: string;
  baseUrl?: string;
}

export class SiteServiceClient {
  private bearerToken: string;
  private tenantId: string;
  private baseUrl: string;

  constructor({ bearerToken, tenantId, baseUrl }: SiteServiceClientConfig) {
    this.bearerToken = bearerToken;
    this.tenantId = tenantId;
    this.baseUrl = baseUrl || `https://${tenantId}.app.devbox.insly.training`;
  }

  private async request(
    method: string,
    path: string,
    body?: any,
  ): Promise<any> {
    const url = `${this.baseUrl}${path}`;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.bearerToken}`,
      "X-Tenant-ID": this.tenantId,
      "Content-Type": "application/json",
    };

    const config: RequestInit = {
      method,
      headers,
    };

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // Use default error message if JSON parsing fails
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return await response.text();
  }

  async get(path: string, params?: Record<string, any>): Promise<any> {
    let url = path;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
    }
    return this.request("GET", url);
  }

  async post(path: string, body?: any): Promise<any> {
    return this.request("POST", path, body);
  }

  async put(path: string, body?: any): Promise<any> {
    return this.request("PUT", path, body);
  }

  async patch(path: string, body?: any): Promise<any> {
    return this.request("PATCH", path, body);
  }

  async delete(path: string): Promise<any> {
    return this.request("DELETE", path);
  }
}

export function createSiteServiceClient(
  bearerToken: string,
  tenantId: string,
  baseUrl?: string,
): SiteServiceClient {
  return new SiteServiceClient({ bearerToken, tenantId, baseUrl });
}
