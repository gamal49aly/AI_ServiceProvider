import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer
      class="bg-surface-0 dark:bg-surface-950 text-surface-600 dark:text-surface-400 py-12 border-t border-surface-200 dark:border-surface-800 relative mt-auto"
    >
      <div
        class="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-70"
      ></div>

      <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div class="md:col-span-2">
            <a
              routerLink="/"
              class="flex items-center gap-2 mb-6 group cursor-pointer w-fit"
            >
              <div
                class="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/30 group-hover:scale-110 transition-transform"
              >
                <i class="pi pi-bolt text-xl"></i>
              </div>
              <span
                class="text-2xl font-bold text-surface-900 dark:text-surface-50 tracking-tight"
                >AI Solutions</span
              >
            </a>
            <p
              class="text-surface-600 dark:text-surface-400 leading-relaxed max-w-sm mb-6 text-sm"
            >
              Empowering developers with state-of-the-art AI tools. Convert
              images, audio, and text with ease using our secure and scalable
              platform.
            </p>
          </div>

          <div>
            <h4
              class="text-surface-900 dark:text-surface-50 font-bold mb-6 tracking-wide text-sm uppercase"
            >
              Quick Links
            </h4>
            <ul class="space-y-3 text-sm">
              <li>
                <a
                  routerLink="/"
                  class="text-surface-600 dark:text-surface-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2 cursor-pointer group"
                >
                  <i
                    class="pi pi-angle-right text-xs opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600 dark:text-indigo-400"
                  ></i>
                  Home
                </a>
              </li>
              <li>
                <a
                  routerLink="/about"
                  class="text-surface-600 dark:text-surface-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2 cursor-pointer group"
                >
                  <i
                    class="pi pi-angle-right text-xs opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600 dark:text-indigo-400"
                  ></i>
                  About Project
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-surface-600 dark:text-surface-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2 cursor-pointer group"
                >
                  <i
                    class="pi pi-angle-right text-xs opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600 dark:text-indigo-400"
                  ></i>
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4
              class="text-surface-900 dark:text-surface-50 font-bold mb-6 tracking-wide text-sm uppercase"
            >
              Connect
            </h4>
            <p class="text-sm mb-4 text-surface-500 dark:text-surface-500">
              Developed by ITI Students - Class 2025
            </p>

            <div class="flex gap-3">
              <a
                href="#"
                class="w-10 h-10 rounded-full bg-surface-100 dark:bg-surface-900 border border-surface-300 dark:border-surface-700 text-surface-700 dark:text-surface-300 flex items-center justify-center hover:bg-indigo-600 hover:text-white hover:border-indigo-600 dark:hover:bg-indigo-600 dark:hover:border-indigo-600 transition-all duration-300"
                aria-label="GitHub"
              >
                <i class="pi pi-github text-lg"></i>
              </a>
              <a
                href="#"
                class="w-10 h-10 rounded-full bg-surface-100 dark:bg-surface-900 border border-surface-300 dark:border-surface-700 text-surface-700 dark:text-surface-300 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:bg-blue-600 dark:hover:border-blue-600 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <i class="pi pi-linkedin text-lg"></i>
              </a>
              <a
                href="#"
                class="w-10 h-10 rounded-full bg-surface-100 dark:bg-surface-900 border border-surface-300 dark:border-surface-700 text-surface-700 dark:text-surface-300 flex items-center justify-center hover:bg-sky-500 hover:text-white hover:border-sky-500 dark:hover:bg-sky-500 dark:hover:border-sky-500 transition-all duration-300"
                aria-label="Twitter"
              >
                <i class="pi pi-twitter text-lg"></i>
              </a>
            </div>
          </div>
        </div>

        <div
          class="border-t border-surface-200 dark:border-surface-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-surface-500 dark:text-surface-500"
        >
          <p class="text-surface-600 dark:text-surface-400">
            © 2025 AI Solutions Project. All rights reserved.
          </p>
          <div class="flex gap-6 mt-4 md:mt-0">
            <a
              href="#"
              class="text-surface-600 dark:text-surface-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              class="text-surface-600 dark:text-surface-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      :host {
        display: block;
        margin-top: auto;
      }
    `,
  ],
})
export class FooterComponent {}
