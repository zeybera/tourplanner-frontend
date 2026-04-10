export type TransportType = 'bike' | 'hike' | 'run';

export interface Tour {
  id: number;

  description: string;

  from: string;
  to: string;

  transportType: TransportType;

  routeInformation: string;

  distance: number; //OpenRouteservice.org api
  time: number; //OpenRouteservice.org api
}
