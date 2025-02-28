import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogMapComponent } from './components/dialog-map/dialog-map.component';
import { MapComponent } from './components/map/map.component';

import { AppComponent } from './app.component';
import { PanelInfoComponent } from './components/panel-info/panel-info.component';
import { SetLayerService } from './services/set-layer.service';

@NgModule({
  declarations: [
    AppComponent, 
    DialogMapComponent, 
    PanelInfoComponent,
    MapComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
  ],
  providers: [SetLayerService],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule {}
