const fs = require('fs');
const path = require('path');

console.log('--- [set-env.js] Démarrage du script ---');

const apiKey = process.env.apiKey;
const authDomain = process.env.authDomain;
const projectId = process.env.projectId;
const storageBucket = process.env.storageBucket;
const messagingSenderId = process.env.messagingSenderId;
const appId = process.env.appId;
const googleMapsApiKey = process.env.googleMapsApiKey;
const measurementId = process.env.measurementId;
const admobInterstitialId = process.env.admobInterstitialId;

try {
  const filePath = path.join(__dirname, '../src/environments/environment.ts');

  const content = `
export const environment = {
  production: true,
  firebase: {
    apiKey: '${apiKey}',
    authDomain: '${authDomain}',
    projectId: '${projectId}',
    storageBucket: '${storageBucket}',
    messagingSenderId: '${messagingSenderId}',
    appId: '${appId}',
    measurementId: '${measurementId}'
  },
  googleMapsApiKey: '${googleMapsApiKey}',
  admobInterstitialId: '${admobInterstitialId}'
};
`;

  fs.writeFileSync(filePath, content);
  console.log('✅ environment.ts généré avec succès', content);
  console.log('✅ environment.ts généré avec succès');
} catch (err) {
  console.error('❌ Erreur dans set-env.js:', err);
  process.exit(1);
}