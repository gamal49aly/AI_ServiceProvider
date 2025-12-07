import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, Observable } from 'rxjs';

export interface User {
  id: string;  // Changed from userId to match .NET Guid
  email: string;
  displayName: string;  // Changed from 'name' to match .NET
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

  // REAL .NET API URL
  private baseUrl = 'https://localhost:7049/api/Auth';

  constructor() { }

  // LOGIN --------------
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials).pipe(
      tap(response => {
        console.log('Backend Response:', response);

        // Map .NET response to our User interface
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          displayName: response.user.displayName,
          token: response.token
        };

        this.saveUserToStorage(user);
        this.currentUser.set(user);
      })
    );
  }

  // REGISTER ----------
  register(data: { email: string; password: string; name: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  // LOGOUT ------------
  logout() {
    localStorage.removeItem('user_session');
    this.currentUser.set(null);
    this.router.navigate(['/pages/login']);
  }

  // STORAGE HELPERS ---
  private saveUserToStorage(user: User) {
    localStorage.setItem('user_session', JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('user_session');
    return user ? JSON.parse(user) : null;
  }
}