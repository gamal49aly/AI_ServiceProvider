import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TtsService {

  constructor() { }

  /**
   * Simulate Text-to-Speech Conversion
   * In the future, this will call the backend API to process the text input
   */
  convertTextToSpeech(text: string, voice: string): Observable<any> {
    return of({ 
      success: true,
      audioUrl: 'assets/demo-audio.mp3', // demo audio file 
      duration: '00:15'
    }).pipe(delay(2000)); // Simulate 2 seconds delay
  }
}