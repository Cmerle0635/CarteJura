import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogImageComponent } from '../dialog-image/dialog-image.component';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent {

  constructor(private dialogImage: MatDialog){}

  @Input()images: any[];
  
  currentIndex = 0;

  // Aller à l'image précédente
  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  // Aller à l'image suivante
  nextImage() {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    }
  }

  openDialogImage(evt: any) {
    this.dialogImage.open(DialogImageComponent, {
      panelClass: 'custom-dialog',
      maxHeight: '90vh',
      maxWidth: '90vw',
      data: { source_image: evt.srcElement.currentSrc}
    });
  }
}
