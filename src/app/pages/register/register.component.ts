import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    InputTextModule, ButtonModule, PasswordModule, ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <div class="min-h-screen flex w-full bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative z-10">
        <div class="w-full max-w-md space-y-8 animate-fade-in-up">
          
          <div class="text-center lg:text-left">
            <div class="inline-block p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-6">
               <i class="pi pi-user-plus text-2xl"></i>
            </div>
            <h2 class="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Create Account</h2>
            <p class="text-slate-500 dark:text-slate-400 text-lg">Join us today and start your journey.</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
            
            <div class="space-y-4">
              <div class="flex flex-col gap-2">
                <label class="font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                <span class="p-input-icon-left w-full">
                  <i class="pi pi-user text-slate-400 z-10"></i>
                  <input 
                    pInputText 
                    formControlName="displayName" 
                    placeholder="John Doe" 
                    class="w-full p-inputtext-lg pl-10" 
                  />
                </span>
                <small class="text-red-500" 
                  *ngIf="registerForm.get('displayName')?.touched && registerForm.get('displayName')?.hasError('required')">
                  Name is required
                </small>
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <span class="p-input-icon-left w-full">
                    <i class="pi pi-envelope text-slate-400 z-10"></i>
                    <input pInputText formControlName="email" placeholder="name@company.com" class="w-full p-inputtext-lg pl-10" />
                </span>
                <small class="text-red-500" *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.hasError('email')">Invalid email address</small>
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <p-password formControlName="password" [toggleMask]="true" 
                            styleClass="w-full" inputStyleClass="w-full p-inputtext-lg" placeholder="••••••••"
                            [strongLabel]="'Strong'" [weakLabel]="'Weak'" [mediumLabel]="'Medium'">
                </p-password>
                <small class="text-slate-400 text-xs">Must contain uppercase, symbol, and number.</small>
              </div>
            </div>

            <button pButton label="Create Account" class="w-full p-button-lg bg-indigo-600 border-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none" 
                    [loading]="loading" type="submit" [disabled]="registerForm.invalid"></button>

            <div class="text-center mt-6">
               <p class="text-slate-600 dark:text-slate-400">
                 Already have an account? 
                 <a routerLink="/pages/login" class="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors cursor-pointer">Sign in</a>
               </p>
            </div>
          </form>
        </div>
      </div>

      <div class="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-bl from-indigo-900 via-slate-900 to-black"></div>
        <div class="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
        <div class="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div class="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-12 rounded-3xl max-w-lg text-center shadow-2xl">
            <h3 class="text-3xl font-bold text-white mb-4">Join the Future</h3>
            <p class="text-indigo-100 text-lg leading-relaxed">
                Unlock the full potential of AI-driven media processing. Sign up now to access all premium features.
            </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeUp 0.6s ease-out forwards;
    }
    @keyframes blob {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    .animate-blob {
      animation: blob 10s infinite;
    }
    .animation-delay-2000 {
      animation-delay: 2s;
    }
  `]
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  messageService = inject(MessageService);

  loading = false;

  registerForm = this.fb.group({
    displayName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;

      const registerData = {
        email: this.registerForm.value.email!,
        password: this.registerForm.value.password!,
        displayName: this.registerForm.value.displayName!
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Account created successfully! Please login.'
          });

          setTimeout(() => this.router.navigate(['/pages/login']), 1500);
        },
        error: (err) => {
          this.loading = false;
          console.error('Registration Error Details:', err);

          let errorMessage = 'Registration failed.';

          if (err.error) {
            if (err.error.errors) {
              const firstKey = Object.keys(err.error.errors)[0];
              if (firstKey && err.error.errors[firstKey].length > 0) {
                errorMessage = err.error.errors[firstKey][0];
              }
            } else if (typeof err.error === 'string') {
              errorMessage = err.error;
            }
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Validation Error',
            detail: errorMessage,
            life: 5000
          });
        }
      });
    }
  }
}