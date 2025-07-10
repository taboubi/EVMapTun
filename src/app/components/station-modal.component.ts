import { Component, Input } from '@angular/core';
import { Station } from '../models/station.model';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
//import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMap, faMapLocation, faBolt, faPlug, faClock, faPhone, faTimes } from '@fortawesome/free-solid-svg-icons';
import { defineCustomElement } from '@ionic/core/components/ion-modal.js';

@Component({
  selector: 'app-station-modal',
  templateUrl: './station-modal.component.html',
  styleUrls: ['./station-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class StationModalComponent {
  @Input() station!: Station;
  faMap = faMap;
  faMapLocation = faMapLocation;
  faBolt = faBolt;
  faPlug = faPlug;
  faClock = faClock;
  faPhone = faPhone;
  faTimes = faTimes;

  constructor(private modalCtrl: ModalController) {
    defineCustomElement();
  }

  openDirections() {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${this.station.latitude},${this.station.longitude}`;
    window.open(url, '_blank');
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
