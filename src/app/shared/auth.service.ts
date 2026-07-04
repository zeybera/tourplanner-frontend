import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface AuthResult {
  success: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient) {}

  async login(username: string, password: string): Promise<AuthResult> {
    try {
      const response: any = await firstValueFrom(
        this.http.post('http://localhost:8080/api/auth/login', { username, password })
      );
      localStorage.setItem('token', response.token);
      localStorage.setItem('username', response.username);
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
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }

  get isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  get token(): string {
    return localStorage.getItem('token') ?? '';
  }

  get username(): string {
    return localStorage.getItem('username') ?? '';
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
}
