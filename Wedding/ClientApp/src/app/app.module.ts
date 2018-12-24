import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {
  MatSelectModule,
  MatInputModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatCardModule,
  MatCheckboxModule,
  MatRadioModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { RsvpComponent } from './rsvp/rsvp.component';
import { ReservationAcceptedComponent } from './rsvp/dialogs/reservation-accepted/reservation-success.component';
import { ReservationDeclinedComponent } from './rsvp/dialogs/reservation-declined/reservation-declined.component';
import { VenueComponent } from './venue/venue.component';
import { PhotosComponent } from './photos/photos.component';
import { ScheduleComponent } from './schedule/schedule.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    RsvpComponent,
    ReservationAcceptedComponent,
    ReservationDeclinedComponent,
    VenueComponent,
    PhotosComponent,
    ScheduleComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: 'photos', component: PhotosComponent },
      { path: 'venue', component: VenueComponent },
      { path: 'rsvp', component: RsvpComponent },
      { path: 'schedule', component: ScheduleComponent },
      { path: '**', component: HomeComponent }
    ])
  ],
  entryComponents: [
    ReservationAcceptedComponent,
    ReservationDeclinedComponent
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
