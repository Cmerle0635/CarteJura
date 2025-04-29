import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild, AfterViewInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogMapComponent } from './components/dialog-map/dialog-map.component';
import { DialogImageComponent } from './components/dialog-image/dialog-image.component';
import { SetLayerService } from './services/set-layer.service';
import { CarouselComponent } from './components/carousel/carousel.component';
import { ChartComponent } from './components/chart/chart.component'
import { GetInfoService } from './services/get-info.service';
import { RoutesInfoInterface } from './interfaces/routes';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { TableComponent } from './components/table/table.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CarouselComponent, ChartComponent, NgIf, HeaderComponent, TableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent implements OnInit, AfterViewInit {

  constructor(
    private dialogMap: MatDialog, 
    private dialogImage: MatDialog, 
    private LayerService: SetLayerService, 
    private GIService: GetInfoService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdRef: ChangeDetectorRef
  ){
  }

  MaxID = 1;
  data: any;
  mobile: boolean = true;
  RoutesInfo: RoutesInfoInterface = {} as RoutesInfoInterface;

  @ViewChild('element1') element1!: ElementRef;
  @ViewChild('element2') element2!: ElementRef;
  @ViewChild('element3') element3!: ElementRef;
  @ViewChild('element4') element4!: ElementRef;

  dataLoaded: boolean = false;

  images_carousel1 = [
    'assets/cartes/carte_pointeau.jpg',
    'assets/cartes/cartes_routes.jpg'
  ];
  images_carousel2 = [
    'assets/cartes/carte_temps.jpg',
    'assets/cartes/carte_occ.jpg',
    'assets/cartes/carte_temps_distance.jpg',
    'assets/cartes/carte_voronoi_points.jpg'
  ];

  onScrollOrResize() {
    
    let Liste = [this.element1.nativeElement, this.element2.nativeElement, this.element3.nativeElement, this.element4.nativeElement];
    
    Liste.forEach((elem) => { // Fonction fléchée pour garder "this"
      let Visible = this.isElementVisible(elem);
      if (Visible) {
        this.MaxID = elem.getAttribute("id");
      }
    });
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

  openDialogMapForHeatMap(){
    this.MaxID = 8;
    this.openDialogMap();
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
    if (!/Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent)){
      this.dialogImage.open(DialogImageComponent, {
        panelClass: 'custom-dialog',
        maxHeight: '100vh',
        maxWidth: '100vw',
        data: { source_image: evt.srcElement.currentSrc}
      });
    }
  }

  title = 'GeoByCM';

  detectDeviceAndApplyClass() {
    if (/Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent)){
      this.mobile = false;
      let ListeID = ["container", "content", "summary", "title"]
      ListeID.forEach((ID) => {
        let ElemID = document.getElementById(ID);
        if (ElemID){
          ElemID.setAttribute("class", "mobile");
        }
      })
      let button = document.getElementById("BtnCarte")
      if (button){
        button.setAttribute("class", "btn_mobile");
        console.log(button);
      }
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.detectDeviceAndApplyClass();
    }, 100); 
  }

  async ngOnInit() {

    if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      this.onScrollOrResize();
    });

    window.addEventListener('resize', () => {
      this.onScrollOrResize();
    });
  }
    if (isPlatformBrowser(this.platformId)) {
  
      // S'assurer que setLayerJSON() retourne une Promise (sinon ajoute async/await dans le service)
      try {
        await this.LayerService.setLayerJSON();
        this.RoutesInfo = await this.GIService.getRouteData();
        this.data = await firstValueFrom(this.GIService.ReadCSV());
        this.dataLoaded = true;
        this.cdRef.detectChanges(); // Force l'actualisation du DOM
      } catch (error) {
        console.log("Erreur lors du chargement des données :", error);
      }
    }
  }


}
