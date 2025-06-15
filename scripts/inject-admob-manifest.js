const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '../android/app/src/main/AndroidManifest.xml');
const admobAppId = process.env.ADMOB_APP_ID_ANDROID || 'ca-app-pub-XXXXXXXXXX~YYYYYYYYYY'; // Remplace par ton App ID si besoin

console.log('--- [inject-admob-manifest.js] ---');
console.log('Manifest path:', manifestPath);
console.log('AdMob App ID:', admobAppId);

if (fs.existsSync(manifestPath)) {
  let manifest = fs.readFileSync(manifestPath, 'utf8');
  if (manifest.includes('com.google.android.gms.ads.APPLICATION_ID')) {
    // Remplace la valeur existante si déjà présente
    manifest = manifest.replace(
      /(<meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value=")[^"]*("\/>)/,
      `$1${admobAppId}$2`
    );
    console.log('AdMob App ID updated in AndroidManifest.xml');
  } else {
    manifest = manifest.replace(
      /(<application[\s\S]*?>)/,
      `$1\n        <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="${admobAppId}"/>`
    );
    console.log('AdMob App ID injected into AndroidManifest.xml');
  }
  fs.writeFileSync(manifestPath, manifest, 'utf8');
} else {
  console.error('AndroidManifest.xml not found at', manifestPath);
}
