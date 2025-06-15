const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '../android/app/src/main/AndroidManifest.xml');
const admobAppId = process.env.ADMOB_APP_ID_ANDROID || 'ca-app-pub-XXXXXXXXXX~YYYYYYYYYY'; // Remplace par ton App ID si besoin

if (fs.existsSync(manifestPath)) {
  let manifest = fs.readFileSync(manifestPath, 'utf8');
  if (!manifest.includes('com.google.android.gms.ads.APPLICATION_ID')) {
    manifest = manifest.replace(
      /(<application[\s\S]*?>)/,
      `$1\n        <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="${admobAppId}"/>`
    );
    fs.writeFileSync(manifestPath, manifest, 'utf8');
    console.log('AdMob App ID injected into AndroidManifest.xml');
  } else {
    console.log('AdMob App ID already present in AndroidManifest.xml');
  }
} else {
  console.error('AndroidManifest.xml not found!');
}
