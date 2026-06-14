import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../../shared/api';
import { GeocodeFeature } from './geocode.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouteService {

  private http = inject(HttpClient);

  // Base URL for route endpoints on the Spring Boot backend
  private apiUrl = `${API.apiBaseUrl}/api/routes`;

  // --- SIGNALS ---

  // True while a geocode request is running
  private _isLoading = signal<boolean>(false);
  readonly isLoading = this._isLoading.asReadonly();

  // Holds an error message if geocoding fails
  private _errorMessage = signal<string>('');
  readonly errorMessage = this._errorMessage.asReadonly();

  // --- METHODS ---

  // GET /api/routes/geocode?text=...
  // Sends a text query to the backend which calls OpenRouteService.
  // Returns the Observable directly — tap() updates our signals as a side effect
  // while the Observable chain stays intact for whoever subscribes.
  geocode(text: string): Observable<GeocodeFeature[]> {
    this._isLoading.set(true);
    this._errorMessage.set('');

    const url = this.apiUrl + '/geocode';

    return this.http.get<GeocodeFeature[]>(url, { params: { text: text } }).pipe(
      tap({
        next: () => {
          this._isLoading.set(false);
        },
        error: (err: unknown) => {
          console.error('Geocode error:', err);
          this._isLoading.set(false);
          this._errorMessage.set('Location search failed. Please try again.');
        },
      })
    );
  }
}
