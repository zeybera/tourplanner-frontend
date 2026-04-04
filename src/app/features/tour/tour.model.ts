export interface Tour {
  id: number;

  description: string;

  from: string;
  to: string;

  transportType: string;

routeInformation: string; 

  distance: number; //OpenRouteservice.org api
  time: number; //OpenRouteservice.org api

}