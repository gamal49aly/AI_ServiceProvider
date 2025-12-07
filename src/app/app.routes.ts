import { SubscriptionCancelComponent } from './pages/subscription/subscription-cancel/subscription-cancel.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './core/guards/auth.guard'; // عشان نستخدمه قدام
import { SubscriptionComponent } from './pages/subscription/subscription.component';
import { SubscriptionSuccessComponent } from './pages/subscription/subscription-success/subscription-success.component';

export const routes: Routes = [
  // Home Page
  { path: '', component: HomeComponent },

  // Authentication Pages
  { path: 'pages/login', component: LoginComponent },
  { path: 'pages/register', component: RegisterComponent },


    { 
    path: 'subscription', 
    component: SubscriptionComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'subscription/success', 
    component: SubscriptionSuccessComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'subscription/cancel', 
    component: SubscriptionCancelComponent, 
    canActivate: [authGuard] 
  },


  { path: '**', redirectTo: '' }
];