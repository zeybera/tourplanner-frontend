import { Injectable, signal, inject, computed, effect } from '@angular/core';
import { TourLog } from './tour-log.model';
import { TourService } from '../tour/tour.service';
import { HttpClient } from '@angular/common/http';
import { API } from '../../shared/api';

@Injectable({
  providedIn: 'root',
})
export class TourLogService {
  //for selectedId in TourService
  private tourService = inject(TourService);
  private http = inject(HttpClient);

  private apiUrl = `${API.apiBaseUrl}/api/tours`;

  private _logs = signal<TourLog[]>([]);
  readonly logs = this._logs.asReadonly();

  constructor() {
    effect(() => {
      const tourId = this.tourService.selectedId();

      if (tourId == null) {
        this._logs.set([]);
        return;
      }

      this.loadLogs(tourId);
    });
  }

  // GET /api/tours/{tourId}/logs
  loadLogs(tourId: number): void {
    this.http
      .get<TourLog[]>(`${this.apiUrl}/${tourId}/logs`)
      .subscribe(data => {
        this._logs.set(data);
      });
  }

  // POST /api/tours/{tourId}/logs
  create(log: Omit<TourLog, 'id'>): void {
    const { tourId, ...request } = log;

    this.http
      .post<TourLog>(`${this.apiUrl}/${tourId}/logs`, request)
      .subscribe(createdLog => {
        this._logs.update((logs) => [...logs, createdLog]);
      });
  }

  // DELETE /api/tours/{tourId}/logs/{logId}
  delete(id: number) {
    const tourId = this.tourService.selectedId();

    if (tourId == null) {
      return;
    }

    this.http
      .delete<void>(`${this.apiUrl}/${tourId}/logs/${id}`)
      .subscribe(() => {
        this._logs.update((logs) => logs.filter((log) => log.id !== id));
      });
  }

  // for list of logs
  selectedLogs = computed(() => {
    const tourId = this.tourService.selectedId();

    if (tourId == null) return [];

    return this._logs().filter((log) => log.tourId == tourId);
  });

  //just one  log for edit/update
  private _selectedLogId = signal<number | null>(null);

  //optional: selectedLogId for UI
  //readonly selectedLogId = this._selectedLogId.asReadonly();

  setSelectedLogId(id: number | null) {
    this._selectedLogId.set(id);
  }

  selectedLog = computed(() => {
    const id = this._selectedLogId();

    if (id == null) {
      return null;
    }

    const log = this._logs().find((log) => log.id == id);

    if (log == undefined) {
      return null;
    }

    return log;
  });

  // PUT /api/tours/{tourId}/logs/{logId}
  update(updated: TourLog): void {
    const { id, tourId, ...request } = updated;

    this.http
      .put<TourLog>(`${this.apiUrl}/${tourId}/logs/${id}`, request)
      .subscribe(savedLog => {
        this._logs.update((logs) =>
          logs.map((log) => (log.id == savedLog.id ? savedLog : log))
        );
      });
  }
}
