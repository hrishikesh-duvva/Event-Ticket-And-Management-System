import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private apiUrl = 'https://event-ticket-and-management-system-gpbefvcsbdfshffb.southindia-01.azurewebsites.net/api/schedules'; 

  constructor(private http: HttpClient) {}

  createSchedule(scheduleData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}`, scheduleData, { headers });
  }

  updateSchedule(scheduleId: number, schedule: any): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log('PUT URL:', `${this.apiUrl}/${scheduleId}`); // Debug log
  console.log('PUT payload:', schedule); // Debug log
    return this.http.put<void>(`${this.apiUrl}/${scheduleId}`, schedule, { headers });
  }
  

 
}
