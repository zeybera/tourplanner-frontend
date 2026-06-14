
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

  fromLongitude: number | null;
  fromLatitude: number | null;
  toLongitude: number | null;
  toLatitude: number | null;
  fromFeatureJson: string | null;
  toFeatureJson: string | null;
}

// Data returned from backend to frontend
export interface TourResponse {

  id: number;

  name: string;

  description: string;

  fromLocation: string;

  toLocation: string;

  transportType: TransportType;

  fromLongitude: number | null;

  fromLatitude: number | null;

  toLongitude: number | null;

  toLatitude: number | null;

  fromFeatureJson: string | null;

  toFeatureJson: string | null;

  // Retrieved from OpenRouteService API
  distance: number | null;

  // Retrieved from OpenRouteService API
  estimatedTime: number | null;

  // Graphical route information
  routeInformation: string | null;

  // "Popular" or "Not Popular" - calculated from number of logs
  popularity: string;

  // "Child Friendly" or "Not Child Friendly" - calculated from log data
  childFriendliness: string;
}


// Existing components can continue importing "Tour".
export type Tour = TourResponse;
