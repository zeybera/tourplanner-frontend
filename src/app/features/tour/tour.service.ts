import { Injectable, signal, computed } from '@angular/core';
import { Tour } from './tour.model';

@Injectable({
  providedIn: 'root',
})

export class TourService {
  //inside this signal there is an array of tours
  // private bedeutet: signal wird nur im Service erreichbar, zb. außerhalb "this.service._tours" nicht erreichbar
  // Wie wird der State trotzdem verändert?  Nicht direkt, sondern über Methoden im Service. Komponenten greifen nicht direkt auf das Signal zu, sondern rufen Funktionen im Service auf.
  private _tours = signal<Tour[]>([]);
  // warum brauchen wir readonly signal? Components den State sehen, aber NICHT verändern könne
  // Component darf nur: this.service.tours() für lesen aufrufen, aber nicht this.service.tours.set() oder this.service.tours.update() 
  readonly tours = this._tours.asReadonly();

  private nextId = 15;

  //TourService wird erzeugt, constructor wird ausgeführt, loadTours() wird aufgerufen
  //Der constructor wird ausgeführt, wenn das Objekt erstellt wird.
  constructor() {
    this.loadTours();
  }

  async loadTours() {
  //TO DO: load from backend
  const data : Tour[] = await fetch('../../../assets/tours.json').then(res => res.json());
 console.log("loading tours from json");
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


// shared state across components, so we keep in service
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
