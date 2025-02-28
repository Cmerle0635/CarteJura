import { Component, Input, OnInit } from '@angular/core';
import { SetLayerService } from '../../services/set-layer.service';

@Component({
  selector: 'app-panel-info',
  imports: [],
  templateUrl: './panel-info.component.html',
  styleUrl: './panel-info.component.css'
})
export class PanelInfoComponent implements OnInit {

  @Input() 
  info: number | undefined;

  constructor(private LayerService: SetLayerService){};

  async ngOnInit(){
    console.log("Le number est : ", this.info?.toString());
    let data = await this.LayerService.getLayerNames();
    console.log(data);
  }

}
