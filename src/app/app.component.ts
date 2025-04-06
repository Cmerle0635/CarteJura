import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogMapComponent } from './components/dialog-map/dialog-map.component';
import { DialogImageComponent } from './components/dialog-image/dialog-image.component';
import { SetLayerService } from './services/set-layer.service';
import { CarouselComponent } from './components/carousel/carousel.component';
import { ChartComponent } from './components/chart/chart.component'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CarouselComponent, ChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent implements OnInit {

  constructor(private dialogMap: MatDialog, private dialogImage: MatDialog, private LayerService: SetLayerService){}

  MaxID = 1;

  @ViewChild('element1') element1!: ElementRef;
  @ViewChild('element2') element2!: ElementRef;
  @ViewChild('element3') element3!: ElementRef;

  @HostListener('window:scroll', ['$event'])
  @HostListener('window:resize', ['$event'])

  images_carousel1 = [
    'assets/cartes/carte_pointeau.png',
    'assets/cartes/cartes_routes.png'
  ];
  images_carousel2 = [
    'assets/cartes/carte_temps.png',
    'assets/cartes/carte_occ.png',
    'assets/cartes/carte_temps_distance.png',
  ];

  onScrollOrResize() {

    const self = this;

    let Liste = [this.element1.nativeElement, this.element2.nativeElement, this.element3.nativeElement];
    Liste.forEach(function(elem){
      let Visible = self.isElementVisible(elem);
      if (Visible){
        self.MaxID = elem.getAttribute("id");
      }
    })
  }

  isElementVisible(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  openDialogMap() {
    this.dialogMap.open(DialogMapComponent, {
      panelClass: 'custom-dialog',
      width: '95vw',
      height: '95vh',
      maxHeight: '100vh',
      maxWidth: '100vw',
      data: { id_map: this.MaxID}
    });
  }

  openDialogImage(evt: any) {
    this.dialogImage.open(DialogImageComponent, {
      panelClass: 'custom-dialog',
      maxHeight: '100vh',
      maxWidth: '100vw',
      data: { source_image: evt.srcElement.currentSrc}
    });
  }

  title = 'cm635';

  async ngOnInit(){
    this.LayerService.setLayerJSON();
  }

}
