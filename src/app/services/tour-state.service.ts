import { Injectable, signal } from '@angular/core';
import { Tour } from '../models/tour.model';

@Injectable({
  providedIn: 'root'
})
export class TourStateService {

  tours = signal<Tour[]>([]);

  addTour(tour: Tour) {
    this.tours.update(t => [...t, tour]);
  }

}
