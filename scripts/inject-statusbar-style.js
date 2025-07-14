const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, '../android/app/src/main/res/values/styles.xml');
const manifestPath = path.join(__dirname, '../android/app/src/main/AndroidManifest.xml');
const colorHex = '#d2392f';

// Injection de la couleur de la barre d'état dans styles.xml
if (fs.existsSync(stylesPath)) {
  let styles = fs.readFileSync(stylesPath, 'utf8');
  // Ajoute ou remplace la ligne <item name="android:statusBarColor">
  if (styles.includes('android:statusBarColor')) {
    styles = styles.replace(
      /(<item name="android:statusBarColor">)[^<]*(<\/item>)/,
      `$1${colorHex}$2`
    );
  } else {
    styles = styles.replace(
      /(<style name="AppTheme"[\s\S]*?>)/,
      `$1\n    <item name="android:statusBarColor">${colorHex}</item>`
    );
  }
  fs.writeFileSync(stylesPath, styles, 'utf8');
  console.log('Status bar color injected into styles.xml');
} else {
  console.error('styles.xml not found!');
}

// Ajout des permissions de localisation dans AndroidManifest.xml
if (fs.existsSync(manifestPath)) {
  let manifest = fs.readFileSync(manifestPath, 'utf8');
  let changed = false;

  if (!manifest.includes('android.permission.ACCESS_FINE_LOCATION')) {
    manifest = manifest.replace(
      /(<manifest[\s\S]*?>)/,
      `$1\n    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />`
    );
    changed = true;
  }
  if (!manifest.includes('android.permission.ACCESS_COARSE_LOCATION')) {
    manifest = manifest.replace(
      /(<manifest[\s\S]*?>)/,
      `$1\n    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />`
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(manifestPath, manifest, 'utf8');
    console.log('Location permissions injected into AndroidManifest.xml');
  } else {
    console.log('Location permissions already present in AndroidManifest.xml');
  }
} else {
  console.error('AndroidManifest.xml not found!');
}

const infoPlistPath = path.join(__dirname, '../ios/App/App/Info.plist');

if (fs.existsSync(infoPlistPath)) {
  let plist = fs.readFileSync(infoPlistPath, 'utf8');
  let changed = false;

  if (!plist.includes('NSLocationWhenInUseUsageDescription')) {
    plist = plist.replace(
      /(<dict>)/,
      `$1\n\t<key>NSLocationWhenInUseUsageDescription</key>\n\t<string>Cette application a besoin de votre position pour afficher les stations à proximité.</string>`
    );
    changed = true;
  }
  if (!plist.includes('NSLocationAlwaysAndWhenInUseUsageDescription')) {
    plist = plist.replace(
      /(<dict>)/,
      `$1\n\t<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>\n\t<string>Cette application utilise votre position pour améliorer l’expérience utilisateur.</string>`
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(infoPlistPath, plist, 'utf8');
    console.log('Location permissions injected into Info.plist');
  } else {
    console.log('Location permissions already present in Info.plist');
  }
} else {
  console.error('Info.plist not found!');
}
