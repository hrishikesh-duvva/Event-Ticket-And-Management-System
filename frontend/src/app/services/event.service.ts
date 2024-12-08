import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Eventm } from '../model/event-model';
import { CarouselImage } from '../model/CarouselImage';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://localhost:5095/api/events';
  private scheduleUrl = 'http://localhost:5095/api/schedules';

  constructor(private http: HttpClient) {}

  // Properties
  currentSearchNameChange: Subject<string> = new Subject<string>();

  // Utility: Decode user ID from JWT
  getUserIdFromToken(): number {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (token) {
      const decodedToken: any = jwtDecode(token); // Decode the token
      return decodedToken.userId; // Return the userId from the decoded token
    }
    return -1; // Return -1 if no token is found
  }

  // Search Functionality
  setCurrentSearchedName(currentSearchedName: string) {
    this.currentSearchNameChange.next(currentSearchedName.trim().toLowerCase());
  }

  filterByName(items: any[], name: string): any[] {
    return items.filter(item =>
      item.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // CRUD Operations for Events
  createEvent(eventData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.apiUrl, eventData, { headers });
  }

  getEvents(): Observable<Eventm[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response =>
        response.$values.map((event: any) =>
          new Eventm(
            event.eventId,
            event.name,
            event.eventImage,
            event.location
          )
        )
      )
    );
  }

  getEventById(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url);
  }

  getScheduleById(scheduleId: number): Observable<any> {
    const url = `${this.scheduleUrl}/${scheduleId}`;
    return this.http.get<any>(url);
  }

  // Carousel Images
  getCarouselImages(): Observable<CarouselImage[]> {
    const images: CarouselImage[] = [
      { image: 'assets/images/image4.png' },
      { image: 'assets/images/image5.png' },
    ];
    return of(images);
  }
}
