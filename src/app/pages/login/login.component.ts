import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

interface LoginFormValue {
  email: string;
  password: string;
  rememberMe: boolean;
}

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    CheckboxModule,
    ToastModule,
    MessageModule,
    IconFieldModule,
    InputIconModule,
  ],
  providers: [MessageService],
  template: `
    <p-toast />

    <div
      class="min-h-screen flex w-full bg-surface-100 dark:bg-slate-950 overflow-hidden transition-colors duration-300"
      role="main"
    >
      <!-- Login Form Section -->
      <section
        class="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative z-10 "
        aria-label="Login form"
      >
        <div
          class="w-full max-w-xl space-y-8 animate-fade-in-up p-8 rounded-2xl shadow-xl dark:border dark:border-primary-800"
        >
          <!-- Header -->
          <header class="text-center lg:text-left">
            <div
              class="inline-block p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-6"
            >
              <i class="pi pi-sign-in text-2xl"></i>
            </div>
            <h1
              class="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2"
            >
              Welcome Back
            </h1>
            <p class="text-slate-500 dark:text-slate-400 text-lg">
              Please enter your details to sign in.
            </p>
          </header>

          <form
            [formGroup]="loginForm"
            (ngSubmit)="onSubmit()"
            class="mt-8 space-y-6"
          >
            <div class="space-y-5">
              <!-- Email Field -->
              <div class="flex flex-col gap-2">
                <label
                  for="email"
                  class="font-semibold text-slate-700 dark:text-slate-300"
                >
                  Email Address
                </label>
                <p-iconfield class="w-full">
                  <p-inputicon class="pi pi-envelope" />
                  <input
                    id="email"
                    pInputText
                    type="email"
                    formControlName="email"
                    placeholder="name@company.com"
                    pSize="large"
                    fluid="true"
                    autocomplete="email"
                  />
                </p-iconfield>
                @if (emailInvalid()) {
                <p-message
                  id="email-error"
                  severity="error"
                  styleClass="w-full"
                  >{{ emailErrorMessage() }}</p-message
                >
                }
              </div>

              <div class="flex flex-col gap-2">
                <label
                  for="password"
                  class="font-semibold text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
                <p-password
                  inputId="password"
                  formControlName="password"
                  [feedback]="false"
                  [toggleMask]="true"
                  size="large"
                  fluid="true"
                  placeholder="••••••••"
                  autocomplete="current-password"
                />
                @if (passwordInvalid()) {
                <p-message
                  id="password-error"
                  severity="error"
                  styleClass="w-full"
                  >Password must be at least 6 characters</p-message
                >
                }
              </div>

              <div class="flex items-center justify-between pt-2">
                <div class="flex items-center gap-2">
                  <p-checkbox
                    [binary]="true"
                    formControlName="rememberMe"
                    inputId="remember"
                  />
                  <label
                    for="remember"
                    class="text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  class="text-sm font-semibold text-indigo-600 dark:text-primary-400 hover:text-indigo-500 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              pButton
              type="submit"
              label="Sign In"
              icon="pi pi-sign-in"
              class="w-full p-button-lg bg-indigo-600 border-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none"
              [loading]="isLoading()"
              [disabled]="loginForm.invalid || isLoading()"
              [attr.aria-busy]="isLoading()"
            ></button>

            <div class="text-center mt-6">
              <p class="text-slate-600 dark:text-slate-400">
                Don't have an account?
                <a
                  routerLink="/pages/register"
                  class="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors cursor-pointer"
                  >Sign up for free</a
                >
              </p>
            </div>
          </form>
        </div>
      </section>

      <!-- side image Section -->
      <aside
        class="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden"
      >
        <div
          class="absolute inset-0 bg-gradient-to-br from-indigo-800 via-purple-900 to-black 
         dark:bg-linear-to-br dark:from-indigo-900 dark:via-slate-900 dark:to-black"
        ></div>

        <div
          class="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"
        ></div>
        <div
          class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"
        ></div>

        <div
          class="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-12 rounded-3xl max-w-lg text-center shadow-2xl"
        >
          <div class="mb-6 flex justify-center">
            <div
              class="w-16 h-16 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <i class="pi pi-star-fill text-3xl text-white"></i>
            </div>
          </div>
          <h2 class="text-3xl font-bold text-white mb-4">
            Start your AI journey
          </h2>
          <p class="text-indigo-100 text-lg leading-relaxed mb-8">
            Join thousands of developers and creators using our platform to
            transform media into actionable data.
          </p>

          <!-- User Avatars -->
          <div class="flex items-center justify-center gap-2 mt-8">
            <div class="flex -space-x-3">
              <div
                class="w-10 h-10 rounded-full border-2 border-white bg-linear-to-br from-blue-400 to-blue-600"
              ></div>
              <div
                class="w-10 h-10 rounded-full border-2 border-white bg-linear-to-br from-purple-400 to-purple-600"
              ></div>
              <div
                class="w-10 h-10 rounded-full border-2 border-white bg-linear-to-br from-pink-400 to-pink-600"
              ></div>
              <div
                class="w-10 h-10 rounded-full border-2 border-white bg-white flex items-center justify-center text-xs font-bold text-indigo-900"
              >
                +1k
              </div>
            </div>
            <span class="text-indigo-100 text-sm font-medium ml-2"
              >Active users</span
            >
          </div>
        </div>
      </aside>
    </div>
  `,
  styles: `
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

    
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  isLoading = signal(false);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  emailInvalid(): boolean {
    const control = this.loginForm.get('email');
    return !!(control?.errors?.['email'] && control?.touched); //only display invalid email error
  }

  emailErrorMessage(): string {
    const control = this.loginForm.get('email');
    if (control?.hasError('required')) {
      return 'Email is required';
    }
    if (control?.hasError('email')) {
      return 'Invalid email address';
    }
    return '';
  }

  passwordInvalid(): boolean {
    const control = this.loginForm.get('password');
    return !!(control?.errors?.['minlength'] && control?.touched); // only display minlength required
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const formValue = this.loginForm.value as LoginFormValue;
    console.log(this.loginForm.value);
    console.log(formValue);
    const credentials = {
      email: formValue.email,
      password: formValue.password,
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Welcome Back',
          detail: `Hello, ${response.user.displayName}!`,
          life: 3000,
        });

        setTimeout(() => this.router.navigate(['/']), 800);
      },
      error: (err) => {
        this.isLoading.set(false);

        const errorMessage = this.extractErrorMessage(err);

        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: errorMessage,
          life: 5000,
        });
      },
    });
  }

  private extractErrorMessage(err: any): string {
    if (err.error) {
      if (typeof err.error === 'string') {
        return err.error;
      }
      if (err.error.message) {
        return err.error.message;
      }
    }
    return 'Invalid email or password';
  }
}
