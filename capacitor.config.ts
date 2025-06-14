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
  }
};

export default config;
