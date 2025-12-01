import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, delay, of, tap, Observable } from 'rxjs';

export interface User {
  id: number;
  email: string;
  name: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // State Management using Signals
  currentUser = signal<User | null>(this.getUserFromStorage());

  // Mock API URLs
  private baseUrl = 'https://mock-api.com/api'; 

  constructor() {}

  // Login Function (Mocked)
  login(credentials: any): Observable<User> {
    // (Simulated Backend Call)
    const mockResponse: User = {
      id: 1,
      email: credentials.email,
      name: 'ITI Student',
      token: 'fake-jwt-token-123456'
    };

    return of(mockResponse).pipe(
      delay(1000),
      tap(user => {
        this.saveUserToStorage(user);
        this.currentUser.set(user);
      })
    );
  }

  // Register Function (Mocked)
  register(data: any): Observable<User> {
    const mockResponse: User = {
      id: 2,
      email: data.email,
      name: data.name,
      token: 'fake-jwt-token-register'
    };

    return of(mockResponse).pipe(
      delay(1000),
      tap(user => {
        this.saveUserToStorage(user);
        this.currentUser.set(user);
      })
    );
  }

  // Logout
  logout() {
    localStorage.removeItem('user_session');
    this.currentUser.set(null);
    this.router.navigate(['/pages/login']);
  }

  // Helper Methods
  private saveUserToStorage(user: User) {
    localStorage.setItem('user_session', JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('user_session');
    return user ? JSON.parse(user) : null;
  }
}