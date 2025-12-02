import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, Observable } from 'rxjs';

export interface User {
  userId: number;
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

  // REAL .NET API URL
  private baseUrl = 'https://localhost:7115/api/auth';

  constructor() {}

  // LOGIN --------------
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials).pipe(
      tap(response => {
        const user: User = {
          userId: response.user.userId,
          name: response.user.name,
          email: response.user.email,
          token: response.token
        };

        this.saveUserToStorage(user);
        this.currentUser.set(user);
      })
    );
  }

  // REGISTER ----------
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data).pipe(
      tap(() => {
        // You can choose what to do after register.
        // If backend returns the user + token, you can store it here.
      })
    );
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
