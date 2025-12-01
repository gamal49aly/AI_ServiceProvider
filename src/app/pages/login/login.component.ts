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
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink,
    CardModule, 
    InputTextModule, 
    ButtonModule, 
    PasswordModule, 
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div class="w-full max-w-md">
        <p-card header="Welcome Back" styleClass="shadow-lg">
          <p class="text-gray-500 mb-5">Sign in to access AI Solutions</p>
          
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
            
            <div class="flex flex-col gap-2">
              <label for="email" class="font-medium text-gray-700">Email</label>
              <input 
                pInputText 
                id="email" 
                formControlName="email" 
                placeholder="example@email.com" 
                class="w-full" 
                [ngClass]="{'ng-invalid ng-dirty': loginForm.get('email')?.touched && loginForm.get('email')?.invalid}"
              />
              <small class="text-red-500" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.hasError('required')">Email is required.</small>
            </div>

            <div class="flex flex-col gap-2">
              <label for="password" class="font-medium text-gray-700">Password</label>
              <p-password 
                id="password" 
                formControlName="password" 
                [feedback]="false" 
                [toggleMask]="true" 
                styleClass="w-full" 
                inputStyleClass="w-full">
              </p-password>
              <small class="text-red-500" *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.hasError('required')">Password is required.</small>
            </div>

            <div class="flex justify-between items-center mt-2">
              <a routerLink="/pages/register" class="text-primary-600 hover:underline text-sm">Create account?</a>
            </div>

            <button 
              pButton 
              label="Sign In" 
              type="submit" 
              class="w-full p-button-primary mt-2" 
              [loading]="loading"
              [disabled]="loginForm.invalid">
            </button>
          </form>
        </p-card>
      </div>
    </div>
  `
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  messageService = inject(MessageService);

  loading = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (user) => {
          this.messageService.add({severity:'success', summary:'Success', detail:'Logged in successfully'});
          setTimeout(() => this.router.navigate(['/']), 500);
        },
        error: (err) => {
          this.loading = false;
          this.messageService.add({severity:'error', summary:'Error', detail:'Invalid credentials'});
        }
      });
    }
  }
}