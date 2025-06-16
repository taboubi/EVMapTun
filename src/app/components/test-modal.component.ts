import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-test-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Test Modal</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div style="padding:2em;text-align:center;">Hello depuis le modal de test !</div>
    </ion-content>
  `,
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent]
})
export class TestModalComponent {}
