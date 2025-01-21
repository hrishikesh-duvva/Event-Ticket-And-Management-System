import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SeatService } from '../../services/seat-service.service';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-seat',
  standalone: true,
  imports:[FormsModule,NgFor,NgIf,NgClass],
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.scss'],
})
export class SeatComponent implements OnInit {
  eventId!: number;
  scheduleId!: number;
  seats: any[] = [];
  organizedSeats: any[][] = [];
  selectedSeats: any[] = [];
  maxSelection = 6;
  isAuthenticated = true; // Track user authentication status
  notAuthenticatedMessage = 'You are not logged in. Please register or log in to continue.';

  ticketPrices: { [key: string]: number } = {}; // Stores ticket prices (e.g., VIP, General)
  totalPrice: number = 0;
  selectedTicketType: string | null = null; // VIP or General
  paymentMethod: string = ''; // Selected payment method

  discounts: any[] = []; // List of discounts
  discountCode: string = ''; // Input discount code
  appliedDiscount: any = null; // Applied discou

  bookedTickets: any = null;

  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private seatService: SeatService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    try {
      this.getCustomerIdFromToken(); // Check if user is authenticated
    } catch (error) {
      console.error(error);
      this.isAuthenticated = false; // Set flag to false if user is not authenticated
    }
    this.route.paramMap.subscribe((params) => {
      this.eventId = +params.get('eventId')!;
      this.scheduleId = +params.get('scheduleId')!;
      this.fetchSeats();
      this.fetchTicketPrices();
      this.fetchDiscounts();
    });
  }

  fetchSeats(): void {
    this.seatService.getSeats(this.eventId, this.scheduleId).subscribe(
      (res) => {
        if (res && res.$values) {
          this.seats = res.$values;
          this.organizeSeats();
        } else {
          console.error('No seats data found');
        }
      },
      (err) => {
        console.error('Error fetching seats:', err);
      }
    );
  }
  
  organizeSeats(): void {
    const vipSeats = this.seats.filter((seat) => seat.section === 'VIP');
    const generalSeats = this.seats.filter((seat) => seat.section === 'General');
  
    this.organizedSeats = [
      ...this.groupSeats(vipSeats, 10), // 10 seats per row for VIP
      ...this.groupSeats(generalSeats, 20), // 20 seats per row for General
    ];
  }
  
  groupSeats(seats: any[], perRow: number): any[][] {
    const rows = [];
    for (let i = 0; i < seats.length; i += perRow) {
      rows.push(seats.slice(i, i + perRow));
    }
    return rows;
  }

  fetchTicketPrices(): void {
    this.seatService.getTicketPrices(this.eventId).subscribe(
      (res) => {
        if (res && res.$values) {
          // Populate ticketPrices with type as key and price as value
          res.$values.forEach((ticketType: any) => {
            // this.ticketPrices[ticketType.ticketTypee === 0 ? 'VIP' : 'General'] = ticketType.price;
            const type = ticketType.ticketTypee === 0 ? 'VIP' : 'General';
          this.ticketPrices[type] = ticketType.price;
          });
        } else {
          console.error('No ticket prices data found');
        }
      },
      (err) => {
        console.error('Error fetching ticket prices:', err);
      }
    );
  }

  fetchDiscounts(): void {
    this.http.get<any>(`https://event-ticket-and-management-system-gpbefvcsbdfshffb.southindia-01.azurewebsites.net/api/discounts/${this.eventId}`).subscribe(
      (res) => {
        if (Array.isArray(res)) {
          // Response is an array
          this.discounts = res;
        } else if (res && res.$id) {
          // Response is a single object
          this.discounts = [res]; // Wrap it in an array for consistency
        } else {
          console.error('No discounts data found.');
          this.discounts = []; // Set an empty array if no discounts are found
        }
        console.log('Fetched Discounts:', this.discounts); // Debugging log
      },
      (err) => {
        console.error('Error fetching discounts:', err);
      }
    );
  }
  


  applyDiscount(discount: any): void {
    if (this.appliedDiscount?.discountId === discount.discountId) {
      // If the same discount is clicked, remove it
      this.appliedDiscount = null;
      this.calculateTotalPrice(); // Recalculate price without discount
      alert('Discount removed.');
    } else {
      // Apply the selected discount
      if (discount) {
        this.appliedDiscount = discount;
        this.calculateTotalPrice();
        alert(`Discount applied: ${discount.discountCode} (${discount.discountPercentage}%)`);
      } else {
        alert('This discount is not applicable for the selected ticket type.');
      }
    }
  }
  toggleSeatSelection(seat: any): void {
    if (seat.availabilityStatus === 0) {
      const seatType = seat.section;
      if (
        this.selectedTicketType &&
        this.selectedTicketType !== seatType &&
        this.selectedSeats.length > 0
      ) {
        alert(`You can only select ${this.selectedTicketType} seats.`);
        return;
      }

      if (this.selectedSeats.includes(seat)) {
        this.selectedSeats = this.selectedSeats.filter((s) => s !== seat);
        if (this.selectedSeats.length === 0) {
          this.selectedTicketType = null;
        }
      } else if (this.selectedSeats.length < this.maxSelection) {
        this.selectedSeats.push(seat);
        this.selectedTicketType = seatType;
      }

      this.calculateTotalPrice();
    }
  }
  calculateTotalPrice(): void {
    const ticketTypeKey = this.selectedTicketType!;
    let basePrice = 0;
  
    if (ticketTypeKey && this.ticketPrices[ticketTypeKey] !== undefined) {
      basePrice = this.selectedSeats.length * this.ticketPrices[ticketTypeKey];
    }
  
    if (this.appliedDiscount) {
      const discountPercentage = this.appliedDiscount.discountPercentage || 0;
      this.totalPrice = basePrice - (basePrice * discountPercentage) / 100;
    } else {
      this.totalPrice = basePrice;
    }
  }

  

  get selectedSeatNumbers(): string {
    return this.selectedSeats.map((s) => s.seatNumber).join(', ');
  }

  getCustomerIdFromToken(): number {
    const token = localStorage.getItem('token'); // Replace with your token retrieval logic
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); // Decode the token
        console.log('Decoded Token:', decodedToken); // Debugging the decoded token
        return +decodedToken.UserId; // Fetch and return the UserId (ensure it's a number)
      } catch (error) {
        console.error('Invalid token:', error);
        throw new Error('Failed to decode token');
      }
    }
    throw new Error('User not authenticated: Token not found');
  }
  
  get bookedSeatNumbers(): string {
    return this.bookedTickets?.seats?.map((seat: any) => seat.seatNumber).join(', ') || '';
  }
  

  bookTickets(paymentMethod: string): void {
    if (this.selectedSeats.length > 0) {
      const customerId = this.getCustomerIdFromToken(); // Extract Customer ID from JWT Token
      const seatIds = this.selectedSeats.map((s) => s.seatingId);
      const ticketTypeId = this.selectedSeats[0].ticketTypeId; // Assuming all selected seats are of the same type
      const quantity = this.selectedSeats.length;
      const discountId = this.appliedDiscount ? this.appliedDiscount.discountId : null;
  
      const payload = {
        customerId,
        scheduleId: this.scheduleId,
        seatIds,
        ticketTypeId,
        quantity,
        paymentMethod,
        discountId,
      };
  
      console.log('Payload being sent:', payload); 
  
      this.seatService.bookTickets(
        payload.customerId,
        payload.scheduleId,
        payload.seatIds,
        payload.ticketTypeId,
        payload.quantity,
        payload.paymentMethod,
        payload.discountId
      ).subscribe(
        (res) => {
          console.log('Response:', res); // Log the success response
          alert('Tickets booked successfully!');
          // this.router.navigate(['/']); // Redirect to home or confirmation page
          this.bookedTickets = {
            schedule: this.scheduleId,
            seats: this.selectedSeats,
            totalPrice: this.totalPrice,
            ticketType: this.selectedTicketType,
            paymentMethod,
          };
          this.loading = false;
        },
        (err) => {
          console.error('Error during booking:', err); // Log the error
          alert('Error booking tickets: ' + err.message);
          this.loading = false;
        }
      );
    } else {
      alert('No seats selected!');
    }
  }

  

  navigateToRegistration(): void {
    this.router.navigate(['/Customer/register']);
  }
  
}
