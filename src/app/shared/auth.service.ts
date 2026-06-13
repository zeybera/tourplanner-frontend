import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private oauthService: OAuthService) {
    this.configure();
  }

  private configure() {
    // Apply the OIDC configuration
    this.oauthService.configure(authConfig);

    // Load the OIDC discovery document from Authentik
    // This fetches the list of endpoints (authorization, token, userinfo, etc.)
    // tryLogin() handles the redirect callback after Authentik sends the user back
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  // Redirects the user to the Authentik login/registration page
  login() {
    this.oauthService.initCodeFlow();
  }

  // Logs the user out and clears the stored tokens
  logout() {
    this.oauthService.logOut();
  }

  // Returns true if the user has a valid access token
  get isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  // Returns the raw access token (sent to Spring Boot as Bearer token)
  get accessToken(): string {
    return this.oauthService.getAccessToken();
  }

  // Returns the username from the identity token claims
  get username(): string {
    const claims = this.oauthService.getIdentityClaims() as Record<string, string>;
    return claims?.['preferred_username'] ?? '';
  }
}
