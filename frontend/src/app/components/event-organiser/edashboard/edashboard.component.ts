import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventOganiserService } from '../../../services/event-organiser.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { EventModel } from '../../../model/event-model';

@Component({
  selector: 'app-edashboard',
  standalone: true,
  imports: [DatePipe,NgFor,NgIf],
  templateUrl: './edashboard.component.html',
  styleUrls: ['./edashboard.component.css'],
})
export class EdashboardComponent implements OnInit {
  events: EventModel[] = [];
  loading: boolean = true; // Loading state

  constructor(private router: Router, private eventorganiserService: EventOganiserService) {}

  ngOnInit(): void {
    this.eventorganiserService.getEventsByUserId().subscribe((events) => {
      this.events = events; // Set events once fetched
      this.loading = false; // Stop loading once data is fetched
    });
  }

  navigateToPostEvent() {
    this.router.navigate(['/event-organiser/post-event']);
  }
}
