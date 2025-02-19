import { Component, OnInit } from '@angular/core';
import { MapComponent } from '../map/map.component';
import Map from 'ol/Map';
import View from 'ol/View';
import {register} from 'ol/proj/proj4';
import proj4 from 'proj4';

@Component({
  selector: 'app-dialog-map',
  imports: [MapComponent],
  templateUrl: './dialog-map.component.html',
  styleUrl: './dialog-map.component.css',
  standalone: true,
})
export class DialogMapComponent implements OnInit{

  map!: Map;

  ngOnInit(){

    const self = this;

    proj4.defs(
      'EPSG:2154',
      '+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    );

    register(proj4);    

    self.map = new Map({
      view: new View({
        projection: 'EPSG:2154',
        center: [836265.5, 6365636.03],
        zoom: 11,
      }),
    });
  }


}
