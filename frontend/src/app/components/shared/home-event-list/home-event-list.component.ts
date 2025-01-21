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
    this.eventService.getEvents().subscribe((res) => {
      this.events = res;
      this.filteredEvents = [...this.events]; // Use a fresh copy
      this.adjustNumVisible(this.filteredEvents.length);
    });
  
    this.eventService.currentSearchNameChange.subscribe((searchTerm) => {
      if (searchTerm) {
        this.filteredEvents = this.events.filter(
          (event) =>
            event.name.toLowerCase().includes(searchTerm) ||
            event.location.toLowerCase().includes(searchTerm)
            
        );
      } else {
        this.filteredEvents = [...this.events]; // Reset to original events
        
      }
      this.adjustNumVisible(this.filteredEvents.length);
    });
  
    
  }
  
  
  
    // Adjust the number of visible items based on screen width
    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
      this.adjustNumVisible(this.filteredEvents.length);
    }
  

  onClickEvent(eventId:string): void {
    if (eventId) {
      this.router.navigate([`/events/${eventId}`]);
    } else {
      alert('Please select an option before creating an account.');
    }
  }
  private adjustNumVisible(fileteredEventlength:number): void {
    const screenWidth = window.innerWidth;
    console.log(fileteredEventlength);
    if (screenWidth >= 1200) {
      this.numVisible = Math.min(fileteredEventlength, 5); // Show up to 5 events
      
    } else if (screenWidth >= 992) {
      this.numVisible = Math.min(fileteredEventlength, 4); // Show up to 4 events
    } else if (screenWidth >= 768) {
      this.numVisible = Math.min(fileteredEventlength, 3); // Show up to 3 events
    } else {
      this.numVisible = Math.min(fileteredEventlength, 2); // Show up to 2 events
    }
  }


}
