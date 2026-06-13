import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

// This guard protects routes that require the user to be logged in
// If the user is not logged in, they are redirected to the Authentik login page
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  if (authService.isLoggedIn) {
    return true;
  }

  // User is not logged in - redirect to Authentik
  authService.login();
  return false;
};
