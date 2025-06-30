import { Component, OnInit, ViewChild } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardContent, IonIcon, IonFab, IonFabButton, IonFabList, IonSpinner, IonButton, IonSearchbar, IonButtons
} from '@ionic/angular/standalone';
import { FirebaseService } from '../services/firebase.service';
import { GeolocationService } from '../services/geolocation.service';
import { AdsService } from '../services/ads.service';
import { Station } from '../models/station.model';
import { StationModalComponent } from '../components/station-modal.component';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapComponent } from '../components/map.component';
import { FilterModalComponent } from '../components/filter-modal.component';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';
import { StatusBar, Style } from '@capacitor/status-bar';
import { TestModalComponent } from '../components/test-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardContent, IonIcon, IonFab, IonFabButton, IonFabList, IonSpinner, IonButton, IonSearchbar, IonButtons,
    MapComponent
    // FilterModalComponent n'est PAS nécessaire ici car il est utilisé dynamiquement via ModalController
  ]
})
export class HomePage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;

  stations: Station[] = [];
  nearbyStations: Station[] = [];
  userLocation: { latitude: number; longitude: number } | null = null;
  isLoading = true;
  searchAddress = '';
  searchingAddress = false;
  connectorTypes: string[] = ['Type 2', 'CCS', 'CHAdeMO', 'Type 1', 'Tesla'];
  powerOptions: string[] = [];
  distanceOptions: number[] = [1, 5, 10, 25, 50, 100];
  filterSelectedTypes: string[] = [];
  filterSelectedPowers: string[] = [];
  filterMinPower: number = 0;
  filterSelectedDistance: number | undefined = undefined;
  showList = false;
  displayedStations: Station[] = [];
  mapZoom: number = 10;
  nearbyDistance: number = 50;
  private mapParamsSub?: Subscription;

  constructor(
    private firebaseService: FirebaseService,
    private geolocationService: GeolocationService,
    private adsService: AdsService,
    private modalController: ModalController,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    // Force le thème clair sur toute l'application
    document.body.classList.remove('dark');
    document.body.classList.add('light');
    // Force la couleur de la status bar (Android)
    try {
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#d2392f' });
    } catch (e) {
      console.warn('StatusBar plugin not available:', e);
    }
    this.isLoading = true;
    this.mapParamsSub = this.firebaseService.getMapParams$().subscribe(params => {
      console.log('[HOME DEBUG] Params Firestore reçus:', params);
      if (params) {
        this.mapZoom = typeof params.zoom === 'number' ? params.zoom : 10;
        this.nearbyDistance = typeof params.distance === 'number' ? params.distance : 50;
        // Si aucun filtre de distance n'est appliqué (undefined), on initialise le filtre à la valeur Firestore
        if (typeof this.filterSelectedDistance !== 'number') {
          this.filterSelectedDistance = this.nearbyDistance;
        }
        this.filterNearbyStations();
        console.log('[HOME DEBUG] mapZoom appliqué:', this.mapZoom, 'nearbyDistance appliqué:', this.nearbyDistance);
      }
    });
    this.loadUserLocation();
    this.loadStations();
    setTimeout(() => {
      this.initializeContent();
    }, 100);
    this.isLoading = false;
  }

  ngOnDestroy() {
    if (this.mapParamsSub) this.mapParamsSub.unsubscribe();
  }

  private async initializeContent() {
    if (this.content) {
      await this.content.scrollToTop();
    }
  }

  async loadUserLocation() {
    this.userLocation = await this.geolocationService.getCurrentPosition();
  }

  loadStations() {
    this.isLoading = true;
    this.firebaseService.getStations().subscribe(stations => {
      console.log('STATIONS DEBUG:', stations);
      // Normalisation des puissances pour éviter les problèmes de casse/espaces
      const normalizePower = (p: string) => p.trim().toLowerCase();
      const allPowers: string[] = [];
      stations.forEach((s: Station) => {
        if (Array.isArray(s.chargingPower)) {

          allPowers.push(...s.chargingPower.filter(Boolean).map(normalizePower));
        }
      });
      // On garde les puissances originales pour l'affichage, mais on filtre les doublons sur la version normalisée
      const uniquePowersMap: { [norm: string]: string } = {};
      stations.forEach((s: Station) => {
        if (Array.isArray(s.chargingPower)) {
          s.chargingPower.forEach(p => {
            const norm = normalizePower(p);
            if (p && !uniquePowersMap[norm]) uniquePowersMap[norm] = p;
          });
        }
      });
      this.powerOptions = Object.values(uniquePowersMap).sort();
      this.stations = stations;
      this.filterNearbyStations();
      this.isLoading = false;
    });
  }

  filterNearbyStations() {
    if (!this.userLocation) {
      this.nearbyStations = this.stations;
      return;
    }
    // Utilise la distance dynamique du filtre si sélectionnée, sinon celle de Firestore
    const distance = typeof this.filterSelectedDistance === 'number' ? this.filterSelectedDistance : this.nearbyDistance;
    this.nearbyStations = this.stations.filter(station => {
      const dist = this.getDistance(
        this.userLocation!.latitude,
        this.userLocation!.longitude,
        station.latitude,
        station.longitude
      );
      return dist < distance;
    });
    console.log('[HOME DEBUG] Filtrage proximité avec distance =', distance);
  }

  getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    // Haversine formula
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async onStationSelected(station: Station) {
    // Affiche d'abord la pub AdMob interstitielle
    try {
      await this.adsService.showInterstitialAd();
    } catch (e) {
      console.warn('Erreur AdMob:', e);
    }
    // Puis ouvre le modal de détail de la station
    const modal = await this.modalController.create({
      component: StationModalComponent,
      componentProps: { station },
      cssClass: 'modal-wrapper',
      showBackdrop: false,
      backdropDismiss: false
    });
    await modal.present();
  }

  async refreshLocation() {
    this.isLoading = true;
    // Toujours recharger les paramètres Firestore avant de rafraîchir la localisation
    try {
      const params = await this.firebaseService.getMapParams();
      this.mapZoom = params.zoom;
      this.nearbyDistance = params.distance;
    } catch (e) {
      this.mapZoom = 10;
      this.nearbyDistance = 50;
    }
    await this.loadUserLocation();
    this.filterNearbyStations();
    this.isLoading = false;
  }

  searchByAddress() {
    if (!this.searchAddress || this.searchAddress.trim().length < 3) {
      alert('Veuillez saisir une adresse valide.');
      return;
    }
    this.searchingAddress = true;
    const apiKey = environment.googleMapsApiKey;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(this.searchAddress)}&region=tn&key=${apiKey}`;
    this.http.get<any>(url).subscribe(res => {
      this.searchingAddress = false;
      if (res.status === 'OK' && res.results.length > 0) {
        const loc = res.results[0].geometry.location;
        this.userLocation = { latitude: loc.lat, longitude: loc.lng };
        this.filterNearbyStations();
      } else {
        alert('Adresse non trouvée.');
      }
    }, err => {
      this.searchingAddress = false;
      alert('Erreur lors de la recherche d\'adresse.');
    });
  }

  async showFilterOptions() {
    console.log('[DEBUG] showFilterOptions called');
    try {
      console.log('[DEBUG] Creating filter modal...');
      const modal = await this.modalController.create({
        component: FilterModalComponent,
        componentProps: {
          connectorTypes: this.connectorTypes,
          selectedTypes: this.filterSelectedTypes,
          powerOptions: this.powerOptions,
          selectedPowers: this.filterSelectedPowers,
          distanceOptions: this.distanceOptions,
          selectedDistance: this.filterSelectedDistance,
          defaultDistance: this.nearbyDistance
        },
        cssClass: 'modal-wrapper',
        showBackdrop: false,
        backdropDismiss: false
      });
      console.log('[DEBUG] Modal created', modal);
      modal.onDidDismiss().then(result => {
        if (result.data) {
          this.filterSelectedTypes = result.data.selectedTypes || [];
          this.filterSelectedPowers = result.data.selectedPowers || [];
          this.filterSelectedDistance = result.data.selectedDistance || this.filterSelectedDistance;
          this.applyFilters();
        }
      });
      await modal.present();
      console.log('[DEBUG] Modal presented');
    } catch (err) {
      console.error('[ERROR] showFilterOptions failed', err);
    }
  }

  applyFilters() {
    const normalizePower = (p: string) => p.trim().toLowerCase();
    const selectedNormPowers = this.filterSelectedPowers.map(normalizePower);
    const allPowersSelected = this.powerOptions.length > 0 && this.filterSelectedPowers.length === this.powerOptions.length;

    // 1. Filtrage par type et puissance (pas de distance)
    const filteredStations = this.stations.filter(station => {
      const typeMatch = this.filterSelectedTypes.length === 0 ||
        (station.connectorTypes && station.connectorTypes.some(type => this.filterSelectedTypes.includes(type)));
      const stationPowers = station.chargingPower ? station.chargingPower.map(normalizePower) : [];
      const powerMatch = allPowersSelected ||
        selectedNormPowers.length === 0 ||
        stationPowers.some(power => selectedNormPowers.includes(power));
      return typeMatch && powerMatch;
    });

    // 2. Pour la carte et la card "à proximité" : on applique la distance
    // Toujours recharger la distance Firestore avant de filtrer
    // (optionnel, mais utile si on veut que le filtre soit dynamique)
    // Si besoin, décommenter la ligne suivante pour forcer la recharge :
    // await this.refreshMapParams();
    this.nearbyStations = filteredStations.filter(station => this.isStationNearby(station));

    // 3. Pour la liste sous la carte : toutes les stations filtrées (pas de distance)
    this.displayedStations = [...filteredStations];
  }

  /**
   * Retourne la liste des stations filtrées (hors proximité/distance)
   */
  getFilteredStationsList(): Station[] {
    const normalizePower = (p: string) => p.trim().toLowerCase();
    const selectedNormPowers = this.filterSelectedPowers.map(normalizePower);
    const allPowersSelected = this.powerOptions.length > 0 && this.filterSelectedPowers.length === this.powerOptions.length;
    return this.stations.filter(station => {
      const typeMatch = this.filterSelectedTypes.length === 0 ||
        (station.connectorTypes && station.connectorTypes.some(type => this.filterSelectedTypes.includes(type)));
      const stationPowers = station.chargingPower ? station.chargingPower.map(normalizePower) : [];
      const powerMatch = allPowersSelected ||
        selectedNormPowers.length === 0 ||
        stationPowers.some(power => selectedNormPowers.includes(power));
      return typeMatch && powerMatch;
    });
  }

  private get isShowingNearbyOnly(): boolean {
    return !this.showList || (this.showList && this.displayedStations === this.nearbyStations);
  }

  isStationNearby(station: Station) {
    if (!this.userLocation) return true;
    const distance = this.filterSelectedDistance || this.nearbyDistance;
    const dist = this.getDistance(
      this.userLocation.latitude,
      this.userLocation.longitude,
      station.latitude,
      station.longitude
    );
    return dist < distance;
  }

  getTotalStations() {
    // Affiche le total filtré si filtre actif, sinon le total général
    if (this.filterSelectedTypes.length > 0 || this.filterSelectedPowers.length > 0) {
      return this.nearbyStations.length;
    }
    return this.stations.length;
  }

  getFilteredStationsCount() {
    // Retourne le nombre de stations filtrées (hors proximité)
    const normalizePower = (p: string) => p.trim().toLowerCase();
    const selectedNormPowers = this.filterSelectedPowers.map(normalizePower);
    const allPowersSelected = this.powerOptions.length > 0 && this.filterSelectedPowers.length === this.powerOptions.length;
    return this.stations.filter(station => {
      const typeMatch = this.filterSelectedTypes.length === 0 ||
        (station.connectorTypes && station.connectorTypes.some(type => this.filterSelectedTypes.includes(type)));
      const stationPowers = station.chargingPower ? station.chargingPower.map(normalizePower) : [];
      const powerMatch = allPowersSelected ||
        selectedNormPowers.length === 0 ||
        stationPowers.some(power => selectedNormPowers.includes(power));
      return typeMatch && powerMatch;
    }).length;
  }

  showStationList(type: 'nearby' | 'all') {
    this.showList = true;
    if (type === 'all') {
      // Toujours afficher la liste filtrée (hors distance)
      this.displayedStations = this.getFilteredStationsList();
    } else {
      this.displayedStations = this.nearbyStations;
    }
  }

  // Pour fermer la liste si besoin (ajouter un bouton dans le template si souhaité)
  hideStationList() {
    this.showList = false;
  }

  showAllStations(event: Event) {
    event.stopPropagation();
    this.filterSelectedTypes = [];
    this.filterSelectedPowers = [];
    this.showList = true;
    this.displayedStations = this.stations;
    // nearbyStations n'est plus modifié ici
  }

  hasActiveFilters(): boolean {
    return (
      this.filterSelectedTypes.length > 0 ||
      this.filterSelectedPowers.length > 0 ||
      (typeof this.filterSelectedDistance === 'number' && this.filterSelectedDistance !== this.nearbyDistance)
    );
  }

  removeFilterType(type: string) {
    this.filterSelectedTypes = this.filterSelectedTypes.filter(t => t !== type);
    this.applyFilters();
  }

  removeFilterPower(power: string) {
    this.filterSelectedPowers = this.filterSelectedPowers.filter(p => p !== power);
    this.applyFilters();
  }

  removeFilterDistance() {
    this.filterSelectedDistance = this.nearbyDistance;
    this.applyFilters();
  }

  resetFilters() {
    this.filterSelectedTypes = [];
    this.filterSelectedPowers = [];
    this.filterSelectedDistance = undefined;
    this.applyFilters();
  }

  async openTestModal() {
    const modal = await this.modalController.create({
      component: TestModalComponent,
      cssClass: 'modal-wrapper',
      showBackdrop: false,
      backdropDismiss: false
    });
    await modal.present();
  }
}
