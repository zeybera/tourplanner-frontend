import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient) {}

  async login(username: string, password: string): Promise<boolean> {
    try {
      const response: any = await firstValueFrom(
        this.http.post('http://localhost:8080/api/auth/login', { username, password })
      );
      localStorage.setItem('token', response.token);
      localStorage.setItem('username', response.username);
      return true;
    } catch {
      return false;
    }
  }

  async register(username: string, password: string): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.post('http://localhost:8080/api/auth/register', { username, password }, { responseType: 'text' })
      );
      return true;
    } catch {
      return false;
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
}
