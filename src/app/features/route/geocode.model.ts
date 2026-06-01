export interface GeocodeFeature {
  label: string;
  name: string | null;
  street: string | null;
  housenumber: string | null;
  neighbourhood: string | null;
  locality: string | null;
  region: string | null;
  country: string | null;
  coordinates: number[];
  bbox: number[];
}
