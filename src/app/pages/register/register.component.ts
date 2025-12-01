import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

// PrimeNG
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink,
    CardModule, 
    InputTextModule, 
    ButtonModule, 
    PasswordModule
  ],
  providers: [MessageService],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div class="w-full max-w-md">
        <p-card header="Create Account" styleClass="shadow-lg">
          <p class="text-gray-500 mb-5">Join AI Solutions today</p>
          
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
            
            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Full Name</label>
              <input pInputText formControlName="name" class="w-full" />
            </div>

            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Email</label>
              <input pInputText formControlName="email" class="w-full" />
            </div>

            <div class="flex flex-col gap-2">
              <label class="font-medium text-gray-700">Password</label>
              <p-password 
                formControlName="password" 
                [toggleMask]="true" 
                styleClass="w-full" 
                inputStyleClass="w-full">
              </p-password>
            </div>

            <button 
              pButton 
              label="Sign Up" 
              type="submit" 
              class="w-full p-button-success mt-4" 
              [loading]="loading"
              [disabled]="registerForm.invalid">
            </button>

            <div class="text-center mt-4">
               <a routerLink="/pages/login" class="text-primary-600 font-bold hover:underline">Already have an account? Login</a>
            </div>
          </form>
        </p-card>
      </div>
    </div>
  `
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  loading = false;

  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']); // Redirect home after register
        },
        error: () => this.loading = false
      });
    }
  }
}