import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, InputTextModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 transition-colors duration-300">
      <div class="container mx-auto max-w-4xl">
        
        <div class="text-center mb-12 animate-fade-in-down">
          <h1 class="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Get in Touch</h1>
          <p class="text-slate-600 dark:text-slate-400">Have questions? We'd love to hear from you.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div class="md:col-span-1 space-y-4">
            <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <i class="pi pi-envelope text-2xl text-indigo-600 dark:text-indigo-400 mb-3"></i>
              <h3 class="font-bold text-slate-900 dark:text-white">Email</h3>
              <p class="text-slate-500 text-sm">support@aisolutions.com</p>
            </div>
            
            <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <i class="pi pi-map-marker text-2xl text-indigo-600 dark:text-indigo-400 mb-3"></i>
              <h3 class="font-bold text-slate-900 dark:text-white">Office</h3>
              <p class="text-slate-500 text-sm">Smart Village, Cairo, Egypt</p>
            </div>
          </div>

          <div class="md:col-span-2">
            <p-card styleClass="shadow-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div class="space-y-4">
                <div class="flex flex-col gap-2">
                  <label class="text-slate-700 dark:text-slate-300 font-semibold">Name</label>
                  <input pInputText class="w-full" placeholder="Your Name" />
                </div>
                
                <div class="flex flex-col gap-2">
                  <label class="text-slate-700 dark:text-slate-300 font-semibold">Email</label>
                  <input pInputText class="w-full" placeholder="your@email.com" />
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-slate-700 dark:text-slate-300 font-semibold">Message</label>
                  <textarea rows="5" class="w-full p-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-lg focus:border-indigo-500 outline-none" placeholder="How can we help?"></textarea>
                </div>

                <button pButton label="Send Message" icon="pi pi-send" class="w-full bg-indigo-600 border-indigo-600 hover:bg-indigo-700 text-white"></button>
              </div>
            </p-card>
          </div>

        </div>
      </div>
    </div>
  `
})
export class ContactComponent { }