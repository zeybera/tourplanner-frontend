export enum TransportType {
  CAR = 'CAR',
  BIKE = 'BIKE',
  WALKING = 'WALKING',
}

// Data sent from frontend to backend when creating or updating a tour.
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

// Data returned from backend to frontend.
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
  distance: number | null;
  estimatedTime: number | null;
  routeInformation: string | null;
  popularity: string;
  childFriendliness: string;
}

// Existing components can continue importing "Tour".
export type Tour = TourResponse;
