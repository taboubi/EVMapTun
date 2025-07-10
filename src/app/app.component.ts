import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})

export class AppComponent {
  constructor(private platform: Platform) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.forceLightTheme();
      this.configureStatusBar();
    });
  }

  forceLightTheme() {
    // Supprime tout thème sombre actif
    document.body.classList.remove('dark');
    document.body.setAttribute('color-theme', 'light');
  }

  async configureStatusBar() {
    try {
      // Ne pas superposer la WebView
      await StatusBar.setOverlaysWebView({ overlay: false });

      // Couleur de fond blanche
      await StatusBar.setBackgroundColor({ color: '#ffffff' });

      // Texte de status bar en noir
      await StatusBar.setStyle({ style: Style.Dark });

      // (optionnel) Forcer l’affichage si elle est masquée
      await StatusBar.show();
    } catch (error) {
      console.error('Erreur lors du réglage de la status bar :', error);
    }
  }
}