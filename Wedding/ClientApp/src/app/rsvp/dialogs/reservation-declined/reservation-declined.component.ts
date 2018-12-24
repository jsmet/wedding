
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-reservation-declined',
  templateUrl: './reservation-declined.component.html',
  styleUrls: ['./reservation-declined.component.css']
})
export class ReservationDeclinedComponent {

  constructor(
    public dialogRef: MatDialogRef<ReservationDeclinedComponent>
  ) { }

  onClick() {
    this.dialogRef.close();
  }
}
