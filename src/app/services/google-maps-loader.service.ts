import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GoogleMapsLoaderService {
  private apiLoaded = false;
  private loadPromise: Promise<void> | null = null;

  load(): Promise<void> {
    if (this.apiLoaded) {
      return Promise.resolve();
    }
    if (this.loadPromise) {
      return this.loadPromise;
    }
    this.loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.apiLoaded = true;
        resolve();
      };
      script.onerror = (err) => reject(err);
      document.head.appendChild(script);
    });
    return this.loadPromise;
  }
}
