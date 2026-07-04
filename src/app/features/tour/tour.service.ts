import { Injectable, signal, computed, inject } from '@angular/core';
import { TourResponse, TourRequest } from './models/tour.model';
import { TourExport } from './models/tour-export.model';
import { HttpClient } from '@angular/common/http';
import { API } from '../../shared/api';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TourService {

  // Angular HTTP client for making requests to Spring Boot backend
  private http = inject(HttpClient);

  // Base URL for tour endpoints
  private apiUrl = `${API.apiBaseUrl}/api/tours`;

  // --- SIGNALS ---

  // Holds the list of all tours loaded from the backend
  private _tours = signal<TourResponse[]>([]);

  // Public read-only view of the tours list.
  // Components can read this with service.tours() but cannot call .set() on it.
  readonly tours = this._tours.asReadonly();

  // Holds the ID of the currently selected tour (or null if none selected)
  private _selectedId = signal<number | null>(null);
  readonly selectedId = this._selectedId.asReadonly();

  // Holds the current search query entered by the user (used for the input binding)
  private _searchQuery = signal<string>('');
  readonly searchQuery = this._searchQuery.asReadonly();

  // Holds the tours returned by the backend search endpoint.
  // null means no search has been run — show all tours instead.
  private _searchResults = signal<TourResponse[] | null>(null);

  // True while a backend request is in progress
  private _isLoading = signal<boolean>(false);
  readonly isLoading = this._isLoading.asReadonly();

  // Holds an error message if the last request failed
  private _errorMessage = signal<string>('');
  readonly errorMessage = this._errorMessage.asReadonly();

  // --- COMPUTED SIGNALS ---

  // Returns the TourResponse object for the currently selected ID.
  // Angular recomputes this automatically whenever _selectedId or _tours changes.
  selectedTour = computed(() => {
    const id = this._selectedId();

    if (id == null) {
      return null;
    }

    const allTours = this._tours();

    for (const tour of allTours) {
      if (tour.id == id) {
        return tour;
      }
    }

    return null;
  });

  // Returns the correct tour list to display in the UI.
  // If the user has run a backend search, returns those results.
  // Otherwise returns all tours loaded at startup.
  filteredTours = computed(() => {
    const searchResults = this._searchResults();

    if (searchResults !== null) {
      // A backend search has been run — show only its results
      return searchResults;
    }

    // No search active — show all tours
    return this._tours();
  });

  // On service creation, immediately load all tours from the backend
  constructor() {
    this.loadTours();
  }

  // --- METHODS ---

  // Sets the currently selected tour by ID
  selectTour(id: number): void {
    this._selectedId.set(id);
  }

  // Updates the query signal so the input stays in sync.
  // Also clears backend search results when the user erases the query.
  setSearchQuery(query: string): void {
    this._searchQuery.set(query);

    if (query.trim() == '') {
      // Query cleared — go back to showing all tours
      this._searchResults.set(null);
    }
  }

  // Calls the backend search endpoint and stores the results in _searchResults.
  // filteredTours will automatically display these results via its computed signal.
  searchTours(query: string): void {
    this._searchQuery.set(query);

    if (query.trim() == '') {
      // Empty query — reset to all tours, no backend call needed
      this._searchResults.set(null);
      return;
    }

    this._isLoading.set(true);
    this._errorMessage.set('');

    const url = this.apiUrl + '/search';

    this.http.get<TourResponse[]>(url, { params: { q: query } }).subscribe({
      next: (results: TourResponse[]) => {
        this._searchResults.set(results);
        this._isLoading.set(false);
      },
      error: (err) => {
        console.error('Error searching tours:', err);
        this._errorMessage.set('Search failed. Please try again.');
        this._isLoading.set(false);
      },
    });
  }

  // GET /api/tours
  // Fetches all tours and stores them in the _tours signal
  loadTours(): void {
    this._isLoading.set(true);
    this._errorMessage.set('');

    this.http.get<TourResponse[]>(this.apiUrl).subscribe({
      next: (data: TourResponse[]) => {
        this._tours.set(data);
        this._isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading tours:', err);
        this._errorMessage.set('Could not load tours. Is the backend running?');
        this._isLoading.set(false);
      },
    });
  }

  // POST /api/tours
  // Sends a new tour to the backend and adds the returned tour to the list.
  // Returns the Observable so the component can subscribe and navigate on success.
  create(tour: TourRequest): Observable<TourResponse> {
    // tap() lets us update the local signal WITHOUT stopping the observable chain.
    // The component still receives the createdTour in its own .subscribe() call.
    return this.http.post<TourResponse>(this.apiUrl, tour).pipe(
      tap((createdTour: TourResponse) => {
        // Add the new tour to the local list so the UI updates immediately
        const currentTours = this._tours();
        const updatedTours = [...currentTours, createdTour];
        this._tours.set(updatedTours);
      })
    );
  }

  // PUT /api/tours/{id}
  // Sends updated tour data to the backend and replaces the old entry in the local list.
  // Returns the Observable so the component can navigate after the request finishes.
  update(updated: TourResponse): Observable<TourResponse> {
    const url = this.apiUrl + '/' + updated.id;
    const requestBody = this.toRequest(updated);

    return this.http.put<TourResponse>(url, requestBody).pipe(
      tap((savedTour: TourResponse) => {
        // Replace the old tour in the list with the version returned by the backend
        const currentTours = this._tours();
        const updatedList: TourResponse[] = [];

        for (const tour of currentTours) {
          if (tour.id == savedTour.id) {
            updatedList.push(savedTour);
          } else {
            updatedList.push(tour);
          }
        }

        this._tours.set(updatedList);
      })
    );
  }

  // DELETE /api/tours/{id}
  // Deletes a tour on the backend and removes it from the local list.
  delete(id: number): void {
    const url = this.apiUrl + '/' + id;

    this.http.delete<void>(url).subscribe({
      next: () => {
        // Remove the deleted tour from the list
        const currentTours = this._tours();
        const updatedList: TourResponse[] = [];

        for (const tour of currentTours) {
          if (tour.id !== id) {
            updatedList.push(tour);
          }
        }

        this._tours.set(updatedList);

        // Clear selection if the deleted tour was selected
        if (this._selectedId() == id) {
          this._selectedId.set(null);
        }
      },
      error: (err) => {
        console.error('Error deleting tour:', err);
        this._errorMessage.set('Could not delete tour.');
      },
    });
  }

  // GET /api/tours/{id}/export
  // Downloads one selected tour as a JSON file.
  exportTour(id: number): Observable<Blob> {
    const url = this.apiUrl + '/' + id + '/export';
    return this.http.get(url, { responseType: 'blob' });
  }

  // GET /api/tours/{id}/export/xml
  // Downloads one selected tour as an XML file.
  exportTourXml(id: number): Observable<Blob> {
    const url = this.apiUrl + '/' + id + '/export/xml';
    return this.http.get(url, { responseType: 'blob' });
  }

  // POST /api/tours/import
  // Imports tours from a previously exported JSON file.
  importTours(tours: TourExport[]): Observable<TourResponse[]> {
    const url = this.apiUrl + '/import';

    return this.http.post<TourResponse[]>(url, tours).pipe(
      tap((importedTours: TourResponse[]) => {
        const currentTours = this._tours();
        this._tours.set([...currentTours, ...importedTours]);
        this._searchResults.set(null);
      })
    );
  }

  // POST /api/tours/import/xml
  // Imports tours from a previously exported XML file.
  importToursXml(xml: string): Observable<TourResponse[]> {
    const url = this.apiUrl + '/import/xml';

    return this.http.post<TourResponse[]>(url, xml, {
      headers: { 'Content-Type': 'application/xml' },
    }).pipe(
      tap((importedTours: TourResponse[]) => {
        const currentTours = this._tours();
        this._tours.set([...currentTours, ...importedTours]);
        this._searchResults.set(null);
      })
    );
  }

  // Converts a TourResponse (which includes id, distance, etc.) to a TourRequest
  // that only contains the fields the backend expects for create/update.
  private toRequest(tour: TourResponse): TourRequest {
    const request: TourRequest = {
      name: tour.name,
      description: tour.description,
      fromLocation: tour.fromLocation,
      toLocation: tour.toLocation,
      transportType: tour.transportType,
      fromLongitude: tour.fromLongitude,
      fromLatitude: tour.fromLatitude,
      toLongitude: tour.toLongitude,
      toLatitude: tour.toLatitude,
      fromFeatureJson: tour.fromFeatureJson,
      toFeatureJson: tour.toFeatureJson,
    };

    return request;
  }
}
