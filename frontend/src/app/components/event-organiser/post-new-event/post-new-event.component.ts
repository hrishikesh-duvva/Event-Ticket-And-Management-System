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
    eventId: 0,
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
  isEventPosted = false;  // Flag to prevent multiple event submissions
  isScheduleAdded = false; // Flag to prevent adding schedule until it's added

  constructor(
    private eventService: EventService,
    private scheduleService: ScheduleService
  ) {}

  ngOnInit() {}
  validateSchedule(): boolean {
    const startTime = new Date(this.newSchedule.startTime);
    const endTime = new Date(this.newSchedule.endTime);
    const today = new Date();

    if (startTime < today) {
      alert('Start time cannot be in the past.');
      return false;
    }
    if (endTime <= startTime) {
      alert('End time must be greater than start time.');
      return false;
    }
    return true;
  }
  // This function posts the event and gets the EventId
  submitEvent() {
    if (this.isEventPosted) return; // Prevent multiple event submissions

    this.isEventPosted = true; // Set to true to prevent further submissions

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
        this.isEventPosted = false; // Re-enable the button if event post fails
      }
    );
  }

  addSchedule() {
    if (this.isScheduleAdded) return; // Prevent multiple schedule submissions if one is already added

    if (this.eventId) {
      if (!this.validateSchedule()) {
        return;
      }
      if (this.newSchedule.vipRows === 0 && this.newSchedule.generalRows === 0) {
        alert('At least one of VIP Rows or General Rows must be greater than 0');
        return;
      }
    
      this.isScheduleAdded = true; // Set to true to prevent multiple submissions

      this.newSchedule.eventId = this.eventId; // Set the correct eventId for the schedule
      console.log('Schedule to be added:', this.newSchedule);

      this.scheduleService.createSchedule(this.newSchedule).subscribe(
        (response) => {
          console.log('Schedule Created:', response); // Check if schedule was created
          this.event.schedules.push({ ...this.newSchedule }); // Add schedule to the event
          this.isScheduleAdded = false; // Re-enable adding schedule after success
          alert('Schedule successfully added!');
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
            capacity: 10,
            vipPrice: 0,
            generalPrice: 0,
          };
        },
        (error) => {
          console.error('Error adding schedule:', error);
          alert('Failed to add schedule.');
          this.isScheduleAdded = false; // Re-enable the button if schedule add fails
        }
      );
    }
  }

  deleteSchedule(index: number) {
    this.event.schedules.splice(index, 1); // Remove the schedule at the specified index
  }
}
