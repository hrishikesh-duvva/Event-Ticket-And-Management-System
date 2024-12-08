

export interface Schedule {
    eventId: number;       // ID of the associated event
    sessionName: string;   // Name of the session
    startTime: string;     // Start time (ISO string format)
    endTime: string;       // End time (ISO string format)
    speakerName: string;   // Name of the speaker
    description: string;   // Description of the session
    vipRows: number;       // Number of VIP seating rows
    generalRows: number;   // Number of general seating rows
    status: string;        // Status of the schedule (e.g., "Active", "Completed")
    capacity: number;      // Total capacity of the schedule
    vipPrice: number;      // Price per seat for VIP
    generalPrice: number;  // Price per seat for General
  }
  export interface EventModel {
    name: string;           // Name of the event
    location: string;       // Location of the event
    description: string;    // Description of the event
    organizerId: number;    // Organizer ID
    eventImage: string;     // Image URL for the event
    schedules: Schedule[];  // Array of schedules
  }
  export class Eventm {
    constructor(
      public eventId: number,
      public name: string,
      public eventImage: string,
      public location: string
    ) {}
  }
  