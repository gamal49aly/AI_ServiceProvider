import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink, ButtonModule],
    styles: [`
    /* Custom Animations */
    @keyframes fadeInDown {
      from { opacity: 0; transform: translate3d(0, -30px, 0); }
      to { opacity: 1; transform: translate3d(0, 0, 0); }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    .animate-fade-in-down {
      animation: fadeInDown 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
  `],
    template: `
    <section class="relative pt-32 pb-32 lg:pt-48 lg:pb-40 overflow-hidden bg-slate-50 dark:bg-slate-900">
        
        <div class="absolute inset-0 pointer-events-none">
            <div class="absolute inset-0" style="background-image: radial-gradient(#e2e8f0 1px, transparent 1px); background-size: 40px 40px; opacity: 0.7;"></div>
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
        </div>

        <div class="container mx-auto px-6 relative z-10 text-center">
            
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 shadow-sm text-indigo-600 font-semibold text-sm mb-8 animate-fade-in-down">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span>AI Powered Solutions v1.0</span>
            </div>

            <h1 class="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6 leading-tight animate-fade-in-down">
                Transform Ideas into <br>
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    Digital Reality
                </span>
            </h1>

            <p class="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-down" style="animation-delay: 0.1s">
                Your all-in-one platform for converting images to text and processing audio. Smart tools designed to boost your productivity with high accuracy.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20 animate-fade-in-down" style="animation-delay: 0.2s">
                <button pButton label="Start Free Trial" icon="pi pi-rocket" routerLink="/pages/register" class="p-button-lg bg-indigo-600 border-none px-8 py-4 shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all hover:-translate-y-1"></button>
                
                <div class="flex items-center gap-3 text-slate-600 font-medium cursor-pointer hover:text-indigo-600 transition-colors group">
                    <div class="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <i class="pi pi-play text-indigo-600 text-xl ml-1"></i>
                    </div>
                    <span>Watch Demo</span>
                </div>
            </div>

            <div class="relative mx-auto max-w-5xl animate-fade-in-down animate-float" style="animation-delay: 0.3s">
                 <div class="rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-xl p-2 shadow-2xl shadow-slate-200/50">
                     <div class="rounded-xl bg-white border border-slate-100 overflow-hidden aspect-[16/9] md:aspect-[21/9] relative flex flex-col">
                        
                        <div class="h-10 border-b border-slate-50 bg-slate-50/50 flex items-center px-4 gap-2">
                            <div class="flex gap-1.5">
                                <div class="w-3 h-3 rounded-full bg-red-400"></div>
                                <div class="w-3 h-3 rounded-full bg-amber-400"></div>
                                <div class="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                        </div>

                        <div class="flex-1 flex items-center justify-center bg-slate-50/30 relative overflow-hidden">
                             <div class="text-center z-10">
                                <div class="flex gap-6 justify-center mb-6 opacity-80">
                                    <div class="w-20 h-20 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center shadow-sm">
                                        <i class="pi pi-image text-3xl text-blue-500"></i>
                                    </div>
                                    <div class="w-20 h-20 bg-purple-50 border border-purple-100 rounded-2xl flex items-center justify-center shadow-sm">
                                        <i class="pi pi-microphone text-3xl text-purple-500"></i>
                                    </div>
                                    <div class="w-20 h-20 bg-pink-50 border border-pink-100 rounded-2xl flex items-center justify-center shadow-sm">
                                        <i class="pi pi-volume-up text-3xl text-pink-500"></i>
                                    </div>
                                </div>
                                <p class="text-slate-400 font-mono text-xs uppercase tracking-widest">System Dashboard Active</p>
                             </div>

                             <div class="absolute top-10 left-10 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
                             <div class="absolute bottom-10 right-10 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
                        </div>
                     </div>
                 </div>
            </div>
        </div>
    </section>

    <section class="py-24 px-6 bg-white border-t border-slate-100">
        <div class="container mx-auto max-w-7xl">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Smart Services</h2>
                <p class="text-slate-500 max-w-xl mx-auto text-lg">We offer a range of solutions based on the latest AI technologies to make your daily tasks easier.</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                
                <div class="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 relative overflow-hidden cursor-pointer">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full -z-0 transition-transform group-hover:scale-110 duration-500"></div>
                    
                    <div class="relative z-10">
                        <div class="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                            <i class="pi pi-image text-2xl text-blue-600 group-hover:text-white transition-colors"></i>
                        </div>
                        <h3 class="text-xl font-bold text-slate-900 mb-3">Optical Character Recognition</h3>
                        <p class="text-slate-500 mb-6 leading-relaxed text-sm">
                            Convert any scanned image or document into highly accurate, editable, and searchable text.
                        </p>
                        <a routerLink="/features/image-parser" class="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 text-sm">
                            Try Service <i class="pi pi-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
                        </a>
                    </div>
                </div>

                <div class="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-purple-100 transition-all duration-300 relative overflow-hidden cursor-pointer">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-purple-50/50 rounded-bl-full -z-0 transition-transform group-hover:scale-110 duration-500"></div>
                    
                    <div class="relative z-10">
                        <div class="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-300">
                            <i class="pi pi-microphone text-2xl text-purple-600 group-hover:text-white transition-colors"></i>
                        </div>
                        <h3 class="text-xl font-bold text-slate-900 mb-3">Audio to Text</h3>
                        <p class="text-slate-500 mb-6 leading-relaxed text-sm">
                            Record voice notes or upload audio files and convert them to written text in seconds.
                        </p>
                        <a routerLink="/features/stt" class="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700 text-sm">
                            Try Service <i class="pi pi-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
                        </a>
                    </div>
                </div>

                <div class="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-pink-100 transition-all duration-300 relative overflow-hidden cursor-pointer">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-pink-50/50 rounded-bl-full -z-0 transition-transform group-hover:scale-110 duration-500"></div>
                    
                    <div class="relative z-10">
                        <div class="w-14 h-14 bg-pink-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-pink-600 transition-colors duration-300">
                            <i class="pi pi-volume-up text-2xl text-pink-600 group-hover:text-white transition-colors"></i>
                        </div>
                        <h3 class="text-xl font-bold text-slate-900 mb-3">Text to Speech</h3>
                        <p class="text-slate-500 mb-6 leading-relaxed text-sm">
                            Write any text and listen to it in a natural human voice, ideal for creating audio content.
                        </p>
                        <a routerLink="/features/tts" class="inline-flex items-center text-pink-600 font-semibold hover:text-pink-700 text-sm">
                            Try Service <i class="pi pi-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
                        </a>
                    </div>
                </div>

            </div>
        </div>
    </section>
  `
})
export class HomeComponent { }