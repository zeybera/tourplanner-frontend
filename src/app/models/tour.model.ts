import { Location } from './location.model';

export interface Tour {
  id: number;
  name: string;
  from: Location;
  to: Location;
  transportType: string;
  distance: number;
  estimatedTime: number;
}
