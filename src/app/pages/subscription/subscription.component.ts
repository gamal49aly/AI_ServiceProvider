import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService, SubscriptionPlan } from '../../core/services/subscription.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, ToastModule],
  providers: [MessageService],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.css'
})
export class SubscriptionComponent implements OnInit {
  subscriptionService = inject(SubscriptionService);
  messageService = inject(MessageService);

  plans: SubscriptionPlan[] = [];
  loading = false;
  checkoutLoading: string | null = null;

  ngOnInit() {
    this.loadPlans();
  }

  loadPlans() {
    this.loading = true;
    this.subscriptionService.getPlans().subscribe({
      next: (plans) => {
        this.plans = plans;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading plans:', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load subscription plans'
        });
      }
    });
  }

  getPlanCardClass(plan: SubscriptionPlan): string {
    const baseClass = 'h-full';
    if (plan.name === 'Pro Plan') {
      return `${baseClass} border-2 border-indigo-600 shadow-2xl`;
    }
    if (plan.isCurrentPlan) {
      return `${baseClass} opacity-75`;
    }
    return baseClass;
  }

async subscribe(planId: string) {
  this.checkoutLoading = planId;

  try {
    const session = await this.subscriptionService
      .createCheckoutSession(planId)
      .toPromise();

    if (!session) {
      throw new Error('Failed to create checkout session');
    }

    // Correct redirect URL format
    window.location.href = `https://checkout.stripe.com/c/pay/${session.sessionId}`;
    
  } catch (error: any) {
    console.error('Subscription error:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Failed to process subscription'
    });
    this.checkoutLoading = null;
  }
}

}