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
      <div class="container mx-auto max-w-5xl">
        
        <div class="text-center mb-16 animate-fade-in-down">
          <h1 class="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Get in Touch</h1>
          <p class="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Have questions about our API, pricing, or need technical support? We're here to help.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          
          <div class="lg:col-span-1 space-y-6">
            <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 text-center hover:-translate-y-1 transition-transform duration-300">
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
                <i class="pi pi-envelope text-xl"></i>
              </div>
              <h3 class="font-bold text-slate-900 dark:text-white text-lg mb-1">Email Us</h3>
              <p class="text-slate-500 text-sm">support@aisolutions.com</p>
            </div>
            
            <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 text-center hover:-translate-y-1 transition-transform duration-300">
              <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-400">
                <i class="pi pi-map-marker text-xl"></i>
              </div>
              <h3 class="font-bold text-slate-900 dark:text-white text-lg mb-1">Visit Us</h3>
              <p class="text-slate-500 text-sm">ITI Smart Village, Cairo</p>
            </div>

            <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 text-center hover:-translate-y-1 transition-transform duration-300">
                <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600 dark:text-purple-400">
                  <i class="pi pi-clock text-xl"></i>
                </div>
                <h3 class="font-bold text-slate-900 dark:text-white text-lg mb-1">Working Hours</h3>
                <p class="text-slate-500 text-sm">Sun - Thu: 9AM - 5PM</p>
              </div>
          </div>

          <div class="lg:col-span-2">
            <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 h-full">
              <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">Send us a Message</h3>
              
              <div class="space-y-5">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                        <input pInputText class="w-full p-3 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 rounded-xl" placeholder="John Doe" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                        <input pInputText class="w-full p-3 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 rounded-xl" placeholder="john@example.com" />
                    </div>
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Subject</label>
                  <input pInputText class="w-full p-3 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 rounded-xl" placeholder="How can we help?" />
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Message</label>
                  <textarea rows="5" class="w-full p-3 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none" placeholder="Write your message here..."></textarea>
                </div>

                <button pButton label="Send Message" icon="pi pi-send" class="w-full bg-indigo-600 border-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl"></button>
              </div>
            </div>
          </div>

        </div>

        <div class="max-w-3xl mx-auto">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">Frequently Asked Questions</h2>
            
            <div class="space-y-4">
              @for (faq of faqs; track $index) {
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-all duration-300">
                  <button 
                    (click)="toggleFaq($index)"
                    class="w-full flex items-center justify-between p-5 text-left focus:outline-none hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <span class="font-bold text-slate-800 dark:text-white text-lg">{{ faq.question }}</span>
                    <i class="pi" [ngClass]="openFaqIndex === $index ? 'pi-minus text-indigo-600' : 'pi-plus text-slate-400'"></i>
                  </button>

                  <div *ngIf="openFaqIndex === $index" class="p-5 pt-0 animate-fade-in-down">
                    <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {{ faq.answer }}
                    </p>
                  </div>
                </div>
              }
            </div>
        </div>

      </div>
    </div>
  `
})
export class ContactComponent {

  openFaqIndex: number | null = 0; // Default first one is open

  faqs = [
    {
      question: 'How does the pricing work?',
      answer: 'We offer a flexible Pay-as-you-go model for Enterprise and fixed monthly subscriptions for Pro users. The Free tier allows you to test all features with limited requests.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, absolutely! You can cancel your subscription from your account settings at any time. Your access will continue until the end of the billing period.'
    },
    {
      question: 'Is my data secure?',
      answer: 'We take security seriously. All data transmitted is encrypted via SSL/TLS. We do not store your raw files after processing unless you explicitly enable history saving.'
    }
  ];

  toggleFaq(index: number) {
    this.openFaqIndex = this.openFaqIndex === index ? null : index;
  }
}