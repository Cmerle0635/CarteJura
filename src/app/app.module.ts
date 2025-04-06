import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { DialogMapComponent } from './components/dialog-map/dialog-map.component';
import { MapComponent } from './components/map/map.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { PanelInfoComponent } from './components/panel-info/panel-info.component';
import { SetLayerService } from './services/set-layer.service';
import { DialogImageComponent } from './components/dialog-image/dialog-image.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { ChartComponent } from './components/chart/chart.component';
import { NgApexchartsModule } from "ng-apexcharts";

@NgModule({
  declarations: [
    AppComponent, 
    DialogMapComponent,
    DialogImageComponent, 
    PanelInfoComponent,
    MapComponent,
    CarouselComponent,
    ChartComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgApexchartsModule,
  ],
  providers: [SetLayerService],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule {}
