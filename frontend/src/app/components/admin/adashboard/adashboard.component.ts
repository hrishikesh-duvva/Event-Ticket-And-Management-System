import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../services/event.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-adashboard',
  standalone:true,
  imports:[CommonModule],
  templateUrl: './adashboard.component.html',
  styleUrls: ['./adashboard.component.css'],
})
export class AdashboardComponent  implements OnInit {

  events: any[] = []; // List of events

  constructor(private eventService: EventService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe((res) => {
      this.events = res;
    });
  }

  onDeleteEvent(eventId: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      const headers = new HttpHeaders().set(
        'Authorization',
        `Bearer ${localStorage.getItem('token')}`
      );

      const deleteUrl = `https://event-ticket-and-management-system-gpbefvcsbdfshffb.southindia-01.azurewebsites.net/api/events/${eventId}`;
      this.http.delete(deleteUrl, { headers }).subscribe({
        next: () => {
          alert('Event deleted successfully!');
          // Remove the event from the list
          this.events = this.events.filter((event) => event.eventId !== eventId);
        },
        error: (err) => {
          console.error('Failed to delete event:', err);
          alert('Failed to delete the event.');
        },
      });
    }
  }

}
