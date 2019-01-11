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
import 'hammerjs';
import { ImageViewerModule } from "ngx-image-viewer";

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
    ImageViewerModule.forRoot({
      btnClass: 'default', // The CSS class(es) that will apply to the buttons
      zoomFactor: 0.1, // The amount that the scale will be increased by
      containerBackgroundColor: '#ffff', // The color to use for the background. This can provided in hex, or rgb(a).
      wheelZoom: false, // If true, the mouse wheel can be used to zoom in
      allowFullscreen: true, // If true, the fullscreen button will be shown, allowing the user to entr fullscreen mode
      allowKeyboardNavigation: true, // If true, the left / right arrow keys can be used for navigation
      btnIcons: { // The icon classes that will apply to the buttons. By default, font-awesome is used.
        zoomIn: 'fa fa-plus',
        zoomOut: 'fa fa-minus',
        rotateClockwise: 'fa fa-repeat',
        rotateCounterClockwise: 'fa fa-undo',
        next: 'fa fa-arrow-right',
        prev: 'fa fa-arrow-left',
        fullscreen: 'fa fa-arrows-alt',
      },
      btnShow: {
        zoomIn: false,
        zoomOut: false,
        rotateClockwise: true,
        rotateCounterClockwise: true,
        next: true,
        prev: true
      }
    }),
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
