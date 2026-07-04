import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TourService } from './tour.service';
import { TourResponse, TransportType } from './models/tour.model';

describe('TourService', () => {
  let service: TourService;
  let httpMock: HttpTestingController;

  const viennaTour: TourResponse = {
    id: 1,
    name: 'Vienna Walk',
    description: 'Short city walk',
    fromLocation: 'Stephansplatz',
    toLocation: 'Prater',
    transportType: TransportType.WALKING,
    fromLongitude: 16.3738,
    fromLatitude: 48.2082,
    toLongitude: 16.3959,
    toLatitude: 48.2167,
    fromFeatureJson: null,
    toFeatureJson: null,
    distance: 3.2,
    estimatedTime: 42,
    routeInformation: 'encoded-route',
    popularity: 'medium',
    childFriendliness: 'high',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TourService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(TourService);
    httpMock = TestBed.inject(HttpTestingController);

    // The service loads all tours immediately when it is created.
    httpMock.expectOne('http://localhost:8080/api/tours').flush([]);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Checks that tours loaded from the backend are stored in the tour signal.
  it('loads tours from the backend into the tour signal', () => {
    service.loadTours();

    const request = httpMock.expectOne('http://localhost:8080/api/tours');
    expect(request.request.method).toBe('GET');
    request.flush([viennaTour]);

    expect(service.tours()).toEqual([viennaTour]);
    expect(service.isLoading()).toBeFalse();
  });

  // Checks that creating a tour updates the local tour list after the backend responds.
  it('adds a created tour to the local tour list', () => {
    service.create({
      name: viennaTour.name,
      description: viennaTour.description,
      fromLocation: viennaTour.fromLocation,
      toLocation: viennaTour.toLocation,
      transportType: viennaTour.transportType,
      fromLongitude: viennaTour.fromLongitude,
      fromLatitude: viennaTour.fromLatitude,
      toLongitude: viennaTour.toLongitude,
      toLatitude: viennaTour.toLatitude,
      fromFeatureJson: null,
      toFeatureJson: null,
    }).subscribe(createdTour => {
      expect(createdTour).toEqual(viennaTour);
    });

    const request = httpMock.expectOne('http://localhost:8080/api/tours');
    expect(request.request.method).toBe('POST');
    request.flush(viennaTour);

    expect(service.tours()).toEqual([viennaTour]);
  });

  // Checks that deleting a selected tour removes it and clears the selection.
  it('removes a deleted tour and clears the selected tour', () => {
    service.loadTours();
    httpMock.expectOne('http://localhost:8080/api/tours').flush([viennaTour]);
    service.selectTour(1);

    service.delete(1);

    const request = httpMock.expectOne('http://localhost:8080/api/tours/1');
    expect(request.request.method).toBe('DELETE');
    request.flush(null);

    expect(service.tours()).toEqual([]);
    expect(service.selectedId()).toBeNull();
  });
});
