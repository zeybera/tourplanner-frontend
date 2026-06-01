import { Component, signal, inject, computed } from '@angular/core';
import { TourService } from '../tour.service';
import { Router } from '@angular/router';
import { TransportType } from '../tour.model';
import { RouteService } from '../../route/route.service';
import { GeocodeFeature } from '../../route/geocode.model';
//import { }

@Component({
  selector: 'app-tour',
  standalone: true,
  templateUrl: './tour.html',
  styleUrls: ['./tour.css'],
})
export class TourComponent {
  private service = inject(TourService);
  private routeService = inject(RouteService);
  private router = inject(Router);

  // FORM STATE (signals)
  name = signal('');
  description = signal('');
  from = signal('');
  to = signal('');
  transportType = signal<TransportType | ''>('');
  routeInformation = signal('');
  distance = signal<number | null>(null);
  time = signal<number | null>(null);
  fromResults = signal<GeocodeFeature[]>([]);
  toResults = signal<GeocodeFeature[]>([]);
  selectedFrom = signal<GeocodeFeature | null>(null);
  selectedTo = signal<GeocodeFeature | null>(null);

  isValid = computed(
    () =>
      this.name().trim() !== '' &&
      this.description().trim() !== '' &&
      this.from().trim() !== '' &&
      this.to().trim() !== '' &&
      this.transportType() !== '' &&
      this.routeInformation().trim() !== '' &&
      this.distance()! > 0 &&
      this.time()! > 0 &&
      this.from().trim() !== this.to().trim(),
  );

  // EVENT HANDLERS
  onNameInput(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
  }

  onDescriptionInput(event: Event): void {
    this.description.set((event.target as HTMLInputElement).value);
  }

  onFromInput(event: Event): void {
    this.from.set((event.target as HTMLInputElement).value);
    this.selectedFrom.set(null);
  }

  onToInput(event: Event): void {
    this.to.set((event.target as HTMLInputElement).value);
    this.selectedTo.set(null);
  }

  onTransportInput(event: Event): void {
    this.transportType.set((event.target as HTMLSelectElement).value as TransportType);
  }

  searchFrom(): void {
    if (this.from().trim() == '') return;

    this.routeService.geocode(this.from()).subscribe(results => {
      this.fromResults.set(results);
    });
  }

  searchTo(): void {
    if (this.to().trim() == '') return;

    this.routeService.geocode(this.to()).subscribe(results => {
      this.toResults.set(results);
    });
  }

  selectFrom(result: GeocodeFeature): void {
    this.selectedFrom.set(result);
    this.from.set(result.label);
    this.fromResults.set([]);
  }

  selectTo(result: GeocodeFeature): void {
    this.selectedTo.set(result);
    this.to.set(result.label);
    this.toResults.set([]);
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

  // CREATE
  create(): void {
    if (!this.isValid()) {
      alert('Please fill all required fields');
      return;
    }

    //create() function within TourService is called
    this.service.create({
      name: this.name(),
      description: this.description(),
      fromLocation: this.from(),
      toLocation: this.to(),
      transportType: this.transportType() as TransportType,
      routeInformation: this.routeInformation(),
      distance: this.distance()!,
      estimatedTime: this.time()!,
    });
    this.router.navigate(['/tours']);
  }
}
