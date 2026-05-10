import { Component, inject, signal, effect, computed } from '@angular/core';
import { Router } from '@angular/router';
import { TourService } from '../tour.service';
import { Tour, TransportType } from '../tour.model';
import { CardComponent } from '../../../shared/card/card';

@Component({
  selector: 'app-tour-edit',
  standalone: true,
  imports: [],
  templateUrl: './tour-edit.html',
  styleUrl: '../tour-creation/tour.css',
})
export class TourEditComponent {
  private _service = inject(TourService);
  private router = inject(Router);

  selectedTour = this._service.selectedTour;

  name = signal('');
  description = signal('');
  from = signal('');
  to = signal('');
  transportType = signal('');
  routeInformation = signal('');
  distance = signal<number | null>(null);
  time = signal<number | null>(null);

  isValid = computed(() =>
      this.name().trim() != '' &&
      this.description().trim() != '' &&
      this.from().trim() != '' &&
      this.to().trim() != '' &&
      this.transportType().trim() != '' &&
      this.routeInformation().trim() != '' &&
      this.distance() != null &&
      this.time() != null &&
      this.distance()! > 0 &&
      this.time()! > 0 &&
      this.from().trim() != this.to().trim(),
  );

  constructor() {
    this.initFormFromTour();
  }

  initFormFromTour() {
    const tour = this._service.selectedTour();
    if (!tour) return;

    this.name.set(tour.name);
    this.description.set(tour.description);
    this.from.set(tour.fromLocation);
    this.to.set(tour.toLocation);
    this.transportType.set(tour.transportType);
    this.routeInformation.set(tour.routeInformation);
    this.distance.set(tour.distance);
    this.time.set(tour.estimatedTime);
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

  onNameInput(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
  }

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
    this.transportType.set((event.target as HTMLSelectElement).value as TransportType);
  }

  onRouteInput(event: Event): void {
    this.routeInformation.set((event.target as HTMLInputElement).value);
  }

  onDistanceInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);

    if (input.value == '') {
      this.distance.set(null);
    } else if (!isNaN(value) && value > 0) {
      this.distance.set(value);
    } else {
      this.distance.set(null);
    }
  }

  onTimeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);

    if (input.value == '') {
      this.time.set(null);
    } else if (!isNaN(value) && value > 0) {
      this.time.set(value);
    } else {
      this.time.set(null);
    }
  }

  update(): void {
    if (!this.isValid()) return;

    const tour = this._service.selectedTour();
    if (!tour) return;

    const updated_tour: Tour = {
      id: tour.id,
      name: this.name(),
      description: this.description(),
      fromLocation: this.from(),
      toLocation: this.to(),
      transportType: this.transportType() as TransportType,
      routeInformation: this.routeInformation(),
      distance: this.distance()!,
      estimatedTime: this.time()!,
    };

    this._service.update(updated_tour);

    this.router.navigate(['/tours']);
  }
}
