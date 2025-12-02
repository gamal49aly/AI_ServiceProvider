import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 relative mt-auto">
      
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-70"></div>

      <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div class="md:col-span-2">
            <a routerLink="/" class="flex items-center gap-2 mb-6 group cursor-pointer w-fit">
                <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-900/20 group-hover:scale-110 transition-transform">
                    <i class="pi pi-bolt text-xl"></i>
                </div>
                <span class="text-2xl font-bold text-white tracking-tight">AI Solutions</span>
            </a>
            <p class="text-slate-400 leading-relaxed max-w-sm mb-6 text-sm">
              Empowering developers with state-of-the-art AI tools. Convert images, audio, and text with ease using our secure and scalable platform.
            </p>
          </div>
          
          <div>
            <h4 class="text-white font-bold mb-6 tracking-wide">Quick Links</h4>
            <ul class="space-y-4 text-sm">
              <li>
                <a routerLink="/" class="hover:text-indigo-400 transition-colors flex items-center gap-2 cursor-pointer group">
                  <i class="pi pi-angle-right text-xs opacity-0 group-hover:opacity-100 transition-opacity"></i> Home
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-indigo-400 transition-colors flex items-center gap-2 cursor-pointer group">
                  <i class="pi pi-angle-right text-xs opacity-0 group-hover:opacity-100 transition-opacity"></i> About Project
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-indigo-400 transition-colors flex items-center gap-2 cursor-pointer group">
                  <i class="pi pi-angle-right text-xs opacity-0 group-hover:opacity-100 transition-opacity"></i> Contact Support
                </a>
              </li>
            </ul>
          </div>

          <div>
             <h4 class="text-white font-bold mb-6 tracking-wide">Connect</h4>
             <p class="text-sm mb-4 text-slate-500">Developed by ITI Students - Class 2025</p>
             
             <div class="flex gap-3">
                 <a href="#" class="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300">
                     <i class="pi pi-github text-lg"></i>
                 </a>
                 <a href="#" class="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300">
                     <i class="pi pi-linkedin text-lg"></i>
                 </a>
                 <a href="#" class="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all duration-300">
                     <i class="pi pi-twitter text-lg"></i>
                 </a>
             </div>
          </div>
        </div>
        
        <div class="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2025 AI Solutions Project. All rights reserved.</p>
          <div class="flex gap-6 mt-4 md:mt-0">
              <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
        display: block;
        margin-top: auto;
    }
  `]
})
export class FooterComponent { }