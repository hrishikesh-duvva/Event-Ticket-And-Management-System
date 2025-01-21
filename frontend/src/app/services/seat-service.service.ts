import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SeatService {
  private seatingUrl = 'https://event-ticket-and-management-system-gpbefvcsbdfshffb.southindia-01.azurewebsites.net/api/seating';
  private bookingUrl = 'https://event-ticket-and-management-system-gpbefvcsbdfshffb.southindia-01.azurewebsites.net/api/TicketBooking/book-ticket';

  constructor(private http: HttpClient) {}

  getSeats(eventId: number, scheduleId: number): Observable<any> {
    return this.http.get<any>(`${this.seatingUrl}/event/${eventId}/schedule/${scheduleId}`);
  }

  getTicketPrices(eventId: number): Observable<any> {
    return this.http.get<any>(`https://event-ticket-and-management-system-gpbefvcsbdfshffb.southindia-01.azurewebsites.net/api/tickettypes/event/${eventId}`);
  }

  bookTickets(
    customerId: number,
    scheduleId: number,
    seatIds: number[],
    ticketTypeId: number,
    quantity: number,
    paymentMethod: string,
    discountId: number | null
  ): Observable<any> {
    const body = {
      customerId,
      scheduleId,
      seatIds,
      ticketTypeId,
      quantity,
      paymentMethod,
      discountId,
    };
  
    return this.http.post<any>(this.bookingUrl, body);
  }
  
  
}
