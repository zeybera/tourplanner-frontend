import { AuthConfig } from 'angular-oauth2-oidc';

// OIDC configuration for the Angular frontend
// This tells the library how to talk to Authentik
export const authConfig: AuthConfig = {
  // Authentik OIDC issuer URL for the "tourplanner" application
  // This must match exactly what is configured in Authentik
  issuer: 'http://localhost:9000/application/o/tourplanner/',

  // After login, Authentik redirects back to this URL
  redirectUri: window.location.origin,

  // The client ID configured in Authentik for this application
  clientId: 'tourplanner',

  // Authorization Code Flow with PKCE (recommended for SPAs)
  responseType: 'code',

  // Request access to basic user information
  scope: 'openid profile email',

  // Allow HTTP in development (Authentik runs on localhost without HTTPS)
  requireHttps: false,
};
