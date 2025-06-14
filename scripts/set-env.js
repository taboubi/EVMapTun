const fs = require('fs');
const path = require('path');

console.log('--- [set-env.js] Démarrage du script ---');

try {
  const filePath = path.join(__dirname, '../src/environments/environment.ts');

  const content = `
export const environment = {
  production: true,
  firebase: {
    apiKey: '${process.env.apiKey}',
    authDomain: '${process.env.authDomain}',
    projectId: '${process.env.projectId}',
    storageBucket: '${process.env.storageBucket}',
    messagingSenderId: '${process.env.messagingSenderId}',
    appId: '${process.env.appId}',
    measurementId: '${process.env.measurementId}'
  },
  googleMapsApiKey: '${process.env.googleMapsApiKey}',
  admobInterstitialId: '${process.env.admobInterstitialId}'
};
`;

  fs.writeFileSync(filePath, content);
  console.log('✅ environment.ts généré avec succès');
} catch (err) {
  console.error('❌ Erreur dans set-env.js:', err);
  process.exit(1);
}