import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SttService {

  constructor() { }

  /**
    * Simulate Speech-to-Text Conversion
    *  In the future, this will call the backend API to process the audio file
   */
  convertSpeechToText(file: File): Observable<any> {
    // Mock Response
    const mockText = "This is a simulated result from the AI model. The speech-to-text process was successful, and this text represents the content of your audio file. In the future, this will be replaced by the actual backend response.";
    
    return of({ 
      text: mockText,
      confidence: 0.98,
      duration: '00:45'
    }).pipe(delay(3000)); // Simulate 3 seconds delay
  }
}