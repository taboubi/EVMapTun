export interface Station {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  numberOfChargers: number;
  chargingPower: string[]; // devient un tableau de puissances
  connectorTypes: string[];
  isOperational: boolean;
  operatingHours?: string;
  phoneNumber?: string;
  network?: string;
}
