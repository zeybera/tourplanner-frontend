import { Injectable, signal, inject, computed } from '@angular/core';
import { TourLog } from './tour-log.model';
import {TourService} from '../tour/tour.service';
//TO DO import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TourLogService {

  //for selectedId in TourService
  private tourService = inject(TourService);

  private _logs = signal<TourLog[]>([]);
  readonly logs = this._logs.asReadonly();

  //to do:  for mock tour-logs, delete after backend
  private nextLogId = 100;

  //for json
  constructor() {
   void this.loadLogs();
  }

  async loadLogs() {
    //TO DO: load from backend
    const data: TourLog [] = await fetch('/assets/logs.json').then(res => res.json());
    this._logs.set(data);
  }

  //CREATE LOGS
  create (log: Omit<TourLog, 'id'>): void{
    const newLog: TourLog = {...log, id: this.nextLogId++};

    this._logs.update(logs => [...logs, newLog]);
  }

  delete (id: number) {
    this._logs.update(logs => logs.filter (log => log.id !== id));
  }

  // for list of logs
  selectedLogs = computed (() => {
    const tourId = this.tourService.selectedId();

    if (tourId == null)return [];

    return this._logs().filter(log => log.tourId === tourId);
  });

  //just one  log for edit/update
  selectedLogId = signal<number | null>(null);
  selectedLog = computed(() => {
    const id = this.selectedLogId();
    if (id == null) return null;

    return this._logs().find(log => log.id === id) ?? null;
  });

  update(updated: TourLog): void {
    this._logs.update(logs =>
      logs.map(log => log.id === updated.id ? updated : log)
    );
  }



}
