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
    <nav class="w-full backdrop-blur-md bg-white/80 border-b border-slate-100 shadow-sm transition-all">
      <div class="container mx-auto">
        <p-menubar [model]="items" styleClass="bg-transparent border-none px-4 py-3">
          <ng-template pTemplate="start">
            <div class="flex items-center gap-2 cursor-pointer group" routerLink="/">
              <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <i class="pi pi-bolt text-primary-600 text-2xl"></i>
              </div>
              <span class="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-indigo-700">
                AI Solutions
              </span>
            </div>
          </ng-template>

          <ng-template pTemplate="end">
            <div class="flex align-items-center gap-3">
              @if (!userSignal()) {
                <button pButton label="Login" icon="pi pi-user" class="p-button-text p-button-plain font-semibold" routerLink="/pages/login"></button>
                <button pButton label="Get Started" class="bg-gradient-to-r from-primary-600 to-indigo-600 border-none hover:from-primary-700 hover:to-indigo-700 font-bold px-6 py-3" routerLink="/pages/register"></button>
              } 
              @else {
                <div class="flex items-center gap-4 pl-4 border-l-2 border-slate-200">
                  <div class="flex flex-col items-end">
                      <span class="text-xs text-slate-500 font-medium">Welcome back,</span>
                      <span class="font-bold text-slate-800">{{ userSignal()?.name }}</span>
                  </div>
                  <button pButton icon="pi pi-sign-out" class="p-button-rounded p-button-danger p-button-text" (click)="authService.logout()" pTooltip="Logout" tooltipPosition="bottom"></button>
                </div>
              }
            </div>
          </ng-template>
        </p-menubar>
      </div>
    </nav>
  `
})
export class HeaderComponent {
  authService = inject(AuthService);
  userSignal = computed(() => this.authService.currentUser());

  items = [
    { label: 'Home', icon: 'pi pi-home text-lg', routerLink: '/', styleClass: 'font-medium' },
    {
      label: 'Services', icon: 'pi pi-objects-column text-lg', styleClass: 'font-medium', items: [
        { label: 'Image Parser', icon: 'pi pi-image', routerLink: '/features/image-parser' },
        { label: 'Speech to Text', icon: 'pi pi-microphone', routerLink: '/features/stt' },
        { label: 'Text to Speech', icon: 'pi pi-volume-up', routerLink: '/features/tts' }
      ]
    }
  ];
}