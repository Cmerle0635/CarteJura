import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogMapComponent } from './components/dialog-map/dialog-map.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private dialog: MatDialog){}

  MaxID = 1;

  @ViewChild('element1') element1!: ElementRef;
  @ViewChild('element2') element2!: ElementRef;

  @HostListener('window:scroll', ['$event'])
  @HostListener('window:resize', ['$event'])

  onScrollOrResize() {

    const self = this;

    let Liste = [this.element1.nativeElement, this.element2.nativeElement];
    Liste.forEach(function(elem){
      console.log(elem);
      let Visible = self.isElementVisible(elem);
      if (Visible){
        self.MaxID = elem.getAttribute("id");
      }
    })
    console.log(self.MaxID);
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

  openDialog() {
    this.dialog.open(DialogMapComponent, {
      panelClass: 'custom-dialog',
      width: '95vw',
      height: '95vh',
      maxHeight: '100vh',
      maxWidth: '100vw',
      data: { id_map: this.MaxID}
    });
  }

  title = 'cm635';

}
