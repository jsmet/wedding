
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RSVP } from './rsvp';
import { ConfirmRsvp } from './confirmRsvp';
import { validateConfig } from '@angular/router/src/config';

@Component({
  selector: 'rsvp-component',
  templateUrl: './rsvp.component.html'
})
export class RsvpComponent implements OnInit{
  rsvpForm: FormGroup;
  rsvpId: string;
  formSubmissionError: boolean;
  validRsvpForm: RSVP;
  numberOfAllowedGuests: number[];
  confirmRsvp: FormGroup;
  testing: string;
  success: boolean;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient    
  ) { }

  ngOnInit() {
    this.rsvpForm = this.fb.group({
      rsvpId: [ this.rsvpId ]
    });

    this.formSubmissionError = false;
  }

  fetchRSVP() {
    this.http.get<RSVP>(`/api/RSVP?id=${this.rsvpId}`).subscribe(result => {
      this.formSubmissionError = false;
      this.numberOfAllowedGuests = Array(result.numberOfGuests);
      this.validRsvpForm = result;
      this.setupConfirmRsvp();
    }, error => {
      this.validRsvpForm = null;
      this.formSubmissionError = true;
    });
  }

  setupConfirmRsvp() {
    this.confirmRsvp = this.fb.group({
      id: this.validRsvpForm.id,
      attending: [null, Validators.required],
      guests: this.fb.array([])
    });

    this.initGuests(this.validRsvpForm.numberOfGuests);
  }

  initGuests(numberOfGuests) {
    const control = <FormArray>this.confirmRsvp.controls['guests'];

    for (var x = 0; x < numberOfGuests; x++) {
      control.push( this.fb.group({
                      first: ['', Validators.required],
                      last: ['', Validators.required]
        })
      );
    }    
  }

  confirmRSVP() {
    this.http.post('/api/RSVP', this.confirmRsvp.value).subscribe(result => {
      this.success = true;
    }, error => {
      this.success = false;
    });
  }
}
