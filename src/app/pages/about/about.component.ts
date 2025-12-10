import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, RouterLink, AvatarModule],
  template: `
    <style>
      @keyframes floatGradient {
        0% { transform: translateX(0) translateY(0); }
        50% { transform: translateX(-20px) translateY(-20px); }
        100% { transform: translateX(0) translateY(0); }
      }

      @keyframes pulseDots {
        0%, 100% { opacity: 0.08; }
        50% { opacity: 0.18; }
      }

      @keyframes countUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .count-animate {
        animation: countUp 1.4s ease forwards;
      }

      /* Optional: fade-in-down animation for header */
      @keyframes fadeInDown {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in-down {
        animation: fadeInDown 1s ease forwards;
      }
    </style>

    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 transition-colors duration-300">
      <div class="container mx-auto max-w-6xl">
        
        <div class="text-center mb-20 animate-fade-in-down">
          <div class="inline-block p-2 px-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-bold mb-4">
            Since 2025
          </div>
          <h1 class="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6">
            We Are <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AI Solutions</span>
          </h1>
          <p class="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            A passionate team of ITI graduates bridging the gap between raw data and actionable insights through advanced Artificial Intelligence.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div class="group p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-xl">
            <div class="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400">
              <i class="pi pi-eye text-2xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Vision</h3>
            <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
              To create a world where information extraction is effortless, accurate, and accessible to everyone, empowering developers to build smarter applications without the complexity of training models from scratch.
            </p>
          </div>

          <div class="group p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 transition-all duration-300 shadow-sm hover:shadow-xl">
            <div class="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
              <i class="pi pi-compass text-2xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Mission</h3>
            <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
              We provide state-of-the-art AI services like OCR (Image Parser), Speech-to-Text, and Text-to-Speech through simple, scalable, and secure APIs, enabling businesses to automate workflows instantly.
            </p>
          </div>
        </div>

        <div class="mb-20 text-center">
          <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-10">Powered By Modern Tech</h2>
          <div class="flex flex-wrap justify-center gap-6">

            <span class="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
              <i class="pi pi-code mr-2 text-red-500"></i> Angular
            </span>

            <span class="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 shadow-sm"> 
              <i class="pi pi-server mr-2 text-purple-500"></i> .NET </span>

            <span class="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
              <i class="pi pi-database mr-2 text-blue-500"></i> SQL Server
            </span>

            <span class="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 shadow-sm inline-flex items-center">
              <i class="mr-2 text-sky-500" style="display:inline-flex;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="w-5 h-5">
                  <path fill="currentColor" d="M24 14c-4 0-6.7 2-8 6 1.6-2 3.3-2.7 5-2 1.1.4 1.8 1.2 2.8 2.3C25.8 23.4 27.4 25 31 25c4 0 6.7-2 8-6-1.6 2-3.3 2.7-5 2-1.1-.4-1.8-1.2-2.8-2.3C28.2 15.6 26.6 14 24 14zm-8 10c-4 0-6.7 2-8 6 1.6-2 3.3-2.7 5-2 1.1.4 1.8 1.2 2.8 2.3C17.8 32.4 19.4 34 23 34c4 0 6.7-2 8-6-1.6 2-3.3 2.7-5 2-1.1-.4-1.8-1.2-2.8-2.3C20.2 25.6 18.6 24 16 24z"/>
                </svg>
              </i>
              Tailwind CSS
            </span>

            <span class="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
              <i class="pi pi-credit-card mr-2 text-indigo-500"></i> Stripe
            </span>
            
          </div>
        </div>

        <!-- Animated Stats Block -->
        <div class="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white mb-16 overflow-hidden shadow-2xl">

          <!-- Floating gradient -->
          <div class="absolute inset-0 opacity-20 blur-3xl animate-[floatGradient_12s_ease-in-out_infinite] bg-gradient-to-r from-indigo-400 to-purple-400"></div>

          <!-- Dots background -->
          <div class="absolute inset-0 opacity-10 animate-[pulseDots_5s_ease-in-out_infinite]" 
               style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 20px 20px;">
          </div>

          <div class="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div class="flex flex-col items-center">
              <div class="text-5xl font-black mb-2 tracking-tight count-animate" style="animation-delay:0.2s">
                90%
              </div>
              <div class="text-indigo-100 font-medium">Accuracy Rate</div>
            </div>

            <div class="flex flex-col items-center">
              <div class="text-5xl font-black mb-2 tracking-tight count-animate" style="animation-delay:0.5s">
                24/7
              </div>
              <div class="text-indigo-100 font-medium">System Availability</div>
            </div>

            <div class="flex flex-col items-center">
              <div class="text-5xl font-black mb-2 tracking-tight count-animate" style="animation-delay:0.8s">
                Fast
              </div>
              <div class="text-indigo-100 font-medium">Real-time Processing</div>
            </div>

          </div>
        </div>

        <div class="text-center">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">Ready to transform your workflow?</h2>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button pButton label="Contact Support" routerLink="/contact" class="p-button-outlined p-button-lg dark:text-white dark:border-slate-600"></button>
            <button pButton label="Get Started Now" routerLink="/pages/register" class="bg-indigo-600 border-indigo-600 p-button-lg hover:bg-indigo-700"></button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class AboutComponent { }
