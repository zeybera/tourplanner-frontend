import * as L from 'leaflet';

export function decodePolyline(encoded: string): L.LatLng[] {
  const points: L.LatLng[] = [];
  let index = 0;
  let latitude = 0;
  let longitude = 0;

  while (index < encoded.length) {
    const latitudeChange = decodeNextValue(encoded, index);
    index = latitudeChange.nextIndex;
    latitude += latitudeChange.value;

    const longitudeChange = decodeNextValue(encoded, index);
    index = longitudeChange.nextIndex;
    longitude += longitudeChange.value;

    points.push(L.latLng(latitude / 100000, longitude / 100000));
  }

  return points;
}

function decodeNextValue(encoded: string, startIndex: number): { value: number; nextIndex: number } {
  let result = 0;
  let shift = 0;
  let byte: number;
  let index = startIndex;

  do {
    byte = encoded.charCodeAt(index++) - 63;
    result |= (byte & 0x1f) << shift;
    shift += 5;
  } while (byte >= 0x20);

  const value = result & 1 ? ~(result >> 1) : result >> 1;
  return { value, nextIndex: index };
}
