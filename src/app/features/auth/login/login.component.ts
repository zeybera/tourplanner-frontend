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
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  showRegister = false;

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    const success = await this.authService.login(this.username, this.password);

    this.isLoading = false;

    if (success) {
      this.router.navigate(['/tours']);
    } else {
      this.errorMessage = 'Wrong username or password. Please try again.';
    }
  }

  async register() {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    const success = await this.authService.register(this.username, this.password);

    if (success) {
      this.successMessage = 'Registered successfully! Logging you in...';
      await this.login();
    } else {
      this.isLoading = false;
      this.errorMessage = 'Username already taken. Please choose another.';
    }
  }
}
