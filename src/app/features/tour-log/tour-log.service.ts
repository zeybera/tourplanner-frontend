import { Injectable, signal, inject, computed } from '@angular/core';
import { TourLog } from './tour-log.model';
import { Observable, of } from 'rxjs';
import {TourService} from '../tour/tour.service';
//TO DO import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TourLogService {

  //for selectedId in TourServcie
  private tourService = inject(TourService);

  private _logs = signal<TourLog[]>([]);
  readonly logs = this._logs.asReadonly();

  //to do:  for mock tourlogs, delete after backend
  private nextLogId = 100;

  //for json
  constructor() {
   void this.loadLogs();
  }

  async loadLogs() {
    //TO DO: load from backend
    const data = await fetch('/assets/logs.json').then(res => res.json());
    this._logs.set(data);
  }

  //CREATE LOGS
  create (log: Omit<TourLog, 'id'>): void{
    const newLog: TourLog = {...log, id: this.nextLogId++};

    this._logs.update(logs => [...logs, newLog]);
  }


  selectedLogs = computed (() => {
    const tourId = this.tourService.selectedId();

    if (tourId == null)return [];

    return this._logs().filter(log => log.tourId === tourId);
  });



}
