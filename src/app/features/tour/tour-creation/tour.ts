import { Component, signal, inject, computed } from '@angular/core';
import { TourService } from '../tour.service';
import { Router } from '@angular/router';
import { TransportType } from '../tour.model';
import { RouteService } from '../../route/route.service';
import { GeocodeFeature } from '../../route/geocode.model';

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

  // Basic form fields
  name = signal('');
  description = signal('');
  from = signal('');
  to = signal('');
  transportType = signal<TransportType | ''>('');

  // Geocoding results shown below each input after the user clicks Search
  fromResults = signal<GeocodeFeature[]>([]);
  toResults = signal<GeocodeFeature[]>([]);

  // The location the user clicked from the results list
  selectedFrom = signal<GeocodeFeature | null>(null);
  selectedTo = signal<GeocodeFeature | null>(null);

  // Route preview - shown after both locations and transport type are selected
  routeDistance = signal<number | null>(null);
  routeTime = signal<number | null>(null);
  isCalculating = signal(false);

  // The Create button is only enabled when all required fields are filled
  isValid = computed(
    () =>
      this.name().trim() !== '' &&
      this.description().trim() !== '' &&
      this.selectedFrom() !== null &&
      this.selectedTo() !== null &&
      this.transportType() !== ''
  );

  onNameInput(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
  }

  onDescriptionInput(event: Event): void {
    this.description.set((event.target as HTMLInputElement).value);
  }

  onFromInput(event: Event): void {
    this.from.set((event.target as HTMLInputElement).value);
    // Clear the selection when the user changes the text
    this.selectedFrom.set(null);
    this.routeDistance.set(null);
    this.routeTime.set(null);
  }

  onToInput(event: Event): void {
    this.to.set((event.target as HTMLInputElement).value);
    // Clear the selection when the user changes the text
    this.selectedTo.set(null);
    this.routeDistance.set(null);
    this.routeTime.set(null);
  }

  onTransportInput(event: Event): void {
    this.transportType.set((event.target as HTMLSelectElement).value as TransportType);
    // Try to calculate the route now that transport type is set
    this.tryCalculateRoute();
  }

  // Search for "From" location suggestions using the geocoding API
  searchFrom(): void {
    if (this.from().trim() == '') return;
    this.routeService.geocode(this.from()).subscribe(results => {
      this.fromResults.set(results);
    });
  }

  // Search for "To" location suggestions using the geocoding API
  searchTo(): void {
    if (this.to().trim() == '') return;
    this.routeService.geocode(this.to()).subscribe(results => {
      this.toResults.set(results);
    });
  }

  // Called when the user clicks a result in the From dropdown
  selectFrom(result: GeocodeFeature): void {
    this.selectedFrom.set(result);
    this.from.set(result.label);
    this.fromResults.set([]); // hide the dropdown
    this.tryCalculateRoute();
  }

  // Called when the user clicks a result in the To dropdown
  selectTo(result: GeocodeFeature): void {
    this.selectedTo.set(result);
    this.to.set(result.label);
    this.toResults.set([]); // hide the dropdown
    this.tryCalculateRoute();
  }

  // Automatically calculates the route when both locations and transport type are ready.
  // Shows a distance and time preview to the user before they save the tour.
  tryCalculateRoute(): void {
    const from = this.selectedFrom();
    const to = this.selectedTo();
    const transport = this.transportType();

    // We need all three to calculate a route
    if (!from || !to || !transport) return;

    this.isCalculating.set(true);

    this.routeService.calculateRoute(
      from.coordinates[0], from.coordinates[1],
      to.coordinates[0], to.coordinates[1],
      transport
    ).subscribe({
      next: (result) => {
        this.routeDistance.set(result.distance);
        this.routeTime.set(result.estimatedTime);
        this.isCalculating.set(false);
      },
      error: () => {
        this.isCalculating.set(false);
      }
    });
  }

  // Saves the tour to the backend
  create(): void {
    if (!this.isValid()) {
      alert('Please fill all required fields and select valid locations.');
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
      error: () => alert('Could not create tour.')
    });
  }
}
