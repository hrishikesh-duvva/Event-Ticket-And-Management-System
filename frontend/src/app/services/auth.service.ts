import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://event-ticket-and-management-system-gpbefvcsbdfshffb.southindia-01.azurewebsites.net/api/auth';

  // State to track login status
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();


  private user: { PhoneNumber: string; Password: string; Role: string } | null = null;

  constructor(private http: HttpClient) {
    this.checkLoginStatus(); // Initialize login state
  }


  login(user: { PhoneNumber: string; Password: string; Role: string; }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user).pipe(
      tap((response: any) => {
        if (response?.token) {
          localStorage.setItem('token', response.token); // Store token in localStorage
          this.isLoggedInSubject.next(true); // Update login status
          this.user = user; // Update user info
        }
      })
    );
  }

 
  register(registerData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, registerData);
  }


  logout() {
    this.user = null;
    localStorage.removeItem('token'); // Clear token from storage
    this.isLoggedInSubject.next(false); // Update login status
  }

 
  getUser() {
    return this.user;
  }

 
  checkLoginStatus() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedInSubject.next(true); // User is logged in
    } else {
      this.isLoggedInSubject.next(false); // User is not logged in
    }
  }


  checkPhoneNumber(phoneNumber: string) {
    return this.http.post<{ exists: boolean }>(`${this.apiUrl}/checkPhoneNumber`, { phoneNumber });
  }

  updatePassword(phoneNumber: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/updatePassword`, { phoneNumber, newPassword });
  }
}
