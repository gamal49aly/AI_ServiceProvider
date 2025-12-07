import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SubscriptionService, SubscriptionPlan } from '../../core/services/subscription.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, CardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  subscriptionService = inject(SubscriptionService);
  authService = inject(AuthService); // Inject Auth
  router = inject(Router);
  viewportScroller = inject(ViewportScroller); // Inject Scroller

  plans: SubscriptionPlan[] = [];
  loadingPlans = false;

  ngOnInit() {
    this.loadPlans();
  }

  loadPlans() {
    this.loadingPlans = true;
    this.subscriptionService.getPlans().subscribe({
      next: (plans) => {
        this.plans = plans;
        this.loadingPlans = false;
      },
      error: (err) => {
        console.error('Error loading plans:', err);
        this.loadingPlans = false;
      }
    });
  }

  // Logic for "Get Started" button
  handleGetStarted() {
    if (this.authService.currentUser()) {
      // if logged in, scroll to services
      this.viewportScroller.scrollToAnchor('services-section');
    } else {
      // if not logged in, navigate to register
      this.router.navigate(['/pages/register']);
    }
  }

  // Logic for "Learn More" button
  scrollToHowItWorks() {
    this.viewportScroller.scrollToAnchor('how-it-works');
  }
}