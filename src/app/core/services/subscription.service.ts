import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
  maxUsagePerMonth: number;
  isCurrentPlan: boolean;
}

export interface SubscriptionStatus {
  currentPlan: string;
  expiresAt: string | null;
  isActive: boolean;
  usageThisMonth: number;
  maxUsage: number;
}

export interface CheckoutSession {
  sessionId: string;
   sessionUrl: string;
  publishableKey: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private http = inject(HttpClient);
  private baseUrl = 'https://localhost:7049/api/Subscription';

  getPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(`${this.baseUrl}/plans`);
  }

  getStatus(): Observable<SubscriptionStatus> {
    return this.http.get<SubscriptionStatus>(`${this.baseUrl}/status`);
  }

  createCheckoutSession(subscriptionId: string): Observable<CheckoutSession> {
    return this.http.post<CheckoutSession>(
      `${this.baseUrl}/create-checkout-session`,
      { subscriptionId }
    );
  }
}