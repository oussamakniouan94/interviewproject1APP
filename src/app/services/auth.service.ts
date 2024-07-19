import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/auth/redirect/google`;
  }

  handleGoogleCallback(code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/callback/google`, { code });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  retrieveTokenFromUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      this.setToken(token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  verifyToken(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-token`, { token });
  }
}
