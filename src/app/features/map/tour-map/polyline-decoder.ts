import * as L from 'leaflet';

// OpenRouteService does not return coordinates as a simple list.
// It returns the route as a special encoded string called "encoded polyline".
// This function converts that encoded string into a list of Leaflet LatLng points
// so we can draw the route line on the map.
export function decodePolyline(encoded: string): L.LatLng[] {
  if (!encoded) return [];

  const points: L.LatLng[] = [];
  let index = 0;
  let latitude = 0;
  let longitude = 0;

  // We read the encoded string character by character
  // Each pair of values gives us one coordinate point (latitude + longitude)
  while (index < encoded.length) {
    const latResult = decodeValue(encoded, index);
    index = latResult.nextIndex;
    latitude += latResult.value;

    const lngResult = decodeValue(encoded, index);
    index = lngResult.nextIndex;
    longitude += lngResult.value;

    // Divide by 100000 because OpenRouteService stores coordinates multiplied by 100000
    // For example 4820000 means 48.2 degrees
    points.push(L.latLng(latitude / 100000, longitude / 100000));
  }

  return points;
}

// Reads one encoded number from the string starting at startIndex
// Returns the decoded number and the next position in the string
function decodeValue(encoded: string, startIndex: number): { value: number; nextIndex: number } {
  let result = 0;
  let shift = 0;
  let byte: number;
  let index = startIndex;

  // This loop reads bits from the encoded string until it finds the last chunk
  do {
    byte = encoded.charCodeAt(index++) - 63;
    result |= (byte & 0x1f) << shift;
    shift += 5;
  } while (byte >= 0x20);

  // Convert from unsigned to signed number (negative coordinates like -10.5 also need to work)
  const value = result & 1 ? ~(result >> 1) : result >> 1;
  return { value, nextIndex: index };
}
