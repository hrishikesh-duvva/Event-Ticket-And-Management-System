import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SeatService {
  private seatingUrl = 'http://localhost:5095/api/seating';
  private bookingUrl = 'http://localhost:5095/api/TicketBooking/book-ticket';

  constructor(private http: HttpClient) {}

  getSeats(eventId: number, scheduleId: number): Observable<any> {
    return this.http.get<any>(`${this.seatingUrl}/event/${eventId}/schedule/${scheduleId}`);
  }

  getTicketPrices(eventId: number): Observable<any> {
    return this.http.get<any>(`http://localhost:5095/api/tickettypes/event/${eventId}`);
  }

  bookTickets(
    customerId: number,
    scheduleId: number,
    seatIds: number[],
    ticketTypeId: number,
    quantity: number,
    paymentMethod: string
  ): Observable<any> {
    const body = {
      customerId,
      scheduleId,
      seatIds,
      ticketTypeId,
      quantity,
      paymentMethod,
    };

    return this.http.post<any>(this.bookingUrl, body);
  }
}
