import { Injectable, signal } from '@angular/core';
import { Tour } from './tour.model';

@Injectable({
  providedIn: 'root'
})

export class TourService {

//inside the signal there is an array of tours
  private _tours = signal<Tour[]>([]);
  readonly tours = this._tours.asReadonly();

  private nextId = 1;


  // CREATE
  
  create(tour: any): void {
  const newTour: Tour = {...tour, id: this.nextId++};

  this._tours.update(tours => [...tours, newTour]);
}
  
// READ
  read(): Tour[] {
    return this._tours();
  }

   }