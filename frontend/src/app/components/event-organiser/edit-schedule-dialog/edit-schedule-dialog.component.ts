import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-schedule-dialog',
  templateUrl: './edit-schedule-dialog.component.html',
  styleUrls: ['./edit-schedule-dialog.component.css'],
  standalone:true,  // Marking the component as standalone
  imports:[FormsModule,CommonModule]
})
export class EditScheduleDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<EditScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    console.log('Data being saved:', this.data); 
    if (!this.data.scheduleId) {
      console.error('Schedule ID is missing!');
      return;
    }
    this.dialogRef.close(this.data); 
  }
}
