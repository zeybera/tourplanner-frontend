import { computed, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

  private readonly tokenStorageKey = 'token';
  private readonly usernameStorageKey = 'username';

  private _token = signal(localStorage.getItem(this.tokenStorageKey) ?? '');
  private _username = signal(localStorage.getItem(this.usernameStorageKey) ?? '');

  readonly token = this._token.asReadonly();
  readonly username = this._username.asReadonly();
  readonly isLoggedIn = computed(() => this._token() !== '');

  constructor(private http: HttpClient) {}

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
    localStorage.removeItem(this.tokenStorageKey);
    localStorage.removeItem(this.usernameStorageKey);
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
    localStorage.setItem(this.tokenStorageKey, token);
    localStorage.setItem(this.usernameStorageKey, username);
    this._token.set(token);
    this._username.set(username);
  }
}
