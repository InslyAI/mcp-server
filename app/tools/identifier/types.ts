/**
 * Identifier Service Types
 * Authentication service for Insly platform
 */

export interface IdentifierCredentials {
  username: string;
  password: string;
  tenantTag: string;
}

export interface ClientCredentials {
  clientId: string;
  clientSecret: string;
  tenantTag: string;
  scope?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  meta_data?: Record<string, string>;
}

export interface LoginResult {
  authentication_result?: AuthenticationResultType;
  challenge_name?: string;
  challenge_parameters?: ChallengeResultParameters;
  data?: Record<string, string>;
}

export interface AuthenticationResultType {
  access_token: string;
  expires_in: number;
  id_token?: string;
  refresh_token?: string;
  token_type: string;
}

export interface ChallengeResultParameters {
  required_attributes?: string[];
  user_attributes?: Record<string, string>;
  user_id_for_srp?: string;
}

export interface ClientCredentialsResult {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
  username: string;
}

export interface RefreshTokenResult {
  authentication_result?: AuthenticationResultType;
  challenge_name?: string;
  challenge_parameters?: ChallengeResultParameters;
  data?: Record<string, string>;
}

export interface ErrorResponse {
  errors: ErrorMessage[];
}

export interface ErrorMessage {
  code?: string;
  message?: string;
  params?: Record<string, any>;
}