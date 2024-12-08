export class Ticket {
   eventId : number
   theatreId:number
   seatCode : string
   customerName : string

   constructor(eventId:number,seatCode:string,customerName:string,theatreId:number)
   {
     this.eventId = eventId;
     this.seatCode = seatCode;
     this.customerName = customerName;
     this.theatreId = theatreId;
   }

}
