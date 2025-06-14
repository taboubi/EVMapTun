import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AdMob } from '@capacitor-community/admob';

@Injectable({ providedIn: 'root' })
export class AdsService {
  private interstitialId = environment.admobInterstitialId;

  async showInterstitialAd(): Promise<void> {
    try {
      await AdMob.prepareInterstitial({
        adId: this.interstitialId,
        isTesting: true,
      });
      await AdMob.showInterstitial();
    } catch (e) {
      console.warn('Erreur AdMob interstitiel', e);
    }
  }
}
