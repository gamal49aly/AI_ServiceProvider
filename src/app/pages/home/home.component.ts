import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule],
  template: `
    <section class="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-primary-800 to-indigo-900 text-white py-24 lg:py-32 px-6">
        <div class="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div class="container mx-auto relative z-10 text-center">
            <span class="inline-block py-1 px-3 rounded-full bg-primary-600/30 text-primary-200 text-sm font-semibold mb-6 border border-primary-500/30">
                🚀 Our Project 2025
            </span>
            <h1 class="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight">
                Unleash the power of <br/>
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary-300">
                    Artificial Intelligence
                </span>
            </h1>
            <p class="text-xl md:text-2xl text-indigo-100 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                Your all-in-one platform for converting images to text and processing audio. Smart tools designed to boost your productivity with high accuracy and efficiency.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button pButton label="Start now for free" icon="pi pi-rocket" routerLink="/pages/register" class="p-button-lg bg-white text-primary-700 hover:bg-indigo-50 border-none font-bold px-8 py-4"></button>
                <button pButton label="Explore the services" icon="pi pi-arrow-down" class="p-button-lg p-button-outlined text-white border-white hover:bg-white/10 font-semibold px-8 py-4"></button>
            </div>
        </div>
    </section>

    <section class="py-24 px-6 bg-slate-50 relative z-20 -mt-10 rounded-t-[3rem]">
        <div class="container mx-auto">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Our smart services</h2>
                <p class="text-slate-600 max-w-xl mx-auto text-lg">We offer a range of solutions based on the latest AI technologies to make your daily tasks easier.</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 px-4">
                <div class="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 transition-all group-hover:scale-110"></div>
                    <div class="relative z-10">
                        <div class="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                            <i class="pi pi-image text-4xl text-blue-600 group-hover:text-white transition-colors"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800 mb-3">Optical Character Recognition (OCR)</h3>
                        <p class="text-slate-600 mb-6 leading-relaxed">
                            Convert any scanned image or document into highly accurate, editable, and searchable text.
                        </p>
                        <a routerLink="/features/image-parser" class="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700">
                            Try the service <i class="pi pi-arrow-left mr-2 transition-transform group-hover:-translate-x-2"></i>
                        </a>
                    </div>
                </div>

                <div class="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-0 transition-all group-hover:scale-110"></div>
                    <div class="relative z-10">
                        <div class="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-300">
                            <i class="pi pi-microphone text-4xl text-purple-600 group-hover:text-white transition-colors"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800 mb-3">Convert audio to text</h3>
                        <p class="text-slate-600 mb-6 leading-relaxed">
                            Record your voice notes or upload audio files and convert them to written text in seconds.
                        </p>
                        <a routerLink="/features/stt" class="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700">
                            Try the service <i class="pi pi-arrow-left mr-2 transition-transform group-hover:-translate-x-2"></i>
                        </a>
                    </div>
                </div>

                <div class="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-0 transition-all group-hover:scale-110"></div>
                    <div class="relative z-10">
                        <div class="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                            <i class="pi pi-volume-up text-4xl text-indigo-600 group-hover:text-white transition-colors"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800 mb-3">Text to speech conversion</h3>
                        <p class="text-slate-600 mb-6 leading-relaxed">
                            Write any text and listen to it in a natural human voice, ideal for creating audio content.
                        </p>
                        <a routerLink="/features/tts" class="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700">
                            Try the service <i class="pi pi-arrow-left mr-2 transition-transform group-hover:-translate-x-2"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
  `
})
export class HomeComponent {}