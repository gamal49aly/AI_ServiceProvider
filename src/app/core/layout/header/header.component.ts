import { Component, inject, computed, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, MenubarModule, ButtonModule],
  template: `
    <header class="sticky top-0 z-50 w-full">
      <nav class="w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800 shadow-sm transition-all duration-300">
        <div class= "container mx-auto px-4">
          <p-menubar [model]="items" styleClass="bg-transparent border-none p-2 rounded-none">
            
            <ng-template pTemplate="start">
              <a routerLink="/" class="flex items-center gap-3 group outline-none">
                <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  <i class="pi pi-bolt text-xl"></i>
                </div>
                <div class="flex flex-col">
                  <span class="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
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
                  class="p-button-rounded p-button-text p-button-plain w-10 h-10 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  (click)="toggleDarkMode()">
                </button>

                @if (!userSignal()) {
                  <a 
                    routerLink="/pages/login" 
                    class="hidden sm:block text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-2 cursor-pointer">
                    Sign in
                  </a>
                  <button 
                    pButton 
                    label="Get Started" 
                    routerLink="/pages/register" 
                    class="p-button-rounded bg-indigo-600 border-indigo-600 hover:bg-indigo-700 font-bold px-6 shadow-md shadow-indigo-200 dark:shadow-none">
                  </button>
                }
                
                @else {
                  <div class="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                    
                    <div class="hidden md:flex flex-col items-end">
                      <span class="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">User</span>
                      <span class="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {{ userSignal()?.displayName }}
                      </span>
                    </div>
                    
                    <div class="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold border-2 border-white dark:border-slate-800 shadow-sm">
                      {{ userSignal()?.displayName?.charAt(0)?.toUpperCase() }}
                    </div>
                    
                    <button 
                      pButton 
                      icon="pi pi-power-off" 
                      (click)="authService.logout()" 
                      class="p-button-rounded p-button-text p-button-danger hover:bg-red-50 dark:hover:bg-red-900/20 w-9 h-9"
                      pTooltip="Logout"
                      tooltipPosition="bottom">
                    </button>
                  </div>
                }
                
              </div>
            </ng-template>
            
          </p-menubar>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    :host { display: block; }
    header { position: sticky; top: 0; z-index: 1000; }
    
    /* Dark mode overrides for Menubar */
    ::ng-deep .p-menubar .p-menuitem-link .p-menuitem-text {
        color: #475569;
    }
    ::ng-deep .my-app-dark .p-menubar .p-menuitem-link .p-menuitem-text {
        color: #cbd5e1;
    }
    ::ng-deep .p-menubar .p-menuitem-link:hover {
        background: rgb(241 245 249) !important;
    }
    ::ng-deep .my-app-dark .p-menubar .p-menuitem-link:hover {
        background: rgb(30 41 59) !important;
    }
    ::ng-deep .p-menubar .p-submenu-list {
        background: white;
        border-color: #e2e8f0;
    }
    ::ng-deep .my-app-dark .p-menubar .p-submenu-list {
        background: #0f172a; 
        border-color: #1e293b; 
    }
  `]
})
export class HeaderComponent implements OnInit {
  authService = inject(AuthService);
  document = inject(DOCUMENT); // To access <html> tag

  userSignal = computed(() => this.authService.currentUser());
  isDarkMode = signal(false);

  items = [
    { label: 'Home', icon: 'pi pi-home', routerLink: '/', styleClass: 'font-medium' },
    { label: 'Subscription', icon: 'pi pi-star', routerLink: '/subscription', styleClass: 'font-medium' },
    {
      label: 'Services',
      icon: 'pi pi-objects-column',
      styleClass: 'font-medium',
      items: [
        { label: 'Image Parser', icon: 'pi pi-image', routerLink: '/features/image-parser' },
        { label: 'Speech to Text', icon: 'pi pi-microphone', routerLink: '/features/stt' },
        { label: 'Text to Speech', icon: 'pi pi-volume-up', routerLink: '/features/tts' }
      ]
    }
  ];

  ngOnInit() {
    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode.set(true);
      this.updateTheme();
    }
  }

  toggleDarkMode() {
    this.isDarkMode.update(v => !v);
    localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
    this.updateTheme();
  }

  updateTheme() {
    const html = this.document.documentElement;
    if (this.isDarkMode()) {
      html.classList.add('my-app-dark'); // For PrimeNG
      html.classList.add('dark');        // For Tailwind
    } else {
      html.classList.remove('my-app-dark');
      html.classList.remove('dark');
    }
  }
}