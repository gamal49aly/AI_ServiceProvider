import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-subscription-cancel',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 px-4">
      <div class="max-w-md w-full text-center">
        <div class="bg-white rounded-3xl shadow-2xl p-12">
          <div class="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="pi pi-times text-5xl text-orange-600"></i>
          </div>
          
          <h1 class="text-3xl font-bold text-slate-900 mb-4">
            Subscription Cancelled
          </h1>
          
          <p class="text-slate-600 mb-8">
            Your subscription process was cancelled. No charges were made.
          </p>
          
          <div class="space-y-3">
            <button 
              pButton 
              label="Try Again" 
              icon="pi pi-refresh"
              class="w-full bg-indigo-600 border-indigo-600"
              (click)="tryAgain()">
            </button>
            
            <button 
              pButton 
              label="Go Home" 
              icon="pi pi-home"
              class="w-full p-button-outlined"
              (click)="goHome()">
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SubscriptionCancelComponent {
  router = inject(Router);

  tryAgain() {
    this.router.navigate(['/subscription']);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}