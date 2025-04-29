import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog'; // ✅ IMPORT DIRECTEMENT
import { PanelInfoComponent } from '../panel-info/panel-info.component';

@Component({
  selector: 'app-dialog-map',
  imports: [MapComponent, MatDialogModule, PanelInfoComponent],
  templateUrl: './dialog-map.component.html',
  styleUrl: './dialog-map.component.css',
  standalone: true,
})
export class DialogMapComponent implements AfterViewInit {
  @ViewChild(MapComponent) mapComponent!: MapComponent;// 🔥 Récupère MapComponent

  constructor(
    @Inject (MAT_DIALOG_DATA) public data: {id_map: number},
    public dialogRef: MatDialogRef<DialogMapComponent>
   ) {
     this.info = data.id_map;
   }

   public info: number = 0;

  ngAfterViewInit(): void {
    this.dialogRef.afterOpened().subscribe(() => {
      let Legend = document.getElementById("legend");
      let Logo = document.getElementById("fermer_logo");
      if (/Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent)){
        if(Legend){
          Legend.className += '_mob';
        }
        if(Logo){
          Logo.className += '_mob';
        }
      }
      this.mapComponent.initMap(this.info)
    });
  }

  closeDialog(evt: Event){
    this.dialogRef.close();
  }
}
