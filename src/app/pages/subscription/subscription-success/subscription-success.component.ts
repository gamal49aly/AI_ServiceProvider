import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-subscription-success',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-indigo-50 px-4">
      <div class="max-w-md w-full text-center">
        <div class="bg-white rounded-3xl shadow-2xl p-12">
          <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="pi pi-check text-5xl text-green-600"></i>
          </div>
          
          <h1 class="text-3xl font-bold text-slate-900 mb-4">
            Subscription Successful!
          </h1>
          
          <p class="text-slate-600 mb-8">
            Your subscription has been activated. You can now enjoy all premium features!
          </p>
          
          <div class="space-y-3">
            <button 
              pButton 
              label="Go to Dashboard" 
              icon="pi pi-home"
              class="w-full bg-indigo-600 border-indigo-600"
              (click)="goHome()">
            </button>
            
            <button 
              pButton 
              label="View My Subscription" 
              icon="pi pi-user"
              class="w-full p-button-outlined"
              (click)="viewSubscription()">
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SubscriptionSuccessComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);

  ngOnInit() {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    console.log('Checkout session:', sessionId);
  }

  goHome() {
    this.router.navigate(['/']);
  }

  viewSubscription() {
    this.router.navigate(['/subscription']);
  }
}