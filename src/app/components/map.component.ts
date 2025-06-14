import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef, OnChanges, SimpleChanges, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Station } from '../models/station.model';

declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() stations: Station[] = [];
  @Input() userLocation: { latitude: number; longitude: number } | null = null;
  @Input() mapZoom: number = 10; // Ajout du zoom en @Input
  @Output() stationSelected = new EventEmitter<Station>();
  @ViewChild('map', { static: false }) mapElement!: ElementRef;

  map: any;
  markers: any[] = [];
  mapInitialized = false;
  private initAttempts = 0;
  private maxInitAttempts = 3;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initMapWithRetry();
  }

  private initMapWithRetry() {
    if (this.initAttempts >= this.maxInitAttempts) {
      console.error('Failed to initialize map after multiple attempts');
      return;
    }

    if (!this.mapElement?.nativeElement) {
      this.initAttempts++;
      setTimeout(() => this.initMapWithRetry(), 100);
      return;
    }

    this.initMap();
  }

  initMap() {
    if (!this.mapElement?.nativeElement) {
      return;
    }

    const center = this.userLocation
      ? { lat: this.userLocation.latitude, lng: this.userLocation.longitude }
      : { lat: 36.7948829, lng: 10.1432776 };

    console.log('[MAP DEBUG] Création map avec zoom:', this.mapZoom, 'center:', center);

    // Clear existing map instance if it exists
    if (this.map) {
      this.clearMarkers();
      this.map = null;
    }

    // Create new map instance
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center,
      zoom: this.mapZoom, // Utilisation du zoom dynamique
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      gestureHandling: 'greedy',
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    this.mapInitialized = true;
    this.updateMap();
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.mapInitialized && (changes['stations'] || changes['userLocation'])) {
      this.updateMap();
      this.cdr.detectChanges();
    }
    if (this.mapInitialized && changes['mapZoom'] && !changes['mapZoom'].firstChange) {
      console.log('[MAP DEBUG] Changement dynamique de mapZoom:', changes['mapZoom'].currentValue);
      this.initMap();
    }
  }

  updateMap() {
    if (!this.map) return;
    const center = this.userLocation
      ? { lat: this.userLocation.latitude, lng: this.userLocation.longitude }
      : { lat: 36.7948829, lng: 10.1432776 };
    this.map.setCenter(center);
    this.clearMarkers();
    if (this.stations && this.stations.length > 0) {
      // Correction : vérifie que chaque station a bien latitude et longitude numériques
      const validStations = this.stations.filter(s =>
        typeof s.latitude === 'number' && typeof s.longitude === 'number' && !isNaN(s.latitude) && !isNaN(s.longitude)
      );
      console.log('MapComponent: valid stations to display:', validStations);
      validStations.forEach(station => {
        console.log('MapComponent: creating marker for', station);
        let marker;
        try {
          // SVG plug parfaitement centré dans le cercle vert
          const svgIcon = `data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 384 512'><circle cx='192' cy='256' r='192' fill='%2300c853'/><g transform='translate(105.6,140.8) scale(0.45)'><path d='M96 0C78.3 0 64 14.3 64 32l0 96 64 0 0-96c0-17.7-14.3-32-32-32zM288 0c-17.7 0-32 14.3-32 32l0 96 64 0 0-96c0-17.7-14.3-32-32-32zM32 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l0 32c0 77.4 55 142 128 156.8l0 67.2c0 17.7 14.3 32 32 32s32-14.3 32-32l0-67.2C297 398 352 333.4 352 256l0-32c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 160z' fill='white'/></g></svg>`;
          marker = new google.maps.Marker({
            position: { lat: station.latitude, lng: station.longitude },
            map: this.map,
            title: station.name,
            icon: {
              url: svgIcon,
              scaledSize: new google.maps.Size(64, 64),
              anchor: new google.maps.Point(32, 64)
            }
          });
          // Ajoute l'écouteur de clic pour afficher les détails
          marker.addListener('click', () => {
            this.stationSelected.emit(station);
          });
          this.markers.push(marker);
        } catch (e) {
          console.error('MapComponent: marker creation failed', e);
        }
      });
      if (validStations.length === 0) {
        // Ajoute un marqueur par défaut sur Tunis pour test visuel
        let marker;
        try {
          const svgIcon = `data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 384 512'><circle cx='192' cy='256' r='192' fill='%2300c853'/><g transform='translate(105.6,140.8) scale(0.45)'><path d='M96 0C78.3 0 64 14.3 64 32l0 96 64 0 0-96c0-17.7-14.3-32-32-32zM288 0c-17.7 0-32 14.3-32 32l0 96 64 0 0-96c0-17.7-14.3-32-32-32zM32 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l0 32c0 77.4 55 142 128 156.8l0 67.2c0 17.7 14.3 32 32 32s32-14.3 32-32l0-67.2C297 398 352 333.4 352 256l0-32c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 160z' fill='white'/></g></svg>`;
          marker = new google.maps.Marker({
            position: { lat: 36.7948829, lng: 10.1432776 },
            map: this.map,
            title: 'Test: Tunis',
            icon: {
              url: svgIcon,
              scaledSize: new google.maps.Size(64, 64),
              anchor: new google.maps.Point(32, 64)
            }
          });
          this.markers.push(marker);
        } catch (e) {
          console.error('MapComponent: default marker creation failed', e);
        }
        console.warn('MapComponent: all stations have invalid coordinates, default marker on Tunis added');
      }
    } else {
      console.log('MapComponent: no stations to display');
    }
  }

  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }
}
