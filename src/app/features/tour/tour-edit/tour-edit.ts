import { Component, inject, signal, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TourService } from '../tour.service';
import { Tour, TransportType } from '../tour.model';

@Component({
  selector: 'app-tour-edit',
  standalone: true,
  templateUrl: './tour-edit.html',
  styleUrl: '../tour-creation/tour.css',
})
export class TourEditComponent {
  private service = inject(TourService);
  private router = inject(Router);

  description = signal('');
  from = signal('');
  to = signal('');
  transportType = signal('');
  routeInformation = signal('');

  constructor() {
    this.initFormFromTour();
  }

  initFormFromTour() {
    const tour = this.service.selectedTour();
    if (!tour) return;

    this.description.set(tour.description);
    this.from.set(tour.from);
    this.to.set(tour.to);
    this.transportType.set(tour.transportType);
    this.routeInformation.set(tour.routeInformation);
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
    this.transportType.set((event.target as HTMLInputElement).value);
  }

  onRouteInput(event: Event): void {
    this.routeInformation.set((event.target as HTMLInputElement).value);
  }

  update(): void {
    const tour = this.service.selectedTour();
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

    this.service.update(updated_tour);

    this.router.navigate(['/tours']);
  }
}
