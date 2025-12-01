import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './core/guards/auth.guard'; // عشان نستخدمه قدام

export const routes: Routes = [
  // Home Page
  { path: '', component: HomeComponent },

  // Authentication Pages
  { path: 'pages/login', component: LoginComponent },
  { path: 'pages/register', component: RegisterComponent },

  { path: '**', redirectTo: '' }
];