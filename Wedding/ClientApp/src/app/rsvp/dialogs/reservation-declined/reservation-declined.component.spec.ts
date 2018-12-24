import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationDeclinedComponent } from './reservation-declined.component';

describe('ReservationDeniedComponent', () => {
  let component: ReservationDeclinedComponent;
  let fixture: ComponentFixture<ReservationDeclinedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservationDeclinedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationDeclinedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
