import { Injectable, signal, computed, inject } from '@angular/core';
import { TourResponse, TourRequest } from './tour.model';
import { HttpClient } from '@angular/common/http';
import { API } from '../../shared/api';

@Injectable({
  providedIn: 'root',
})

export class TourService {
   // Angular HTTP client
  private http = inject(HttpClient);

  // Backend endpoint
  private apiUrl =`${API.apiBaseUrl}/api/tours`;

  // Stores all tours returned from backend
  private _tours = signal<TourResponse[]>([]);
  // warum brauchen wir readonly signal? Components den State sehen, aber NICHT verändern könne
  // Component darf nur: this.service.tours() für lesen aufrufen, aber nicht this.service.tours.set() oder this.service.tours.update() 
  readonly tours = this._tours.asReadonly();

  // Shared selected tour state
  private _selectedId = signal<number | null>(null);
  readonly selectedId = this._selectedId.asReadonly();


  //TourService wird erzeugt, constructor wird ausgeführt, loadTours() wird aufgerufen
  //Der constructor wird ausgeführt, wenn das Objekt erstellt wird.
  constructor() {
    this.loadTours();
  }

  // GET /api/tours
  // Loads all tours from Spring Boot backend
  loadTours(): void {
    this.http
      .get<TourResponse[]>(this.apiUrl)
      .subscribe(data => {
        this._tours.set(data);
      });
  }

  // POST /api/tours
  // Sends TourRequest to backend
  // Receives TourResponse from backend
  create(tour: TourRequest): void {
    this.http
      .post<TourResponse>(this.apiUrl, tour)
      .subscribe(createdTour => {
        this._tours.update(tours => [
          ...tours,
          createdTour
        ]);
      });
  }

 // Stores selected tour ID
selectTour(id: number){
  this._selectedId.set(id);
}

//derived state
// Returns the currently selected tour based on the selected ID
selectedTour = computed(() => {
  const id = this.selectedId();
  if (id == null) {
    return null;
  }
  const tour = this._tours().find(tour => tour.id == id);
  if (tour == undefined) {
    return null;
  }
  return tour;
});

  // DELETE /api/tours/{id}
  delete(id: number): void {
    this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .subscribe(() => {
        this._tours.update(tours =>
          tours.filter(tour => tour.id != id)
        );

        if (this.selectedId() == id) {
          this._selectedId.set(null);
        }
      });
  }

  // PUT /api/tours/{id}
  update(updated: TourResponse): void {
    this.http
      .put<TourResponse>(`${this.apiUrl}/${updated.id}`, this.toRequest(updated))
      .subscribe(savedTour => {
        this._tours.update(tours =>
          tours.map(tour => tour.id == savedTour.id ? savedTour : tour)
        );
      });
  }

  private toRequest(tour: TourResponse): TourRequest {
    return {
      name: tour.name,
      description: tour.description,
      fromLocation: tour.fromLocation,
      toLocation: tour.toLocation,
      transportType: tour.transportType,
      routeInformation: tour.routeInformation,
      distance: tour.distance,
      estimatedTime: tour.estimatedTime,
    };
  }

}
