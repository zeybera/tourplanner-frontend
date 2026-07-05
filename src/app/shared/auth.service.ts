import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

export interface AuthResult {
  success: boolean;
  message?: string;
}

interface LoginResponse {
  token: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private router = inject(Router);

  private readonly tokenStorageKey = 'token';
  private readonly usernameStorageKey = 'username';
  private readonly expiresAtStorageKey = 'authExpiresAt';
  // Keep the frontend session short so users are not logged in forever on shared devices.
  private readonly sessionDurationMs = 30 * 60 * 1000;
  private logoutTimer: ReturnType<typeof setTimeout> | null = null;

  private _token = signal('');
  private _username = signal('');

  readonly token = this._token.asReadonly();
  readonly username = this._username.asReadonly();
  readonly isLoggedIn = computed(() => this._token() !== '');

  constructor(private http: HttpClient) {
    // Remove old persistent login data from the previous localStorage implementation.
    localStorage.removeItem(this.tokenStorageKey);
    localStorage.removeItem(this.usernameStorageKey);
    localStorage.removeItem(this.expiresAtStorageKey);

    // Restore only valid sessionStorage data after a page reload.
    this.restoreSession();
  }

  async login(username: string, password: string): Promise<AuthResult> {
    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>('http://localhost:8080/api/auth/login', { username, password })
      );

      this.saveSession(response.token, response.username);
      return { success: true };
    } catch (error) {
      return { success: false, message: this.getErrorMessage(error, 'Wrong username or password.') };
    }
  }

  async register(username: string, password: string): Promise<AuthResult> {
    try {
      await firstValueFrom(
        this.http.post('http://localhost:8080/api/auth/register', { username, password }, { responseType: 'text' })
      );
      return { success: true };
    } catch (error) {
      return { success: false, message: this.getErrorMessage(error, 'Registration failed.') };
    }
  }

  logout() {
    this.clearLogoutTimer();
    sessionStorage.removeItem(this.tokenStorageKey);
    sessionStorage.removeItem(this.usernameStorageKey);
    sessionStorage.removeItem(this.expiresAtStorageKey);
    this._token.set('');
    this._username.set('');
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (!(error instanceof HttpErrorResponse)) {
      return fallback;
    }

    if (typeof error.error === 'string' && error.error.trim() !== '') {
      return error.error;
    }

    if (error.error && typeof error.error === 'object') {
      const messages = Object.values(error.error).filter(value => typeof value === 'string') as string[];

      if (messages.length > 0) {
        return messages[0];
      }
    }

    return fallback;
  }

  private saveSession(token: string, username: string): void {
    const expiresAt = Date.now() + this.sessionDurationMs;

    // sessionStorage is cleared by the browser when the tab/session ends.
    sessionStorage.setItem(this.tokenStorageKey, token);
    sessionStorage.setItem(this.usernameStorageKey, username);
    sessionStorage.setItem(this.expiresAtStorageKey, expiresAt.toString());
    this._token.set(token);
    this._username.set(username);
    this.startLogoutTimer(expiresAt);
  }

  private restoreSession(): void {
    // A reload should keep the user logged in only until the stored expiry time.
    const token = sessionStorage.getItem(this.tokenStorageKey) ?? '';
    const username = sessionStorage.getItem(this.usernameStorageKey) ?? '';
    const expiresAt = Number(sessionStorage.getItem(this.expiresAtStorageKey) ?? '0');

    if (token == '' || username == '' || expiresAt <= Date.now()) {
      this.logout();
      return;
    }

    this._token.set(token);
    this._username.set(username);
    this.startLogoutTimer(expiresAt);
  }

  private startLogoutTimer(expiresAt: number): void {
    this.clearLogoutTimer();

    // Automatically logout once the stored session expiry time is reached.
    const remainingMs = expiresAt - Date.now();
    this.logoutTimer = setTimeout(() => {
      this.logout();
      this.router.navigate(['/login']);
    }, remainingMs);
  }

  private clearLogoutTimer(): void {
    if (this.logoutTimer !== null) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
  }
}
