import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AdminService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  // Observable for login status
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private apiUrl = 'https://event-ticket-and-management-system-gpbefvcsbdfshffb.southindia-01.azurewebsites.net/api/admin';

  constructor(private http: HttpClient) {}

  login(PhoneNumber: string, Password: string,Role:string): Observable<any> {
    console.log({ PhoneNumber, Password, Role});
    return this.http.post(`${this.apiUrl}/login`, { PhoneNumber, Password, Role});
  }

  private events = [
    { id: 1, name: 'Music Festival', status: 'Active' },
    { id: 2, name: 'Tech Conference', status: 'Suspicious' },
    { id: 3, name: 'Art Expo', status: 'Active' },
    { id: 4, name: 'Food Fair', status: 'Suspicious' },
  ];

  private users = [
    { id: 1, name: 'John Doe', status: 'Active' },
    { id: 2, name: 'Jane Smith', status: 'Inactive' },
    { id: 3, name: 'Alex Johnson', status: 'Active' },
  ];

  getEvents() {
    return this.events;
  }

  getUsers() {
    return this.users;
  }

  deleteEvent(id: number) {
    this.events = this.events.filter((event) => event.id !== id);
  }
  
}