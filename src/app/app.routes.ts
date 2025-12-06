
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
// import { ImageParserComponent } from './features/image-parser/image-parser.component';
// import { SttComponent } from './features/speech-to-text/';
// import { TtsComponent } from './features/tts/tts.component';
import { authGuard } from './core/guards/auth.guard'; // عشان نستخدمه قدام

export const routes: Routes = [
  // Public Routes
  { path: '', component: HomeComponent },
  { path: 'pages/login', component: LoginComponent },
  { path: 'pages/register', component: RegisterComponent },

  // // Protected Routes
  // { path: 'features/image-parser', component: ImageParserComponent, canActivate: [authGuard] },
  // { path: 'features/stt', component: SttComponent, canActivate: [authGuard] },
  // { path: 'features/tts', component: TtsComponent, canActivate: [authGuard] },

  // Wildcard
  { path: '**', redirectTo: '' }
];