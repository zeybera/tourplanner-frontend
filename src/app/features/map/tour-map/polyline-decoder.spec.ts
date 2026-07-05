import { decodePolyline } from './polyline-decoder';

describe('decodePolyline', () => {
  // Checks that no map points are created when no route geometry is available.
  it('returns an empty list for an empty route string', () => {
    const result = decodePolyline('');

    expect(result).toEqual([]);
  });

  // Checks that an encoded route string is converted into Leaflet coordinates.
  it('decodes a known encoded polyline into latitude and longitude points', () => {
    const result = decodePolyline('_p~iF~ps|U_ulLnnqC_mqNvxq`@');

    expect(result.length).toBe(3);
    expect(result[0].lat).toBeCloseTo(38.5, 5);
    expect(result[0].lng).toBeCloseTo(-120.2, 5);
    expect(result[1].lat).toBeCloseTo(40.7, 5);
    expect(result[1].lng).toBeCloseTo(-120.95, 5);
    expect(result[2].lat).toBeCloseTo(43.252, 5);
    expect(result[2].lng).toBeCloseTo(-126.453, 5);
  });
});
