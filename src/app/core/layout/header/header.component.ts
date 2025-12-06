import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, MenubarModule, ButtonModule],
  template: `
    <header class="sticky top-0 z-50 w-full">
      <nav class="w-full bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm transition-all duration-300">
        <div class="container mx-auto px-4">
          <p-menubar [model]="items" styleClass="bg-transparent border-none p-2 rounded-none">
            
            <!-- Logo Section -->
            <ng-template pTemplate="start">
              <a routerLink="/" class="flex items-center gap-3 group outline-none">
                <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  <i class="pi pi-bolt text-xl"></i>
                </div>
                <div class="flex flex-col">
                  <span class="text-xl font-bold tracking-tight text-slate-800 group-hover:text-indigo-700 transition-colors">
                    AI Solutions
                  </span>
                </div>
              </a>
            </ng-template>

            <!-- User Actions Section -->
            <ng-template pTemplate="end">
              <div class="flex items-center gap-2 sm:gap-4">
                
                <!-- NOT LOGGED IN -->
                @if (!userSignal()) {
                  <a 
                    routerLink="/pages/login" 
                    class="hidden sm:block text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors px-3 py-2 cursor-pointer">
                    Sign in
                  </a>
                  <button 
                    pButton 
                    label="Get Started" 
                    routerLink="/pages/register" 
                    class="p-button-rounded bg-indigo-600 border-indigo-600 hover:bg-indigo-700 font-bold px-6 shadow-md shadow-indigo-200">
                  </button>
                }
                
                <!-- LOGGED IN -->
                @else {
                  <div class="flex items-center gap-3 pl-4 border-l border-slate-200">
                    
                    <!-- User Info (Hidden on Mobile) -->
                    <div class="hidden md:flex flex-col items-end">
                      <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">User</span>
                      <span class="text-sm font-bold text-slate-800">
                        {{ userSignal()?.displayName }}
                      </span>
                    </div>
                    
                    <!-- User Avatar -->
                    <div class="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
                      {{ userSignal()?.displayName?.charAt(0)?.toUpperCase() }}
                    </div>
                    
                    <!-- Logout Button -->
                    <button 
                      pButton 
                      icon="pi pi-power-off" 
                      (click)="authService.logout()" 
                      class="p-button-rounded p-button-text p-button-danger hover:bg-red-50 w-9 h-9"
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
    :host {
      display: block;
    }

    /* Ensure proper z-index layering */
    header {
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    /* Smooth transitions */
    .transition-colors {
      transition: color 0.3s ease;
    }

    .transition-all {
      transition: all 0.3s ease;
    }

    /* Custom hover effects */
    .group:hover .group-hover\:bg-indigo-600 {
      background-color: rgb(79 70 229);
    }

    .group:hover .group-hover\:text-white {
      color: white;
    }

    .group:hover .group-hover\:text-indigo-700 {
      color: rgb(67 56 202);
    }

    /* Responsive adjustments */
    @media (max-width: 640px) {
      .container {
        padding-left: 1rem;
        padding-right: 1rem;
      }
    }

    /* PrimeNG Menubar overrides */
    ::ng-deep .p-menubar {
      background: transparent !important;
      border: none !important;
      padding: 0.5rem 0 !important;
    }

    ::ng-deep .p-menubar .p-menubar-root-list {
      align-items: center;
    }

    ::ng-deep .p-menubar .p-menuitem-link {
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
    }

    ::ng-deep .p-menubar .p-menuitem-link:hover {
      background: rgb(238 242 255) !important;
    }

    ::ng-deep .p-menubar .p-submenu-list {
      border-radius: 0.75rem;
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
      border: 1px solid rgb(226 232 240);
      padding: 0.5rem;
    }
  `]
})
export class HeaderComponent {
  authService = inject(AuthService);
  
  // Computed signal for reactive user state
  userSignal = computed(() => this.authService.currentUser());

  // Menu Items Configuration
  items = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: '/',
      styleClass: 'font-medium text-slate-600 hover:text-indigo-600'
    },
    {
      label: 'Services',
      icon: 'pi pi-objects-column',
      styleClass: 'font-medium text-slate-600 hover:text-indigo-600',
      items: [
        {
          label: 'Image Parser',
          icon: 'pi pi-image',
          routerLink: '/features/image-parser'
        },
        {
          label: 'Speech to Text',
          icon: 'pi pi-microphone',
          routerLink: '/features/stt'
        },
        {
          label: 'Text to Speech',
          icon: 'pi pi-volume-up',
          routerLink: '/features/tts'
        }
      ]
    }
  ];
}