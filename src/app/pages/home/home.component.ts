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
  authService = inject(AuthService);
  router = inject(Router);
  viewportScroller = inject(ViewportScroller);

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

  // "Get Started" Button Logic
  handleGetStarted() {
    if (this.authService.currentUser()) {
      // User logged in: Smooth scroll to services
      const servicesSection = document.getElementById('services-section');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // User NOT logged in: Go to register
      this.router.navigate(['/pages/register']).then(() => {
        window.scrollTo(0, 0);
      });
    }
  }

  // "How it Works" Button Logic
  scrollToHowItWorks() {
    const section = document.getElementById('how-it-works');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Service Navigation Logic
  navigateToService(path: string) {
    this.router.navigate([path]).then(() => {
      window.scrollTo(0, 0);
    });
  }
}