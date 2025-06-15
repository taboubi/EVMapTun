const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, '../android/app/src/main/res/values/styles.xml');
const colorHex = '#d2392f';

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
