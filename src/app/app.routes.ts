import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';

import { authGuard } from './core/guards/auth.guard';
import { SubscriptionComponent } from './pages/subscription/subscription.component';
import { SubscriptionSuccessComponent } from './pages/subscription/subscription-success/subscription-success.component';
import { SubscriptionCancelComponent } from './pages/subscription/subscription-cancel/subscription-cancel.component';

import { ImageParserComponent } from './features/image-parser/pages/image-parser/image-parser.component';
import { SttComponent } from './features/speech-to-text/pages/stt/stt.component';
import { TtsComponent } from './features/text-to-speech/pages/tts/tts.component';

export const routes: Routes = [
  // Public Routes
  { path: '', component: HomeComponent },
  { path: 'pages/login', component: LoginComponent },
  { path: 'pages/register', component: RegisterComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },

  // Protected Routes (Features)
  {
    path: 'features/image-parser',
    component: ImageParserComponent,
    canActivate: [authGuard]
  },
  {
    path: 'features/stt',
    component: SttComponent,
    canActivate: [authGuard]
  },
  {
    path: 'features/tts',
    component: TtsComponent,
    canActivate: [authGuard]
  },

  // Subscription Routes
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