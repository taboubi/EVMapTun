export interface NewStation {
  name: string;
  address: string;
  numberOfChargers: number;
  chargingPower: string[];
  connectorTypes: string[];
  createdAt?: Date;
}

