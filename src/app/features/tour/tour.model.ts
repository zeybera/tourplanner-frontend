
// Represents the available transport types
export enum TransportType {
  CAR = 'CAR',
  BIKE = 'BIKE',
  WALKING = 'WALKING',
}
//I wonder what is the right way to handle request and response model in Angular. Should we always create 2 different model for get and post operations
//OPTION 1: Merge the types
//for example
//userId?: string; // <- optional, just in Request , roleName?: string; // <- optional, just in Response
//OPTION 2: Make different types, 2 interfaces

// Data sent from frontend to backend when creating a tour
export interface TourRequest {

  name: string;

  description: string;

  fromLocation: string;

  toLocation: string;

  transportType: TransportType;
  routeInformation: string;
  distance: number;
  estimatedTime: number;
  
}

// Data returned from backend to frontend
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


// Existing components can continue importing "Tour".
export type Tour = TourResponse;