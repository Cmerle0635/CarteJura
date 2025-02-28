import { Component, ElementRef, AfterViewInit, Input } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import ZoomSlider from 'ol/control/ZoomSlider';
import ScaleLine from 'ol/control/ScaleLine';
import {register} from 'ol/proj/proj4';
import proj4 from 'proj4';
import { SetLayerService } from '../../services/set-layer.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

  private map!: Map;

  constructor(private elementRef: ElementRef, private LayerService: SetLayerService) {}

  async initMap(info: number): Promise<void> {

    console.log("Le layer est : " + info);

    let MyMap = this.map;

    if (MyMap){
      MyMap.updateSize();
      return;
    }

    proj4.defs(
      'EPSG:2154',
      '+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    );

    register(proj4);

    MyMap = new Map({
      view: new View({
        projection: 'EPSG:2154',
        center: [935000, 6603000],
        zoom: 12,
      }),
    });

    const OSMBasemap = new TileLayer({
      source: new OSM(),
    });

    MyMap.addLayer(OSMBasemap);

    let data = await this.LayerService.readForStyle(info);
    console.log(data);

    data.forEach(value =>{
      console.log(value);
      MyMap.addLayer(value);
    })

    MyMap.setTarget(this.elementRef.nativeElement);
    const zoomslider = new ZoomSlider();
    MyMap.addControl(zoomslider);

    const Scale = new ScaleLine({
      units: 'metric',
      minWidth: 100,
    })
    MyMap.addControl(Scale);

    // ⚠️ Forcer OpenLayers à recalculer la taille
    setTimeout(() => {
      MyMap.updateSize();
    }, 300);

  }
}

