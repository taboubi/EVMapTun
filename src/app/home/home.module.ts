import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { MapComponent } from '../components/map.component';
import { StationModalComponent } from '../components/station-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [HomePage, MapComponent, StationModalComponent]
})
export class HomePageModule {}