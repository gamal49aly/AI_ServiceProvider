import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    InputTextModule, ButtonModule, PasswordModule, CheckboxModule, ToastModule
  ],
  // MessageService required for PrimeNG Toast notifications
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <div class="min-h-screen flex w-full bg-white dark:bg-slate-900 overflow-hidden">
      
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative z-10">
        <div class="w-full max-w-md space-y-8 animate-fade-in-up">
          
          <div class="text-center lg:text-left">
            <div class="inline-block p-3 rounded-2xl bg-indigo-50 text-indigo-600 mb-6">
               <i class="pi pi-bolt text-2xl"></i>
            </div>
            <h2 class="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome Back</h2>
            <p class="text-slate-500 text-lg">Please enter your details to sign in.</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
            
            <div class="space-y-5">
              <div class="flex flex-col gap-2">
                <label class="font-semibold text-slate-700">Email Address</label>
                <span class="p-input-icon-left w-full">
                    <i class="pi pi-envelope text-slate-400 z-10"></i>
                    <input pInputText formControlName="email" placeholder="name@company.com" class="w-full p-inputtext-lg pl-10" 
                           [ngClass]="{'ng-invalid ng-dirty': loginForm.get('email')?.touched && loginForm.get('email')?.invalid}" />
                </span>
                <small class="text-red-500 animate-pulse" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.hasError('required')">
                    Email is required
                </small>
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-semibold text-slate-700">Password</label>
                <p-password formControlName="password" [feedback]="false" [toggleMask]="true" 
                            styleClass="w-full" inputStyleClass="w-full p-inputtext-lg" placeholder="••••••••"></p-password>
                <small class="text-red-500 animate-pulse" *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.hasError('required')">
                    Password is required
                </small>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <p-checkbox [binary]="true" formControlName="rememberMe" inputId="remember"></p-checkbox>
                  <label for="remember" class="text-sm text-slate-600 cursor-pointer select-none">Remember for 30 days</label>
                </div>
                <a class="text-sm font-bold text-indigo-600 hover:text-indigo-500 cursor-pointer">Forgot password?</a>
              </div>
            </div>

            <button pButton label="Sign In" class="w-full p-button-lg bg-indigo-600 border-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200" 
                    [loading]="loading" type="submit"></button>

            <div class="text-center mt-6">
               <p class="text-slate-600">
                 Don't have an account? 
                 <a routerLink="/pages/register" class="font-bold text-indigo-600 hover:text-indigo-500 transition-colors cursor-pointer">Sign up for free</a>
               </p>
            </div>
          </form>
        </div>
      </div>

      <div class="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black"></div>
        
        <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
        <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div class="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-12 rounded-3xl max-w-lg text-center shadow-2xl">
            <div class="mb-6 flex justify-center">
                <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <i class="pi pi-star-fill text-3xl text-yellow-400"></i>
                </div>
            </div>
            <h3 class="text-3xl font-bold text-white mb-4">Start your AI journey</h3>
            <p class="text-indigo-100 text-lg leading-relaxed">
                Join thousands of developers and creators using our platform to transform media into actionable data.
            </p>
            
            <div class="flex items-center justify-center -space-x-4 mt-8">
                <div class="w-10 h-10 rounded-full border-2 border-indigo-900 bg-gray-300"></div>
                <div class="w-10 h-10 rounded-full border-2 border-indigo-900 bg-gray-400"></div>
                <div class="w-10 h-10 rounded-full border-2 border-indigo-900 bg-gray-500"></div>
                <div class="w-10 h-10 rounded-full border-2 border-indigo-900 bg-white flex items-center justify-center text-xs font-bold text-indigo-900">+2k</div>
            </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    /* Custom Keyframe Animations */
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
export class LoginComponent {
  // Dependency Injection
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  messageService = inject(MessageService);

  loading = false;

  // Reactive Form Initialization
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  });

  /**
   * Handles form submission.
   * Calls AuthService to authenticate user and redirects to Home on success.
   */

onSubmit() {
  if (this.loginForm.valid) {
    this.loading = true;
    
    const credentials = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    };
    
    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Welcome Back',
          detail: `Hello, ${response.user.displayName}!`
        });
        
        setTimeout(() => this.router.navigate(['/']), 800);
      },
      error: (err) => {
        console.error('Login Error:', err);
        this.loading = false;
        
        const errorMessage = err.error?.message || err.error || 'Invalid email or password';
        
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: errorMessage
        });
      }
    });
  }
}


  



}