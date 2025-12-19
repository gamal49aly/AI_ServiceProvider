import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, InputGroupModule, InputGroupAddonModule, InputTextModule],
  template: `
    <footer class="bg-slate-950 text-slate-400 py-16 border-t border-slate-900 relative mt-auto">
      
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-70"></div>

      <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div class="lg:col-span-1">
            <a routerLink="/" class="flex items-center gap-2 mb-6 group cursor-pointer w-fit">
              <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-900/20 group-hover:scale-110 transition-transform">
                <i class="pi pi-bolt text-xl"></i>
              </div>
              <span class="text-2xl font-bold text-white tracking-tight">Parse.io</span>
            </a>
            <p class="text-slate-400 leading-relaxed text-sm mb-6">
              Transforming businesses with intelligent AI services. Secure, scalable, and easy to integrate.
            </p>
            <div class="flex gap-3">
              <a href="#" class="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300"><i class="pi pi-github"></i></a>
              <a href="#" class="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300"><i class="pi pi-linkedin"></i></a>
              <a href="#" class="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all duration-300"><i class="pi pi-twitter"></i></a>
            </div>
          </div>

          <div>
            <h4 class="text-white font-bold mb-6 tracking-wide uppercase text-xs">Product</h4>
            <ul class="space-y-3 text-sm">
              <li><a routerLink="/features/image-parser" class="hover:text-indigo-400 transition-colors">Image Parser</a></li>
              <li><a routerLink="/features/stt" class="hover:text-indigo-400 transition-colors">Speech to Text</a></li>
              <li><a routerLink="/features/tts" class="hover:text-indigo-400 transition-colors">Text to Speech</a></li>
              <li><a routerLink="/subscription" class="hover:text-indigo-400 transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-bold mb-6 tracking-wide uppercase text-xs">Company</h4>
            <ul class="space-y-3 text-sm">
              <li><a routerLink="/about" class="hover:text-indigo-400 transition-colors">About Us</a></li>
              <li><a routerLink="/contact" class="hover:text-indigo-400 transition-colors">Contact</a></li>
              <li><a href="#" class="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" class="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-bold mb-6 tracking-wide uppercase text-xs">Stay Updated</h4>
            <p class="text-slate-500 text-xs mb-4">Subscribe to our newsletter for the latest AI updates.</p>
            
            <div class="flex flex-col gap-3">
               <p-inputGroup>
                    <input pInputText placeholder="Email address" class="p-inputtext-sm bg-slate-900 border-slate-800 text-white placeholder-slate-600 focus:border-indigo-500" />
                    <button type="button" pButton icon="pi pi-send" class="bg-indigo-600 border-indigo-600"></button>
                </p-inputGroup>
            </div>
          </div>

        </div>
        
        <div class="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
          <p>© 2025 Parse.io - ITI Graduation Project.</p>
          <div class="flex gap-2 mt-4 md:mt-0 items-center font-medium">
             <span>Built with passion in Egypt 🇪🇬</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host { display: block; margin-top: auto; }
  `]
})
export class FooterComponent { } 