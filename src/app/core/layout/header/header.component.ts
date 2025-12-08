import {
  Component,
  inject,
  computed,
  signal,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  imports: [RouterLink, MenubarModule, ButtonModule, TooltipModule],
  template: `
    <header class="sticky top-0 z-50 w-full">
      <nav
        class="w-full bg-surface-0 dark:bg-surface-900/50 backdrop-blur-md border-b border-surface-200/60 dark:border-surface-800 shadow-sm transition-all duration-300"
      >
        <div class="container mx-auto px-4">
          <p-menubar
            [model]="items"
            class="bg-transparent border-none p-2 rounded-none"
          >
            <ng-template pTemplate="start">
              <a
                routerLink="/"
                class="flex items-center gap-3 group outline-none"
              >
                <div
                  class="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-sm"
                >
                  <i class="pi pi-bolt text-xl"></i>
                </div>
                <div class="flex flex-col">
                  <span
                    class="text-xl font-bold tracking-tight text-surface-800 dark:text-surface-100 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors"
                  >
                    AI Solutions
                  </span>
                </div>
              </a>
            </ng-template>

            <ng-template pTemplate="end">
              <div class="flex items-center gap-2 sm:gap-4">
                <button
                  pButton
                  [icon]="isDarkMode() ? 'pi pi-moon' : 'pi pi-sun'"
                  class="p-button-rounded p-button-text p-button-plain w-10 h-10 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                  (click)="toggleDarkMode()"
                ></button>

                @if (!userSignal()) {
                <a
                  routerLink="/pages/login"
                  class="hidden sm:block text-sm font-semibold text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors px-3 py-2 cursor-pointer"
                >
                  Sign in
                </a>
                <button
                  pButton
                  label="Get Started"
                  routerLink="/pages/register"
                  class="p-button-rounded bg-primary-600 border-primary-600 hover:bg-primary-700 font-bold px-6 shadow-md shadow-primary-200 dark:shadow-none"
                ></button>
                } @else {
                <div
                  class="flex items-center gap-3 pl-4 border-l border-surface-200 dark:border-surface-700"
                >
                  <div class="hidden md:flex flex-col items-end">
                    <span
                      class="text-[10px] uppercase font-bold text-surface-400 dark:text-surface-500 tracking-wider"
                      >User</span
                    >
                    <span
                      class="text-sm font-bold text-surface-800 dark:text-surface-200"
                    >
                      {{ userSignal()?.displayName }}
                    </span>
                  </div>

                  <div
                    class="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold border-2 border-white dark:border-surface-800 shadow-sm"
                  >
                    {{ userSignal()?.displayName?.charAt(0)?.toUpperCase() }}
                  </div>

                  <button
                    pButton
                    icon="pi pi-power-off"
                    (click)="authService.logout()"
                    class="p-button-rounded p-button-text p-button-danger hover:bg-red-50 dark:hover:bg-red-900/20 w-9 h-9"
                    pTooltip="Logout"
                    tooltipPosition="bottom"
                  ></button>
                </div>
                }
              </div>
            </ng-template>
          </p-menubar>
        </div>
      </nav>
    </header>
  `,
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class HeaderComponent {
  readonly authService = inject(AuthService);
  private readonly document = inject(DOCUMENT);

  readonly userSignal = computed(() => this.authService.currentUser());

  readonly isDarkMode = signal(false);

  readonly items: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: '/',
      styleClass: 'font-medium',
    },
    {
      label: 'Subscription',
      icon: 'pi pi-star',
      routerLink: '/subscription',
      styleClass: 'font-medium',
    },
    {
      label: 'Services',
      icon: 'pi pi-objects-column',
      styleClass: 'font-medium',
      items: [
        {
          label: 'Image Parser',
          icon: 'pi pi-image',
          routerLink: '/features/image-parser',
        },
        {
          label: 'Speech to Text',
          icon: 'pi pi-microphone',
          routerLink: '/features/stt',
        },
        {
          label: 'Text to Speech',
          icon: 'pi pi-volume-up',
          routerLink: '/features/tts',
        },
      ],
    },
  ];

  constructor() {
    // Initialize theme from localStorage
    this.initializeTheme();

    //React to dark mode (signal) changes automatically
    effect(() => {
      this.updateTheme();
      this.persistTheme();
    });
  }

  toggleDarkMode(): void {
    this.isDarkMode.update((v) => !v);
  }

  private initializeTheme(): void {
    const savedTheme = this.getStoredTheme();
    if (savedTheme === 'dark') {
      this.isDarkMode.set(true);
    }
  }

  private updateTheme(): void {
    const html = this.document.documentElement;
    const isDark = this.isDarkMode();

    html.classList.toggle('my-app-dark', isDark);
    //html.classList.toggle('dark', isDark);
  }

  private persistTheme(): void {
    const theme = this.isDarkMode() ? 'dark' : 'light';
    this.setStoredTheme(theme);
  }

  private getStoredTheme(): string | null {
    return localStorage.getItem('theme');
  }

  private setStoredTheme(theme: string): void {
    localStorage.setItem('theme', theme);
  }
}
