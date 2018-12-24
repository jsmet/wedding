
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { } from '@types/googlemaps';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.css']
})
export class VenueComponent implements OnInit {
  @ViewChild('gmap') gmapElement: ElementRef;
  map: google.maps.Map;
  marker: google.maps.Marker;

  constructor() { }

  ngOnInit() {
    var coordinates = { lat: 27.921613, lng: -82.488769}

    var mapProp = {
      center: coordinates,
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      clickableIcons: true
    };

    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

    var markerOptions = {
      position: coordinates,
      map: this.map,
      clickable: true,
      optimized: false,
      title: "Party here!",
      disableDefaultUI: true
    };

    this.marker = new google.maps.Marker(markerOptions);

    var contentString = '<h5>Tampa Federation Garden Clubs</h5>' +
    '<p>2629 Bayshore Blvd</p>' +
    '<p>Tampa, FL 33629</p>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString,
      position: coordinates
    });

    this.marker.addListener('click', function () {
      this.map.setCenter(coordinates);
      this.map.setZoom(17);
      infowindow.open(this.map, this.marker);
    });
  }
}
