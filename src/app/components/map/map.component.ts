import { Component, ElementRef, Input, OnInit } from '@angular/core';
import Map from 'ol/Map';
import {Tile as TileLayer} from 'ol/layer';
import {OSM} from 'ol/source.js';
import { ScaleLine, ZoomSlider } from 'ol/control';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styles: [':host { width: 100%; height: 100%; display: block; }',':host ::ng-deep .ol-overlaycontainer-stopevent { top: 5px; }', ':host ::ng-deep .ol-zoomslider { padding-top: 50px; }'],
})
export class MapComponent implements OnInit {

  constructor(private elementRef: ElementRef){}
  
  @Input()
  map!: Map;

  ngOnInit() {

    const MyMap = this.map;

    const OSMBasemap = new TileLayer({
      source: new OSM(),
    });

    MyMap.addLayer(OSMBasemap);
    MyMap.setTarget(this.elementRef.nativeElement);
    const zoomslider = new ZoomSlider();
    MyMap.addControl(zoomslider);

    const Scale = new ScaleLine({
      units: 'metric',
      minWidth: 100,
    })
    MyMap.addControl(Scale);
  }

  

}
