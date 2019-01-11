
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {

  folderNames: string[];
  imageUrls: string[];
  imageIndex: 0;

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.getFolderNames();
  }

  getFolderNames () {
    this.http.get<string[]>(`/api/Photo`).subscribe(result => {
      this.folderNames = result;
    }, error => {
      var testing = error;
    });
  }

  getFolderImages(folder: string) {
    this.http.get<string[]>(`/api/Photo/${folder}`).subscribe(result => {
      this.imageIndex = 0;
      this.imageUrls = result;
    }, error => {
      // fuck
    });
  }
}
