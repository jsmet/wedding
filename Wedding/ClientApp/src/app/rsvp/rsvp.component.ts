
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RSVP } from './models/rsvp';
import { ConfirmRsvp } from './models/confirmRsvp';
import { validateConfig } from '@angular/router/src/config';
import { ReservationAcceptedComponent } from './dialogs/reservation-accepted/reservation-success.component';
import { ReservationDeclinedComponent } from './dialogs/reservation-declined/reservation-declined.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'rsvp-component',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.css']
})
export class RsvpComponent implements OnInit {
  rsvpForm: FormGroup;
  rsvpId: string;
  formSubmissionError: boolean;  
  rsvp: RSVP;
  confirmRsvp: FormGroup;
  success: boolean;
  showHelpText: number;
  validRsvp: boolean;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.rsvpForm = this.fb.group({
      rsvpId: [this.rsvpId]
    });

    this.formSubmissionError = false;
    this.success = false;
    this.showHelpText = 0;
    this.validRsvp = true;
  }

  fetchRSVP() {
    this.validRsvp = false;
    this.http.get<RSVP>(`/api/RSVP?id=${this.rsvpId}`).subscribe(result => {
      this.validRsvp = true;
      this.showHelpText = 0;
      this.formSubmissionError = false;
      this.rsvp = result;
      this.setupConfirmRsvp(result);
    }, error => {
      this.validRsvp = true;
      this.formSubmissionError = true;
      this.showHelpText++;
    });
  }

  setupConfirmRsvp(result) {
    this.confirmRsvp = this.fb.group({
      rsvpID: result.rsvpID,
      attending: [result.attending, Validators.required],
      numberOfGuests: result.numberOfGuests,
      bringingGuest: (result.attending && result.guests && result.guests.length > 0 ? true : false)
    });

    if (result.attending && result.guests && result.guests.length > 0) {
      this.initGuests(result.guests);
    }
  }

  initGuests(guests) {
    this.confirmRsvp.addControl('guests', this.fb.array([]));
    const control = <FormArray>this.confirmRsvp.controls['guests'];

    for (let x of guests) {
      control.push(this.fb.group({
        first: [x.first, Validators.required],
        last: [x.last, Validators.required]
      })
      )
    }
  }

  updateBringingGuest() {
    if (this.confirmRsvp.controls['bringingGuest'].value) {
      this.confirmRsvp.addControl('guests', this.fb.array([]));
      this.addGuest();
    } else {
      this.confirmRsvp.removeControl('guests');
    }
  }

  addGuest() {
    const control = <FormArray>this.confirmRsvp.controls['guests'];

    control.push(this.fb.group({
      first: ['', Validators.required],
      last: ['', Validators.required]
    })
    )
  }

  removeGuest(index) {
    const control = <FormArray>this.confirmRsvp.controls['guests'];
    control.removeAt(index);
  }

  confirmRSVP() {
    this.http.post('/api/RSVP', this.confirmRsvp.value).subscribe(result => {
      const accepted = this.confirmRsvp.controls['attending'].value;
      const dialogRef = this.dialog.open(accepted == true ? ReservationAcceptedComponent : ReservationDeclinedComponent);
      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate(['/counter']);
      })
    }, error => {
      this.success = false;
    });
  }
}
