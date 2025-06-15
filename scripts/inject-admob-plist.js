const fs = require('fs');
const path = require('path');

const plistPath = path.join(__dirname, '../ios/App/App/Info.plist');
const admobAppId = process.env.ADMOB_APP_ID_IOS || 'ca-app-pub-XXXXXXXXXX~YYYYYYYYYY'; // Remplace par ton App ID si besoin

if (fs.existsSync(plistPath)) {
  let plist = fs.readFileSync(plistPath, 'utf8');
  if (!plist.includes('GADApplicationIdentifier')) {
    // Ajoute la clé juste avant la balise de fermeture </dict>
    plist = plist.replace(
      /(<\/dict>)/,
      `  <key>GADApplicationIdentifier</key>\n  <string>${admobAppId}</string>\n$1`
    );
    fs.writeFileSync(plistPath, plist, 'utf8');
    console.log('AdMob App ID injected into Info.plist');
  } else {
    console.log('AdMob App ID already present in Info.plist');
  }
} else {
  console.error('Info.plist not found!');
}
