import { Component } from '@angular/core';

@Component({
  selector: 'app-test-modal',
  template: `<ion-header><ion-toolbar><ion-title>Test Modal</ion-title></ion-toolbar></ion-header><ion-content><div style="padding:2em;text-align:center;">Hello depuis le modal de test !</div></ion-content>`,
  standalone: true
})
export class TestModalComponent {}
