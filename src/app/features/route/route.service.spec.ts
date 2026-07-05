import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RouteService } from './route.service';

describe('RouteService', () => {
  let service: RouteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RouteService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(RouteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Checks that geocoding sends the user's search text to the backend.
  it('sends a geocode request with the search text as query parameter', () => {
    service.geocode('Vienna').subscribe(results => {
      expect(results.length).toBe(1);
      expect(results[0].label).toBe('Vienna, Austria');
    });

    const request = httpMock.expectOne(req =>
      req.method === 'GET'
      && req.url === 'http://localhost:8080/api/routes/geocode'
      && req.params.get('text') === 'Vienna'
    );

    request.flush([
      {
        label: 'Vienna, Austria',
        name: 'Vienna',
        street: null,
        housenumber: null,
        neighbourhood: null,
        locality: 'Vienna',
        region: 'Vienna',
        country: 'Austria',
        coordinates: [16.37, 48.21],
        bbox: [16.2, 48.1, 16.5, 48.3],
      },
    ]);

    expect(service.isLoading()).toBeFalse();
    expect(service.errorMessage()).toBe('');
  });

  // Checks that the service stores a user-friendly error message after geocoding fails.
  it('sets an error message when geocoding fails', () => {
    service.geocode('Unknown place').subscribe({
      error: () => {
        expect(service.isLoading()).toBeFalse();
        expect(service.errorMessage()).toBe('Location search failed. Please try again.');
      },
    });

    const request = httpMock.expectOne('http://localhost:8080/api/routes/geocode?text=Unknown%20place');
    request.flush('Server error', { status: 500, statusText: 'Server Error' });
  });

  // Checks that route calculation sends coordinates and transport type to the backend.
  it('sends route calculation data to the backend', () => {
    service.calculateRoute(16.37, 48.21, 16.39, 48.22, 'CAR').subscribe(route => {
      expect(route.distance).toBe(2.4);
      expect(route.estimatedTime).toBe(8);
      expect(route.routeInformation).toBe('encoded-route');
    });

    const request = httpMock.expectOne('http://localhost:8080/api/routes/calculate');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      fromLongitude: 16.37,
      fromLatitude: 48.21,
      toLongitude: 16.39,
      toLatitude: 48.22,
      transportType: 'CAR',
    });

    request.flush({
      distance: 2.4,
      estimatedTime: 8,
      routeInformation: 'encoded-route',
    });
  });
});
