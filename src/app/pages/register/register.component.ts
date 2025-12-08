import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DividerModule } from 'primeng/divider';

// Custom Validators
function passwordStrengthValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return null;
  }

  const hasUpperCase = /[A-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

  const passwordValid = hasUpperCase && hasNumber && hasSpecialChar;

  return !passwordValid ? { passwordStrength: true } : null;
}

// Password Match Validator
function passwordMatchValidator(
  formGroup: AbstractControl
): ValidationErrors | null {
  const password = formGroup.get('password')?.value;
  const confirmPassword = formGroup.get('confirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword ? null : { passwordMismatch: true };
}

interface RegisterFormValue {
  displayName: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-register',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    ToastModule,
    MessageModule,
    IconFieldModule,
    InputIconModule,
    DividerModule,
  ],
  providers: [MessageService],
  template: `
    <p-toast />

    <div
      class="min-h-screen flex w-full bg-surface-100 dark:bg-slate-950 overflow-hidden transition-colors duration-300 "
      role="main"
    >
      <!-- Registration Form Section -->
      <section
        class="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative z-10"
        aria-label="Registration form"
      >
        <div
          class="w-full max-w-xl space-y-8 animate-fade-in-up   p-5 rounded-2xl shadow-xl dark:border dark:border-primary-800"
        >
          <!-- Header -->
          <header class="text-center lg:text-left">
            <div
              class="inline-block p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-6"
              aria-hidden="true"
            >
              <i class="pi pi-user-plus text-2xl"></i>
            </div>
            <h1
              class="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2"
            >
              Create Account
            </h1>
            <p class="text-slate-500 dark:text-slate-400 text-lg">
              Join us today and start your journey.
            </p>
          </header>

          <!-- Registration Form -->
          <form
            [formGroup]="registerForm"
            (ngSubmit)="onSubmit()"
            class="mt-8 space-y-6"
          >
            <div class="space-y-4 mb-12">
              <!-- Full Name Field -->
              <div class="flex flex-col gap-2">
                <label
                  for="displayName"
                  class="font-semibold text-slate-700 dark:text-slate-300"
                >
                  Full Name
                </label>
                <p-iconfield class="w-full">
                  <p-inputicon class="pi pi-user" />
                  <input
                    id="displayName"
                    pInputText
                    formControlName="displayName"
                    placeholder="John Doe"
                    pSize="large"
                    fluid="true"
                    autocomplete="name"
                  />
                </p-iconfield>
                @if (displayNameInvalid()) {
                <p-message
                  id="displayName-error"
                  variant="simple"
                  severity="error"
                  class="ml-4"
                  >Name is required</p-message
                >
                }
              </div>

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
                @if (registerForm.get('email')?.touched &&
                registerForm.get('email')?.invalid) {
                <p-message
                  id="email-error"
                  severity="error"
                  styleClass="w-full"
                  >{{ getemailErrorMessage() }}</p-message
                >
                }
              </div>

              <!-- Password Field -->
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
                  [toggleMask]="true"
                  size="large"
                  fluid="true"
                  placeholder="••••••••"
                  [feedback]="true"
                  autocomplete="new-password"
                >
                  <ng-template #footer>
                    <p-divider />
                    <ul class="pl-2 my-0 leading-normal">
                      <li>
                        Must be at least 6 characters with uppercase, symbol,
                        and number.
                      </li>
                    </ul>
                  </ng-template></p-password
                >
                <small id="password-hint" class="text-slate-400 text-xs">
                  Must be at least 6 characters with uppercase, symbol, and
                  number.
                </small>
                @if (passwordInvalid()) {
                <p-message
                  id="password-error"
                  severity="error"
                  styleClass="w-full"
                  >{{ passwordErrorMessage() }}</p-message
                >
                }
              </div>

              <!-- Confirm Password Field -->
              <div class="flex flex-col gap-2">
                <label
                  for="confirmPassword"
                  class="font-semibold text-slate-700 dark:text-slate-300"
                >
                  Confirm Password
                </label>
                <p-password
                  inputId="confirmPassword"
                  formControlName="confirmPassword"
                  [toggleMask]="true"
                  size="large"
                  fluid="true"
                  placeholder="••••••••"
                  [feedback]="false"
                  autocomplete="new-password"
                />
                @if (confirmPasswordInvalid()) {
                <p-message
                  id="confirmPassword-error"
                  severity="error"
                  styleClass="w-full"
                  >{{ confirmPasswordErrorMessage() }}</p-message
                >
                }
              </div>
            </div>

            <!-- Submit Button -->
            <button
              pButton
              type="submit"
              label="Create Account"
              icon="pi pi-user-plus"
              class="w-full p-button-lg bg-indigo-600 border-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none"
              [loading]="isLoading()"
              [disabled]="registerForm.invalid || isLoading()"
              [attr.aria-busy]="isLoading()"
            ></button>

            <!-- Sign In Link -->
            <div class="text-center mt-6">
              <p class="text-slate-600 dark:text-slate-400">
                Already have an account?
                <a
                  routerLink="/pages/login"
                  class="font-bold text-indigo-600 dark:text-primary-400 hover:text-indigo-500 transition-colors cursor-pointer"
                >
                  Sign in
                </a>
              </p>
            </div>
          </form>
        </div>
      </section>

      <!-- Hero Section -->
      <aside
        class="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden"
        aria-label="Welcome message"
      >
        <div
          class="absolute inset-0 bg-gradient-to-bl from-indigo-900 via-slate-900 to-black"
          aria-hidden="true"
        ></div>
        <div
          class="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"
          aria-hidden="true"
        ></div>
        <div
          class="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"
          aria-hidden="true"
        ></div>

        <div
          class="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-12 rounded-3xl max-w-lg text-center shadow-2xl"
        >
          <h2 class="text-3xl font-bold text-white mb-4">Join the Future</h2>
          <p class="text-indigo-100 text-lg leading-relaxed">
            Unlock the full potential of AI-driven media processing. Sign up now
            to access all premium features.
          </p>
        </div>
      </aside>
    </div>
  `,
  styles: `
    @keyframes fadeUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animate-fade-in-up {
      animation: fadeUp 0.6s ease-out forwards;
    }
    
    @keyframes blob {
      0% {
        transform: translate(0px, 0px) scale(1);
      }
      33% {
        transform: translate(30px, -50px) scale(1.1);
      }
      66% {
        transform: translate(-20px, 20px) scale(0.9);
      }
      100% {
        transform: translate(0px, 0px) scale(1);
      }
    }
    
    .animate-blob {
      animation: blob 10s infinite;
    }
    
    .animation-delay-2000 {
      animation-delay: 2s;
    }

    /* Ensure p-password takes full width */
    ::ng-deep p-password {
      display: block;
      width: 100%;
    }
  `,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  // Signals for reactive state
  isLoading = signal(false);

  registerForm: FormGroup = this.fb.group(
    {
      displayName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          passwordStrengthValidator,
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator }
  );

  displayNameInvalid(): boolean {
    const control = this.registerForm.get('displayName');
    return !!(control?.invalid && control?.touched);
  }

  emailInvalid(): boolean {
    const control = this.registerForm.get('email');
    return !!(control?.invalid && control?.touched);
  }

  getemailErrorMessage(): string {
    const control = this.registerForm.get('email');
    if (control?.hasError('required')) {
      return 'Email is required';
    }
    if (control?.hasError('email')) {
      return 'Invalid email address';
    }
    return '';
  }

  passwordInvalid(): boolean {
    const control = this.registerForm.get('password');
    return !!(control?.invalid && control?.touched);
  }

  passwordErrorMessage(): string {
    const control = this.registerForm.get('password');
    if (control?.hasError('required')) {
      return 'Password is required';
    }
    if (control?.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    }
    if (control?.hasError('passwordStrength')) {
      return 'Password must contain uppercase, number, and special character';
    }
    return '';
  }

  confirmPasswordInvalid(): boolean {
    const control = this.registerForm.get('confirmPassword');
    const formTouched = control?.touched;
    const hasError =
      control?.invalid || this.registerForm.hasError('passwordMismatch');
    return !!(hasError && formTouched);
  }

  confirmPasswordErrorMessage(): string {
    const control = this.registerForm.get('confirmPassword');
    if (control?.hasError('required')) {
      return 'Please confirm your password';
    }
    if (this.registerForm.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const formValue = this.registerForm.value as RegisterFormValue;

    this.authService.register(formValue).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Account created successfully! Redirecting to login...',
          life: 3000,
        });

        setTimeout(() => {
          this.router.navigate(['/pages/login']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading.set(false);

        const errorMessage = this.extractErrorMessage(err);

        this.messageService.add({
          severity: 'error',
          summary: 'Registration Failed',
          detail: errorMessage,
          life: 5000,
        });
      },
    });
  }

  private extractErrorMessage(err: any): string {
    // Handle different error response formats
    if (err.error) {
      // Handle validation errors object
      if (err.error.errors && typeof err.error.errors === 'object') {
        const firstKey = Object.keys(err.error.errors)[0];
        if (firstKey && Array.isArray(err.error.errors[firstKey])) {
          return err.error.errors[firstKey][0];
        }
      }

      // Handle string error message
      if (typeof err.error === 'string') {
        return err.error;
      }

      // Handle error message property
      if (err.error.message) {
        return err.error.message;
      }
    }

    // Default error message
    return 'Registration failed. Please try again.';
  }
}
