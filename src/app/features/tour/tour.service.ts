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

// Temporary local delete
delete(id: number): void {
  this._tours.update(tours =>
    tours.filter(tour => tour.id != id)
  );
}

// Temporary local update
update(updated: TourResponse): void {
  this._tours.update((tours) => {
    const newTours: TourResponse[] = [];

    for (let tour of tours) {
      if (tour.id == updated.id) {
        newTours.push(updated);
      } else {
        newTours.push(tour);
      }
    }
    return newTours;
  });
}

}

