
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-reservation-success',
  templateUrl: './reservation-success.component.html',
  styleUrls: ['./reservation-success.component.css']
})
export class ReservationAcceptedComponent {

  constructor(
    public dialogRef: MatDialogRef<ReservationAcceptedComponent>
  ) { }

  onClick() {
    this.dialogRef.close();
  }
}
