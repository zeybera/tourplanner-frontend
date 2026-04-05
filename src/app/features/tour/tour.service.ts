import { Injectable, signal, computed } from '@angular/core';
import { Tour } from './tour.model';

@Injectable({
  providedIn: 'root',
})

export class TourService {
  //inside the signal there is an array of tours
  private _tours = signal<Tour[]>([]);
  readonly tours = this._tours.asReadonly();

  private nextId = 15;

  constructor() {
    this.loadTours();
  }

  async loadTours() {
  //TO DO: load from backend
  const data : Tour[] = await fetch('/assets/tours.json').then(res => res.json());
  this._tours.set(data);
}

  // CREATE

  create(tour: Omit<Tour,'id'>): void {
    const newTour: Tour = { ...tour, id: this.nextId++ };

    this._tours.update((tours) => [...tours, newTour]);
  }

  // READ is performed through the signal (tours)
  // components consume the state directly instead of calling a read() function (not reactive)
  //read(): Tour[] {
  //  return this._tours();
  //}

  // DELETE
  delete(id: number): void {
    this._tours.update((tours) => {
      const newTours = tours.filter((tour) => {
        return tour.id != id;
      });
      return newTours;
    });
  }


// shared state across components → keep in service
selectedId = signal<number | null>(null);

//derived state
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

// UPDATE
  //maybe partial for update
 update(updated: Tour): void {
  this._tours.update(tours => {
    const newTours: Tour[] = [];
    for (let t of tours) {
      if (t.id == updated.id) {
        newTours.push(updated);
      } else {
        newTours.push(t);
      }
    }
    return newTours;
  });
}

}
