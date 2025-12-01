import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-slate-900 text-slate-300 py-8 mt-auto">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 class="text-white text-xl font-bold mb-4 flex items-center gap-2">
              <i class="pi pi-bolt text-primary-500"></i> AI Solutions
            </h3>
            <p class="text-sm leading-relaxed">
              A project that offers smart, AI-based solutions for analyzing images, processing texts, and audio.
            </p>
          </div>
          
          <div>
            <h4 class="text-white font-semibold mb-4">Quick links</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-primary-400 transition-colors">Home</a></li>
              <li><a href="#" class="hover:text-primary-400 transition-colors">About the project</a></li>
              <li><a href="#" class="hover:text-primary-400 transition-colors">Contact us</a></li>
            </ul>
          </div>

          <div>
             <h4 class="text-white font-semibold mb-4">Our Team</h4>
             <p class="text-sm mb-2">Developed by ITI students - 2025</p>
             <div class="flex gap-4 mt-4">
                 <i class="pi pi-github text-xl hover:text-white cursor-pointer transition-colors"></i>
                 <i class="pi pi-linkedin text-xl hover:text-white cursor-pointer transition-colors"></i>
             </div>
          </div>
        </div>
        
        <div class="border-t border-slate-800 pt-6 text-center text-sm">
          <p>© 2025 AI Solutions Project. All rights reserved.</p>
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