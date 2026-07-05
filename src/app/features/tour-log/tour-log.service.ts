import { Injectable, signal, inject, computed, effect } from '@angular/core';
import { TourLog } from './tour-log.model';
import { TourService } from '../tour/tour.service';
import { HttpClient } from '@angular/common/http';
import { API } from '../../shared/api';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TourLogService {

  // We need TourService to know which tour is currently selected
  private tourService = inject(TourService);
  private http = inject(HttpClient);

  // Base URL — logs are nested under tours: /api/tours/{tourId}/logs
  private apiUrl = `${API.apiBaseUrl}/api/tours`;

  // --- SIGNALS ---

  // Holds all tour logs for the currently selected tour
  private _logs = signal<TourLog[]>([]);
  readonly logs = this._logs.asReadonly();

  // Holds the ID of the log being edited (null means we are creating a new one)
  private _selectedLogId = signal<number | null>(null);

  // True while a backend request is in progress
  private _isLoading = signal<boolean>(false);
  readonly isLoading = this._isLoading.asReadonly();

  // Holds an error message if the last request failed
  private _errorMessage = signal<string>('');
  readonly errorMessage = this._errorMessage.asReadonly();

  constructor() {
    // effect() runs every time selectedId() changes.
    // When the user selects a different tour, we reload the logs for that tour.
    effect(() => {
      const tourId = this.tourService.selectedId();

      if (tourId == null) {
        // No tour selected → clear logs
        this._logs.set([]);
        return;
      }

      this.loadLogs(tourId);
    });
  }

  // --- COMPUTED SIGNALS ---

  // Returns only the logs that belong to the currently selected tour.
  // This is a safety filter in case _logs ever contains logs from different tours.
  selectedLogs = computed(() => {
    const tourId = this.tourService.selectedId();

    if (tourId == null) {
      return [];
    }

    const allLogs = this._logs();
    const result: TourLog[] = [];

    for (const log of allLogs) {
      if (log.tourId == tourId) {
        result.push(log);
      }
    }

    return result;
  });

  // Returns the full TourLog object for the currently selected log ID (for editing).
  selectedLog = computed(() => {
    const id = this._selectedLogId();

    if (id == null) {
      return null;
    }

    const allLogs = this._logs();

    for (const log of allLogs) {
      if (log.id == id) {
        return log;
      }
    }

    return null;
  });

  // --- METHODS ---

  // Stores which log the user wants to edit (or null to create a new one)
  setSelectedLogId(id: number | null): void {
    this._selectedLogId.set(id);
  }

  // GET /api/tours/{tourId}/logs
  // Fetches all logs for a specific tour from the backend
  loadLogs(tourId: number): void {
    this._isLoading.set(true);
    this._errorMessage.set('');

    const url = this.apiUrl + '/' + tourId + '/logs';

    this.http.get<TourLog[]>(url).subscribe({
      next: (data: TourLog[]) => {
        this._logs.set(data);
        this._isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading logs:', err);
        this._errorMessage.set('Could not load tour logs.');
        this._isLoading.set(false);
      },
    });
  }

  // POST /api/tours/{tourId}/logs
  // Creates a new log on the backend and adds it to the local list.
  // Returns the Observable so the component can react after the request finishes.
  create(log: Omit<TourLog, 'id'>): Observable<TourLog> {
    const tourId = log.tourId;
    const url = this.apiUrl + '/' + tourId + '/logs';

    // toLogRequest() strips id and tourId — the backend does not expect them
    const requestBody = this.toLogRequest(log);

    return this.http.post<TourLog>(url, requestBody).pipe(
      tap((createdLog: TourLog) => {
        // Add the new log to the local list so the UI updates immediately
        const currentLogs = this._logs();
        const updatedLogs = [...currentLogs, createdLog];
        this._logs.set(updatedLogs);
      })
    );
  }

  // PUT /api/tours/{tourId}/logs/{logId}
  // Updates an existing log on the backend and replaces it in the local list.
  // Returns the Observable so the component can navigate after success.
  update(updated: TourLog): Observable<TourLog> {
    const url = this.apiUrl + '/' + updated.tourId + '/logs/' + updated.id;

    // toLogRequest() strips id and tourId — the backend does not expect them
    const requestBody = this.toLogRequest(updated);

    return this.http.put<TourLog>(url, requestBody).pipe(
      tap((savedLog: TourLog) => {
        // Replace the old log with the version returned by the backend
        const currentLogs = this._logs();
        const updatedList: TourLog[] = [];

        for (const log of currentLogs) {
          if (log.id == savedLog.id) {
            updatedList.push(savedLog);
          } else {
            updatedList.push(log);
          }
        }

        this._logs.set(updatedList);
      })
    );
  }

  // Builds the JSON body sent to the backend for both create and update.
  // The backend does not accept id or tourId — those only live in the URL.
  private toLogRequest(log: Omit<TourLog, 'id'>): object {
    const requestBody = {
      date: log.date,
      comment: log.comment,
      difficulty: log.difficulty,
      rating: log.rating,
      totalDistance: log.totalDistance,
      totalTime: log.totalTime,
      photoData: log.photoData ?? null,
    };

    return requestBody;
  }

  // DELETE /api/tours/{tourId}/logs/{logId}
  // Deletes a log on the backend and removes it from the local list.
  delete(logId: number): void {
    const tourId = this.tourService.selectedId();

    if (tourId == null) {
      return;
    }

    const url = this.apiUrl + '/' + tourId + '/logs/' + logId;

    this.http.delete<void>(url).subscribe({
      next: () => {
        // Remove the deleted log from the list
        const currentLogs = this._logs();
        const updatedList: TourLog[] = [];

        for (const log of currentLogs) {
          if (log.id !== logId) {
            updatedList.push(log);
          }
        }

        this._logs.set(updatedList);
      },
      error: (err) => {
        console.error('Error deleting log:', err);
        this._errorMessage.set('Could not delete tour log.');
      },
    });
  }
}
