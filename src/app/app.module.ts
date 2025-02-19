import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogMapComponent } from './components/dialog-map/dialog-map.component';
import { MapComponent } from './components/map/map.component';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent, 
    DialogMapComponent, 
    MapComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [
    AppComponent,
    MapComponent
  ],
})
export class AppModule {}
