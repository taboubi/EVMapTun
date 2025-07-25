import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, doc, getDoc, docData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Station } from '../models/station.model';
import { NewStation } from '../models/newstation.model';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  constructor(private firestore: Firestore) {}

  getStations(): Observable<Station[]> {
    const stationsRef = collection(this.firestore, 'stations');
    return collectionData(stationsRef, { idField: 'id' }).pipe(
      tap(data => console.log('Firestore stations:', data))
    ) as unknown as Observable<Station[]>;
  }

  /**
   * Récupère les paramètres globaux (zoom, distance) depuis la collection paramstation (en temps réel)
   */
  getMapParams$(): Observable<{ zoom: number; distance: number }> {
    const paramRef = doc(this.firestore, 'paramstation', 'default');
    return docData(paramRef) as Observable<{ zoom: number; distance: number }>;
  }

  /**
   * Récupère les paramètres globaux (zoom, distance) depuis la collection paramstation
   */
  async getMapParams(): Promise<{ zoom: number; distance: number }> {
    const paramRef = doc(this.firestore, 'paramstation', 'default');
    const snap = await getDoc(paramRef);
    if (snap.exists()) {
      const data = snap.data() as any;
      return {
        zoom: typeof data.zoom === 'number' ? data.zoom : 10,
        distance: typeof data.distance === 'number' ? data.distance : 50
      };
    }
    return { zoom: 10, distance: 50 };
  }

  async addStation(station: NewStation): Promise<void> {
  const stationRef = collection(this.firestore, 'stationadd');
  await addDoc(stationRef, {
    ...station,
    createdAt: new Date()
  });
}
}
