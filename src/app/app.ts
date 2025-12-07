import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/layout/header/header.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { ChatbotWidgetComponent } from './shared/components/chatbot-widget/chatbot-widget.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ChatbotWidgetComponent,
  ],
  template: `
    <div class="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <app-header class="sticky top-0 z-50"></app-header>

      <main class="grow">
        <router-outlet></router-outlet>
      </main>

      <app-footer></app-footer>
    </div>
    <app-chatbot-widget></app-chatbot-widget>
  `,
  styleUrl: './app.css',
})
export class AppComponent {
  title = 'AI_ServiceProvider';
}