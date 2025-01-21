import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EventService } from '../../../services/event.service';
import { ScheduleService } from '../../../services/schedule.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { EditScheduleDialogComponent } from '../edit-schedule-dialog/edit-schedule-dialog.component';

@Component({
  selector: 'app-edit-schedules',
  standalone: true,
  templateUrl: './edit-schedules.component.html',
  styleUrls: ['./edit-schedules.component.css'],
  imports: [CommonModule, FormsModule, DatePipe, MatDialogModule],
})
export class EditSchedulesComponent implements OnInit {
  event: any = null;
  schedules: any[] = [];
  eventId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private scheduleService: ScheduleService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.eventId = +params.get('id')!;
      this.loadEventDetails();
    });
  }

  loadEventDetails(): void {
    if (this.eventId) {
      this.eventService.getEventById(this.eventId).subscribe((res) => {
        this.event = res;
        const scheduleIds = res.schedules.$values.map(
          (schedule: any) => schedule.scheduleId
        );
        scheduleIds.forEach((scheduleId: number) => {
          this.eventService.getScheduleById(scheduleId).subscribe({
            next: (schedule) => {
              this.schedules.push(schedule);
            },
            error: (err) => {
              if (err.status === 404) {
                console.warn(`Schedule with ID ${scheduleId} not found and skipped.`);
              } else {
                console.error(`Error fetching schedule ID ${scheduleId}:`, err);
              }
            },
          });
        });
      });
    }
  }
  
  

  openEditDialog(schedule: any): void {
    const dialogRef = this.dialog.open(EditScheduleDialogComponent, {
      width: '500px',
      height: 'auto',
      disableClose: true,
      data: { ...schedule },
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
      autoFocus: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Updated schedule data:', result); // Log updated data
        if (!result.scheduleId) {
          console.error('No schedule ID provided for the update.');
          return;
        }
        this.updateSchedule(result); // Pass the updated schedule to the update method
      }
    });
  }

  openAddDialog(): void {
    const newSchedule = {
      eventId: this.eventId,
      sessionName: '',
      startTime: '',
      endTime: '',
      speakerName: '',
      description: '',
      vipRows: 0,
      generalRows: 0,
      status: '',
      capacity: 0,
      vipPrice: 0,
      generalPrice: 0,
    };

    const dialogRef = this.dialog.open(EditScheduleDialogComponent, {
      width: '500px',
      height: 'auto',
      disableClose: true,
      data: newSchedule,
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
      autoFocus: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createSchedule(result);
      }
    });
  }

  updateSchedule(updatedSchedule: any): void {
    console.log('Payload being sent:', updatedSchedule);
    this.scheduleService.updateSchedule(updatedSchedule.scheduleId, updatedSchedule).subscribe({
      next: () => {
        alert('Schedule updated successfully!');
        this.loadEventDetails();
      },
      error: (err) => {
        console.error('Failed to update schedule:', err);
        alert('Failed to update schedule.');
      },
    });
  }

  createSchedule(newSchedule: any): void {
    console.log('Payload being sent:', newSchedule);
    this.scheduleService.createSchedule(newSchedule).subscribe({
      next: () => {
        alert('New schedule added successfully!');
        this.loadEventDetails();
      },
      error: (err) => {
        console.error('Failed to add schedule:', err);
        alert('Failed to add schedule.');
      },
    });
  }
}
