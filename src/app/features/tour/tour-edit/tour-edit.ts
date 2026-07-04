import { Component, inject, signal, effect, computed, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TourService } from '../tour.service';
import { Tour, TransportType } from '../models/tour.model';
import { RouteService } from '../../route/route.service';
import { GeocodeFeature } from '../../route/geocode.model';
import { Subject, catchError, debounceTime, distinctUntilChanged, filter, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-tour-edit',
  standalone: true,
  imports: [],
  templateUrl: './tour-edit.html',
  styleUrl: '../tour-creation/tour.css',
})
export class TourEditComponent {
  private _service = inject(TourService);
  private routeService = inject(RouteService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  private fromAutocomplete = new Subject<string>();
  private toAutocomplete = new Subject<string>();

  selectedTour = this._service.selectedTour;

  name = signal('');
  description = signal('');
  from = signal('');
  to = signal('');
  transportType = signal('');
  distance = signal<number | null>(null);
  time = signal<number | null>(null);
  fromResults = signal<GeocodeFeature[]>([]);
  toResults = signal<GeocodeFeature[]>([]);
  selectedFrom = signal<GeocodeFeature | null>(null);
  selectedTo = signal<GeocodeFeature | null>(null);

  isValid = computed(() =>
      this.name().trim() != '' &&
      this.description().trim() != '' &&
      this.from().trim() != '' &&
      this.to().trim() != '' &&
      this.transportType().trim() != '' &&
      this.from().trim() != this.to().trim(),
  );

  constructor() {
    this.initFormFromTour();
    this.setupAutocomplete();
  }

  initFormFromTour() {
    const tour = this._service.selectedTour();
    if (!tour) return;

    this.name.set(tour.name);
    this.description.set(tour.description);
    this.from.set(tour.fromLocation);
    this.to.set(tour.toLocation);
    this.transportType.set(tour.transportType);
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
    const value = (event.target as HTMLInputElement).value;
    this.from.set(value);
    this.selectedFrom.set(null);
    this.fromResults.set([]);
    this.fromAutocomplete.next(value);
  }

  onToInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.to.set(value);
    this.selectedTo.set(null);
    this.toResults.set([]);
    this.toAutocomplete.next(value);
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

  private setupAutocomplete(): void {
    this.fromAutocomplete.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      filter(value => value.trim().length >= 3),
      switchMap(value =>
        this.routeService.geocode(value.trim()).pipe(
          catchError(() => of([]))
        )
      ),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(results => {
      this.fromResults.set(results);
    });

    this.toAutocomplete.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      filter(value => value.trim().length >= 3),
      switchMap(value =>
        this.routeService.geocode(value.trim()).pipe(
          catchError(() => of([]))
        )
      ),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(results => {
      this.toResults.set(results);
    });
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

    const updatedTour: Tour = {
      id: tour.id,
      name: this.name(),
      description: this.description(),
      fromLocation: this.from(),
      toLocation: this.to(),
      transportType: this.transportType() as TransportType,
      fromLongitude: this.selectedFrom()?.coordinates[0] ?? tour.fromLongitude,
      fromLatitude: this.selectedFrom()?.coordinates[1] ?? tour.fromLatitude,
      toLongitude: this.selectedTo()?.coordinates[0] ?? tour.toLongitude,
      toLatitude: this.selectedTo()?.coordinates[1] ?? tour.toLatitude,
      fromFeatureJson: this.selectedFrom() ? JSON.stringify(this.selectedFrom()) : tour.fromFeatureJson,
      toFeatureJson: this.selectedTo() ? JSON.stringify(this.selectedTo()) : tour.toFeatureJson,
      routeInformation: tour.routeInformation,
      distance: tour.distance,
      estimatedTime: tour.estimatedTime,
      popularity: tour.popularity,
      childFriendliness: tour.childFriendliness,
    };

    this._service.update(updatedTour).subscribe(() => {
    this.router.navigate(['/tours']);
    });
    
  }
}
