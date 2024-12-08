import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { EventModel } from '../model/event-model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class EventOganiserService {
  constructor(private http: HttpClient) {}

  getCustomerIdFromToken(): number {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return +decodedToken.UserId; // Fetch and return the UserId (ensure it's a number)
      } catch (error) {
        console.error('Invalid token:', error);
        throw new Error('Failed to decode token');
      }
    }
    throw new Error('User not authenticated: Token not found');
  }

  getEventsByUserId(): Observable<EventModel[]> {
    const userId = this.getCustomerIdFromToken();  // Get user ID from token

    if (userId !== -1) {
      const url = `http://localhost:5095/api/events/user/${userId}`;  // Use userId to fetch events
      const token = localStorage.getItem('token');  // Get the token
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<any>(url, { headers }).pipe(
        map(response => {
          return response.$values.map((event: any) => ({
            ...event,
            schedules: event.schedules?.$values || [] // Make sure schedules is an array
          }));
        })
      );
    }
    return of([]);  // Return empty array if no userId found
  }
}


