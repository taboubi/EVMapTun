import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ev.chargemap.tun',
  appName: 'ev-charge-car',
  webDir: 'www',
  plugins: {
    AdMob: {
      appIdAndroid: 'ca-app-pub-7963319750770607~6481253029',
      appIdIos: 'ca-app-pub-7963319750770607~2681075984'
    }
  },
  cordova: {
    preferences: {
      'android.permission.ACCESS_FINE_LOCATION': 'true',
      'android.permission.ACCESS_COARSE_LOCATION': 'true',
      'NSLocationWhenInUseUsageDescription': 'Cette application a besoin de votre position pour afficher les stations à proximité.',
      'NSLocationAlwaysUsageDescription': 'Cette application a besoin d’un accès permanent à votre position pour certaines fonctionnalités.'
    }
  }
};

export default config;
