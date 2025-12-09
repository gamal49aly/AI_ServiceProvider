import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 transition-colors duration-300">
      <div class="container mx-auto max-w-6xl">
        
        <div class="text-center mb-16 animate-fade-in-down">
          <h1 class="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6">
            We Are <span class="text-indigo-600 dark:text-indigo-400">AI Solutions</span>
          </h1>
          <p class="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Bridging the gap between raw data and actionable insights through advanced Artificial Intelligence.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <p-card styleClass="h-full shadow-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <ng-template pTemplate="header">
              <div class="h-2 bg-indigo-500 rounded-t-xl"></div>
            </ng-template>
            <div class="p-4">
              <i class="pi pi-eye text-4xl text-indigo-600 dark:text-indigo-400 mb-4"></i>
              <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">Our Vision</h3>
              <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
                To create a world where information extraction is effortless, accurate, and accessible to everyone, empowering developers to build smarter applications.
              </p>
            </div>
          </p-card>

          <p-card styleClass="h-full shadow-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <ng-template pTemplate="header">
              <div class="h-2 bg-purple-500 rounded-t-xl"></div>
            </ng-template>
            <div class="p-4">
              <i class="pi pi-compass text-4xl text-purple-600 dark:text-purple-400 mb-4"></i>
              <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">Our Mission</h3>
              <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
                We provide state-of-the-art AI services like OCR, Speech-to-Text, and Text-to-Speech through simple, scalable, and secure APIs.
              </p>
            </div>
          </p-card>
        </div>

        <div class="bg-indigo-900 rounded-3xl p-12 text-center text-white mb-16 relative overflow-hidden">
          <div class="absolute inset-0 bg-pattern opacity-10"></div>
          <div class="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div class="text-5xl font-bold mb-2">99%</div>
              <div class="text-indigo-200">Accuracy Rate</div>
            </div>
            <div>
              <div class="text-5xl font-bold mb-2">24/7</div>
              <div class="text-indigo-200">System Uptime</div>
            </div>
            <div>
              <div class="text-5xl font-bold mb-2">+50k</div>
              <div class="text-indigo-200">Files Processed</div>
            </div>
          </div>
        </div>

        <div class="text-center">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">Ready to get started?</h2>
          <div class="flex gap-4 justify-center">
            <button pButton label="Contact Us" routerLink="/contact" class="p-button-outlined p-button-lg"></button>
            <button pButton label="Join Now" routerLink="/pages/register" class="bg-indigo-600 border-indigo-600 p-button-lg"></button>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .bg-pattern {
      background-image: radial-gradient(#ffffff 1px, transparent 1px);
      background-size: 20px 20px;
    }
  `]
})
export class AboutComponent { }