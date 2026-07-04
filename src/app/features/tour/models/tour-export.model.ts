import { TransportType } from './tour.model';

// Data stored in exported tour JSON files.
export interface TourLogExport {
  date: string;
  comment: string;
  difficulty: number;
  rating: number;
  totalDistance: number;
  totalTime: number;
}

export interface TourExport {
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
  logs: TourLogExport[];
}
