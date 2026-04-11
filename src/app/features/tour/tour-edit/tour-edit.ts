import { Component, inject, signal, effect, computed } from '@angular/core';
import {  Router } from '@angular/router';
import { TourService } from '../tour.service';
import { Tour, TransportType } from '../tour.model';
import {CardComponent} from '../../../shared/card/card';

@Component({
  selector: 'app-tour-edit',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './tour-edit.html',
  styleUrl: '../tour-creation/tour.css',
})
export class TourEditComponent {
  private _service = inject(TourService);
  private router = inject(Router);

  selectedTour = this._service.selectedTour;

  description = signal('');
  from = signal('');
  to = signal('');
  transportType = signal('');
  routeInformation = signal('');


  isValid = computed(() =>
    this.description().trim() !== '' &&
    this.from().trim() !== '' &&
    this.to().trim() !== '' &&
    this.transportType().trim() !== '' &&
    this.routeInformation().trim() !== '' &&
    this.from().trim() !== this.to().trim()
  );

  constructor() {
    this.initFormFromTour();
  }

  initFormFromTour() {
    const tour = this._service.selectedTour();
    if (!tour) return;

    this.description.set(tour.description);
    this.from.set(tour.from);
    this.to.set(tour.to);
    this.transportType.set(tour.transportType);
    this.routeInformation.set(tour.routeInformation);
  }

  logEffect = effect(() => {
    console.log('Form changed:', {
      description: this.description(),
      from: this.from(),
      to: this.to(),
    });
  });

  Effect = effect(() => {
    console.log('Editing tour is:', this._service.selectedTour());
  });

  onDescriptionInput(event: Event): void {
    this.description.set((event.target as HTMLInputElement).value);
  }

  onFromInput(event: Event): void {
    this.from.set((event.target as HTMLInputElement).value);
  }

  onToInput(event: Event): void {
    this.to.set((event.target as HTMLInputElement).value);
  }

  onTransportInput(event: Event): void {
    this.transportType.set((event.target as HTMLInputElement).value);
  }

  onRouteInput(event: Event): void {
    this.routeInformation.set((event.target as HTMLInputElement).value);
  }

  update(): void {

    if (!this.isValid()) return;

    const tour = this._service.selectedTour();
    if (!tour) return;

    const updated_tour: Tour = {
      id: tour.id,
      description: this.description(),
      from: this.from(),
      to: this.to(),
      transportType: this.transportType() as TransportType,
      routeInformation: this.routeInformation(),
      distance: 0,
      time: 0,
    };

    this._service.update(updated_tour);

    this.router.navigate(['/tours']);
  }
}
