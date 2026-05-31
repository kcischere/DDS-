import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    NgIf,
    RouterLink
  ],
  templateUrl: './register.component.html',
  // Change "styleUrl" to "styles" and paste this block to fix the compilation error:
  styles: [`
    :host {
      display: block;
      background-color: #f5f5f5;
      min-height: 100vh;
      width: 100%;
    }
  `]
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  name = '';
  username = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  onRegister() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.name || !this.username || !this.password) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    this.authService.register({ name: this.name, username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Registration failed. Try again.';
        console.error(err);
      }
    });
  }
}