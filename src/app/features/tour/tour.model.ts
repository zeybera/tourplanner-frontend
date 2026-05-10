
// Represents the available transport types
export type TransportType = | 'CAR' | 'BIKE' | 'WALKING' | 'RUNNING';

//I wonder what is the right way to handle request and response model in Angular. Should we always create 2 different model for get and post operations
//OPTION 1: Merge the types
//for example
//userId?: string; // <- optional, just in Request , roleName?: string; // <- optional, just in Response
//OPTION 2: Make different types, 2 interfaces

export interface TourRequest {

  name: string;

  description: string;

  fromLocation: string;

  toLocation: string;

  transportType: TransportType;
}

export interface TourResponse {

  id: number;

  name: string;

  description: string;

  fromLocation: string;

  toLocation: string;

  transportType: TransportType;

  // Retrieved from OpenRouteService API
  distance: number;

  // Retrieved from OpenRouteService API
  estimatedTime: number;

  // Graphical route information
  routeInformation: string;
}
