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

            <ng-template pTemplate="end">
              <div class="flex items-center gap-2 sm:gap-4">
                
                @if (!userSignal()) {
                  <a routerLink="/pages/login" class="hidden sm:block text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors px-3 py-2 cursor-pointer">
                    Sign in
                  </a>
                  
                  <button pButton 
                          label="Get Started" 
                          routerLink="/pages/register" 
                          class="p-button-rounded bg-indigo-600 border-indigo-600 hover:bg-indigo-700 font-bold px-6 shadow-md shadow-indigo-200">
                  </button>
                } 
                @else {
                  <div class="flex items-center gap-3 pl-4 border-l border-slate-200">
                    
                    <div class="hidden md:flex flex-col items-end">
                      <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">User</span>
                      <span class="text-sm font-bold text-slate-800">{{ userSignal()?.name }}</span>
                    </div>

                    <div class="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
                      {{ userSignal()?.name?.charAt(0)?.toUpperCase() }}
                    </div>

                    <button pButton 
                            icon="pi pi-power-off" 
                            (click)="authService.logout()" 
                            class="p-button-rounded p-button-text p-button-danger hover:bg-red-50 w-9 h-9">
                    </button>
                  </div>
                }
              </div>
            </ng-template>

          </p-menubar>
        </div>
      </nav>
    </header>
  `
})
export class HeaderComponent {
  authService = inject(AuthService);
  userSignal = computed(() => this.authService.currentUser());

  // Menu Items
  items = [
  {
    label: 'Home',
    icon: 'pi pi-home',
    routerLink: '/',
    styleClass: 'font-medium text-slate-600 hover:text-indigo-600'
  },
  {
    label: 'Subscription',
    icon: 'pi pi-star',
    routerLink: '/subscription',
    styleClass: 'font-medium text-slate-600 hover:text-indigo-600'
  },
  {
    label: 'Services',
    icon: 'pi pi-objects-column',
    styleClass: 'font-medium text-slate-600',
    items: [
      { label: 'Image Parser', icon: 'pi pi-image', routerLink: '/features/image-parser' },
      { label: 'Speech to Text', icon: 'pi pi-microphone', routerLink: '/features/stt' },
      { label: 'Text to Speech', icon: 'pi pi-volume-up', routerLink: '/features/tts' }
    ]
  }
];
}