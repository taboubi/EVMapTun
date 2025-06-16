import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class FilterModalComponent implements OnInit {
  @Input() connectorTypes: string[] = [];
  @Input() selectedTypes: string[] = [];
  @Input() minPower: number = 0;
  @Input() powerOptions: string[] = [];
  selectedPowersMap: { [power: string]: boolean } = {};
  @Input() selectedPowers: string[] = [];

  @Input() distanceOptions: number[] = [1, 5, 10, 25, 50, 100];
  @Input() selectedDistance: number = 1;
  @Input() defaultDistance: number = 1;

  constructor(private modalCtrl: ModalController) {
    console.log('[DEBUG] FilterModalComponent constructed');
  }

  ngOnInit() {
    if (this.selectedPowers && this.selectedPowers.length) {
      this.selectedPowers.forEach(p => this.selectedPowersMap[p] = true);
    }
    // Si aucune distance sélectionnée, on prend la valeur par défaut (Firestore)
    if (!this.selectedDistance) {
      this.selectedDistance = this.defaultDistance;
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  onPowerChange(power: string, checked: boolean) {
    this.selectedPowersMap[power] = checked;
  }

  applyFilters() {
    const selectedPowers = Object.keys(this.selectedPowersMap).filter(p => this.selectedPowersMap[p]);
    this.modalCtrl.dismiss({
      selectedTypes: this.selectedTypes,
      selectedPowers,
      selectedDistance: this.selectedDistance
    });
  }

  toggleType(type: string) {
    if (this.selectedTypes.includes(type)) {
      this.selectedTypes = this.selectedTypes.filter(t => t !== type);
    } else {
      this.selectedTypes = [...this.selectedTypes, type];
    }
  }
}
