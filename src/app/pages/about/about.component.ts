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
              <i class="pi pi-server mr-2 text-purple-500"></i> .NET
            </span>
            <span class="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
              <i class="pi pi-database mr-2 text-blue-500"></i> SQL Server
            </span>
            <span class="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
              <i class="pi pi-credit-card mr-2 text-indigo-500"></i> Stripe
            </span>
          </div>
        </div>

        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white mb-16 relative overflow-hidden shadow-2xl">
          <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 20px 20px;"></div>
          <div class="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div class="text-5xl font-black mb-2 tracking-tight">90%</div>
              <div class="text-indigo-100 font-medium">Accuracy Rate</div>
            </div>
            <div>
              <div class="text-5xl font-black mb-2 tracking-tight">24/7</div>
              <div class="text-indigo-100 font-medium">System Availability</div>
            </div>
            <div>
              <div class="text-5xl font-black mb-2 tracking-tight">Fast</div>
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