
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RSVP } from './rsvp';
import { ConfirmRsvp } from './confirmRsvp';
import { validateConfig } from '@angular/router/src/config';

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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.rsvpForm = this.fb.group({
      rsvpId: [this.rsvpId]
    });

    this.formSubmissionError = false;
    this.success = false;
  }

  fetchRSVP() {
    this.http.get<RSVP>(`/api/RSVP?id=${this.rsvpId}`).subscribe(result => {
      this.formSubmissionError = false;
      this.rsvp = result;
      this.setupConfirmRsvp(result);
    }, error => {      
      this.formSubmissionError = true;
    });
  }

  setupConfirmRsvp(result) {
    this.confirmRsvp = this.fb.group({
      id: result.id,
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
      this.success = true;
    }, error => {
      this.success = false;
    });
  }
}
