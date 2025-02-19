import { Component } from '@angular/core';
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

  openDialog() {
    this.dialog.open(DialogMapComponent, {
      panelClass: 'custom-dialog',
      width: '90vw',
      height: '90vh',
      maxWidth: 'none', // Supprime la contrainte par défaut
    });
  }

  title = 'cm635';
}
