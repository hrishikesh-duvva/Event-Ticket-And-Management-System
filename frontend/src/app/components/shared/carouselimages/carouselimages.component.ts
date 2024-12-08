import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CarouselImage } from '../../../model/CarouselImage';
import { Carousel, CarouselModule } from 'primeng/carousel';
import { EventService } from '../../../services/event.service';

@Component({
  selector: 'app-carouselimages',
  standalone: true,
  imports: [CommonModule,CarouselModule],
  templateUrl: './carouselimages.component.html',
  styleUrl: './carouselimages.component.css'
})
export class CarouselimagesComponent implements OnInit {
  slides: CarouselImage[] = [];
  currentIndex = 0;
  constructor(public eventService:EventService) {}

  ngOnInit() {
    this.eventService.getCarouselImages().subscribe(images => {
      this.slides = images;
      this.startSlideshow();
    });
  }

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];
  private startSlideshow() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    }, 300);
  }
}
