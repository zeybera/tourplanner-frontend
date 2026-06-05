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
      this.selectedFrom() !== null &&
      this.selectedTo() !== null &&
      this.transportType() !== '' &&
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

  // CREATE
  create(): void {
    if (!this.isValid()) {
      alert('Please fill all required fields');
      return;
    }

    const request = {
      name: this.name(),
      description: this.description(),
      fromLocation: this.from(),
      toLocation: this.to(),
      transportType: this.transportType() as TransportType,
      fromLongitude: this.selectedFrom()!.coordinates[0],
      fromLatitude: this.selectedFrom()!.coordinates[1],
      toLongitude: this.selectedTo()!.coordinates[0],
      toLatitude: this.selectedTo()!.coordinates[1],
      fromFeatureJson: JSON.stringify(this.selectedFrom()),
      toFeatureJson: JSON.stringify(this.selectedTo()),
    };

    this.service.create(request).subscribe({
      next: () => this.router.navigate(['/tours']),
      error: error => {
        console.error('Could not create tour', error);
        alert('Tour could not be created. Please check backend logs.');
      },
    });
  }
}
