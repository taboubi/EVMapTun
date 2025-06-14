import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AdMob } from '@capacitor-community/admob';
import { Platform } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class AdsService {
  constructor(private platform: Platform) {}

  private getInterstitialId(): string {
    if (this.platform.is('android')) {
      return environment.admobInterstitialIdAndroid;
    } else if (this.platform.is('ios')) {
      return environment.admobInterstitialIdIos;
    }
    return '';
  }

  async showInterstitialAd(): Promise<void> {
    const adId = this.getInterstitialId();
    try {
      await AdMob.prepareInterstitial({
        adId,
        isTesting: true,
      });
      await AdMob.showInterstitial();
    } catch (e) {
      console.warn('Erreur AdMob interstitiel', e);
    }
  }
}
