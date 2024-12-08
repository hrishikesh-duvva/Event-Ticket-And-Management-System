import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarouselimagesComponent } from '../carouselimages/carouselimages.component';
import { CarouselModule } from 'primeng/carousel';
import { EventService } from '../../../services/event.service';
import { Eventm } from '../../../model/event-model';

@Component({
  selector: 'app-home-event-list',
  templateUrl: './home-event-list.component.html',
  styleUrls: ['./home-event-list.component.scss'],
  standalone:true,
  imports: [CommonModule, RouterModule, CarouselimagesComponent,CarouselModule],
})
export class HomeEventListComponent  implements OnInit {
  numVisible: number = 5; 
  events: Eventm[] = [];
  filteredEvents: Eventm[] = [];
  currentSearchedEvent : string ='';
  constructor(private router:Router,public eventService:EventService) {}




  ngOnInit(): void {
      this.eventService.getEvents().subscribe(res =>{
        this.events = res;
       this.filteredEvents = res;
      });


       this.eventService.currentSearchNameChange.subscribe(value =>{
        this.currentSearchedEvent = value;
        this.filteredEvents = this.eventService.filterByName(this.events, value);
      });

      this.adjustNumVisible(); // Set the initial value
    }
  
    // Adjust the number of visible items based on screen width
    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
      this.adjustNumVisible();
    }
  

  onClickEvent(eventId:string): void {
    if (eventId) {
      this.router.navigate([`/events/${eventId}`]);
    } else {
      alert('Please select an option before creating an account.');
    }
  }
  private adjustNumVisible(): void {
    const screenWidth = window.innerWidth;

    if (screenWidth >= 1200) {
      this.numVisible = 5; // Large screens
    } else if (screenWidth >= 992) {
      this.numVisible = 4; // Medium screens
    } else if (screenWidth >= 768) {
      this.numVisible = 3; // Small screens
    } else {
      this.numVisible = 2; // Extra-small screens
    }
  }


}
