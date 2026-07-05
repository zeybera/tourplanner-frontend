import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  showRegister = false;

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    const result = await this.authService.login(this.username, this.password);

    this.isLoading = false;

    if (result.success) {
      this.router.navigate(['/tours']);
    } else {
      this.errorMessage = result.message ?? 'Wrong username or password. Please try again.';
    }
  }

  async register() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (this.username.trim() === '') {
      this.errorMessage = 'Username is required.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    this.isLoading = true;

    const result = await this.authService.register(this.username, this.password);

    if (result.success) {
      this.successMessage = 'Registered successfully! Logging you in...';
      await this.login();
    } else {
      this.isLoading = false;
      this.errorMessage = result.message ?? 'Registration failed.';
    }
  }

  switchToRegister(): void {
    this.showRegister = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.confirmPassword = '';
  }

  switchToLogin(): void {
    this.showRegister = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.confirmPassword = '';
  }
}
