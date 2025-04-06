import { Component, Input, AfterViewInit } from '@angular/core';
import { SetLayerService } from '../../services/set-layer.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { InfoLayer } from '../../interfaces/info-layer';
import { NgFor, NgStyle, NgIf } from '@angular/common';
import { LegendInterface } from '../../interfaces/legend';
import { SVG } from '@svgdotjs/svg.js';
import { cp } from 'fs';
@Component({
  selector: 'app-panel-info',
  imports: [MatSelectModule, ReactiveFormsModule, NgFor, NgStyle, NgIf],
  templateUrl: './panel-info.component.html',
  styleUrl: './panel-info.component.css'
})
export class PanelInfoComponent implements AfterViewInit {

  @Input() 
  info: number | undefined;

  selected = new FormControl('1');

  data: LegendInterface[] = [];

  FieldForFilter: InfoLayer[] = [];

  constructor(private LayerService: SetLayerService){};

  ngAfterViewInit(){
    let TrueIndex = (this.info?? 1);
    TrueIndex -= 1;
    let data = this.LayerService.getLayerNames();
    this.selected.setValue(TrueIndex.toString());
    this.FieldForFilter = data;
    this.data = this.LayerService.getLegend(TrueIndex.toString());
    this.setLegend();
  }

  getLayerSelected(evt: any){
    console.log(evt);
    this.LayerService.changeLayers(evt);
    this.data = this.LayerService.getLegend(evt);
    this.setLegend();
  }

  setLegend(){
    this.data.forEach((item) => {
  
      if (item.hasSVG){
        console.log(item);
        const observer = new MutationObserver(() => {
          const dataContainer = document.getElementById(`svg-container-${item.id}`);
          if (dataContainer) {
            observer.disconnect();
            const svgContainer = document.getElementById(`svg-container-${item.id}`);
            if (svgContainer){
              console.log(getComputedStyle(svgContainer).display);
              if (item.typeSVG == "Line"){
                let draw = SVG().addTo(svgContainer).size(35,35)
                draw.rect(30, 30).move(2, 2).fill('transparent').stroke({color: "black", width: 0.2})
                let line = draw.line(5, 17, 28, 17)
                line.stroke({ color: item.strokeSVG, width: item.widthSVG})
              } else if (item.typeSVG == "Polygon"){
                let draw = SVG().addTo(svgContainer).size(35,35);
                let rect = draw.rect(30, 30).move(2, 2);
                console.log(item);
                if (item.fillSVG){
                  rect.fill(item.fillSVG);
                } else {
                  rect.fill("transparent");
                }
                if (item.linedashSVG){
                  rect.stroke({color: item.strokeSVG, width: item.widthSVG, dasharray: item.linedashSVG})
                } else if (item.strokeSVG){
                  rect.stroke({color: item.strokeSVG, width: item.widthSVG});
                }
              }
            }
          }
        });
     
        observer.observe(document.body, { childList: true, subtree: true });
      }
    })
  }

}
