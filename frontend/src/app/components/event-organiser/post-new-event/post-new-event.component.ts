import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventModel, Schedule } from '../../../model/event-model';
import { EventService } from '../../../services/event.service'; // Assuming you have an EventService for API calls
import { ScheduleService } from '../../../services/schedule.service'; // Assuming you have a ScheduleService

@Component({
  selector: 'app-post-new-event',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-new-event.component.html',
  styleUrls: ['./post-new-event.component.css'],
})
export class PostNewEventComponent implements OnInit {
  event: EventModel = {
    eventId:0,
    name: '',
    location: '',
    description: '',
    organizerId: 0,
    eventImage: '',
    schedules: [],
  };

  newSchedule: Schedule = {
    eventId: 0,
    sessionName: '',
    startTime: '',
    endTime: '',
    speakerName: '',
    description: '',
    vipRows: 0,
    generalRows: 0,
    status: 'Upcoming',
    capacity: 0,
    vipPrice: 0,
    generalPrice: 0,
  };

  showScheduleForm = false;
  eventId: number | null = null;

  constructor(
    private eventService: EventService, // Inject event service to interact with the backend
    private scheduleService: ScheduleService // Inject schedule service for schedule operations
  ) {}

  ngOnInit() {}

  // This function posts the event and gets the EventId
  submitEvent() {
    console.log('Event Posted:', this.event);

    this.eventService.createEvent(this.event).subscribe(
      (response) => {
        this.eventId = response.eventId; // Get the EventId from the response
        alert('Event posted successfully!');
        console.log('Event Created with ID:', this.eventId);
        this.showScheduleForm = true; // Enable schedule form after event is created
      },
      (error) => {
        console.error('Error posting event:', error);
        alert('Failed to post event.');
      }
    );
  }

  addSchedule() {
    if (this.eventId) {
      this.newSchedule.eventId = this.eventId; // This is setting the correct eventId for the schedule
      console.log('Schedule to be added:', this.newSchedule); // Debugging log
      this.scheduleService.createSchedule(this.newSchedule).subscribe(
        (response) => {
          console.log('Schedule Created:', response); // Check if schedule was created
          this.event.schedules.push({ ...this.newSchedule }); // Add schedule to the event
          this.showScheduleForm = false; // Hide the form after schedule is added
          this.newSchedule = { // Reset the new schedule form
            eventId: 0,
            sessionName: '',
            startTime: '',
            endTime: '',
            speakerName: '',
            description: '',
            vipRows: 0,
            generalRows: 0,
            status: 'Upcoming',
            capacity: 0,
            vipPrice: 0,
            generalPrice: 0,
          };
        },
        (error) => {
          console.error('Error adding schedule:', error);
          alert('Failed to add schedule.');
        }
      );
    }
  }
  

  showAddScheduleForm() {
    this.showScheduleForm = true;
  }

  deleteSchedule(index: number) {
    this.event.schedules.splice(index, 1); // Remove the schedule at the specified index
  }
}
