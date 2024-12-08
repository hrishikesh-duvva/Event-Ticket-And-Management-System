import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class EventDetailComponent  implements OnInit {

  id = 0;
  event: any = null; // Event data
  schedules: any[] = []; // Schedules array
  selectedScheduleId: number | null = null; // Selected schedule
  isEventLoaded = false;
  userRole: string | null = null;
  apiUrl = 'http://localhost:5095/api/schedules/schedule/';

  constructor(
    public router: Router, // Changed from private to public
    private route: ActivatedRoute,
    private eventService: EventService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id != null) {
        this.id = +id;

        this.eventService.getEventById(this.id).subscribe((res) => {
          if (res) {
            this.isEventLoaded = true;
            this.event = res;

            const scheduleIds = res.schedules.$values.map(
              (schedule: any) => schedule.scheduleId
            );

            // Fetch details for each schedule
            scheduleIds.forEach((scheduleId: number) => {
              this.eventService.getScheduleById(scheduleId).subscribe((schedule) => {
                this.schedules.push({
                  scheduleId: schedule.scheduleId,
                  sessionName: schedule.sessionName,
                  startTime: schedule.startTime,
                  endTime: schedule.endTime,
                  speakerName: schedule.speakerName,
                  capacity: schedule.capacity,
                });
              });
            });
          }
        });
      }
    });
  }

  checkUserRole(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.decodeJwt(token);
      this.userRole = decodedToken?.UserRole || null; // Extract user role
    }
  }

  // Decode JWT token to extract information
  decodeJwt(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = atob(parts[1]); // Decode base64 string
        return JSON.parse(payload); // Convert the JSON string to an object
      }
    } catch (error) {
      console.error('Failed to decode JWT:', error);
    }
    return null;
  }

  onSelectSchedule(scheduleId: number): void {
    this.selectedScheduleId = scheduleId;
  }

  onBookTickets(): void {
    if (this.selectedScheduleId) {
      this.router.navigate([`/events/seat-selection/${this.id}/${this.selectedScheduleId}`]);
    } else {
      alert('Please select a schedule to book tickets.');
    }
  }

  onDeleteSchedule(): void {
    if (this.selectedScheduleId) {
      const headers = new HttpHeaders().set(
        'Authorization',
        `Bearer ${localStorage.getItem('token')}`
      );

      const deleteUrl = `${this.apiUrl}${this.selectedScheduleId}`;
      this.http.delete(deleteUrl, { headers }).subscribe({
        next: () => {
          alert('Schedule deleted successfully!');
          // Remove the deleted schedule from the list
          this.schedules = this.schedules.filter(
            (schedule) => schedule.scheduleId !== this.selectedScheduleId
          );
          this.selectedScheduleId = null; // Reset the selected schedule
        },
        error: (err) => {
          console.error('Failed to delete schedule:', err);
          alert('Failed to delete the schedule.');
        },
      });
    } else {
      alert('Please select a schedule to delete.');
    }
  }

}
