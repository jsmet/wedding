import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationAcceptedComponent } from './reservation-success.component';

describe('ReservationSuccessComponent', () => {
  let component: ReservationAcceptedComponent;
  let fixture: ComponentFixture<ReservationAcceptedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservationAcceptedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationAcceptedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
