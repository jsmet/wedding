import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'rsvp-component',
  templateUrl: './rsvp.component.html'
})
export class RsvpComponent implements OnInit{
  rsvpForm: FormGroup;
  rsvpId: string;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.rsvpForm = this.fb.group({
      rsvpId: [ this.rsvpId, [Validators.required, Validators.maxLength(4)] ]
    });
  }

  fetchRSVP() {
    var test = this.rsvpId;
    test += " hi";
  }
}
