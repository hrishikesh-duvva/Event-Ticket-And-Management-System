import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5095/api/auth';

  // State to track login status
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  // State to store user info
  private user: { PhoneNumber: string; Password: string; Role: string } | null = null;

  constructor(private http: HttpClient) {
    this.checkLoginStatus(); // Initialize login state
  }

  /**
   * Login the user.
   * Sends a POST request to the backend with user credentials.
   * @param user - The user login credentials.
   * @returns Observable of the login response.
   */
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

  /**
   * Register a new user.
   * Sends a POST request to the backend with registration data.
   * @param registerData - The registration data.
   * @returns Observable of the register response.
   */
  register(registerData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, registerData);
  }

  /**
   * Logout the user.
   * Clears the token and updates the login state.
   */
  logout() {
    this.user = null;
    localStorage.removeItem('token'); // Clear token from storage
    this.isLoggedInSubject.next(false); // Update login status
  }

  /**
   * Get the logged-in user's information.
   * @returns User info or null if not logged in.
   */
  getUser() {
    return this.user;
  }

  /**
   * Check the login status on app load.
   * Updates the login state based on the token's presence.
   */
  checkLoginStatus() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedInSubject.next(true); // User is logged in
    } else {
      this.isLoggedInSubject.next(false); // User is not logged in
    }
  }
}
