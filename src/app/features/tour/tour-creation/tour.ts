import { Component, signal, inject, computed } from '@angular/core';
import { TourService } from '../tour.service';
import { Router } from '@angular/router';
import { TransportType } from '../tour.model';
//import { }

@Component({
  selector: 'app-tour',
  standalone: true,
  templateUrl: './tour.html',
  styleUrls: ['./tour.css'],
})
export class TourComponent {
  private service = inject(TourService);
  private router = inject(Router);

  // FORM STATE (signals)
  name = signal('');
  description = signal('');
  from = signal('');
  to = signal('');
  transportType = signal<TransportType | ''>('');
  routeInformation = signal('');


  isValid = computed(() =>
    this.name().trim() !== '' &&
    this.description().trim() !== '' &&
    this.from().trim() !== '' &&
    this.to().trim() !== '' &&
    this.transportType() !== '' &&
    this.routeInformation().trim() !== '' &&
    this.from().trim() !== this.to().trim()
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
  }

  onToInput(event: Event): void {
    this.to.set((event.target as HTMLInputElement).value);
  }

  onTransportInput(event: Event): void {
    this.transportType.set((event.target as HTMLInputElement).value as TransportType);
  }

  onRouteInput(event: Event): void {
    this.routeInformation.set((event.target as HTMLInputElement).value);
  }

  // CREATE
  create(): void {
    if ( !this.isValid()) {
      alert('Please fill all required fields');
      return;
    }

    //create() function within TourService is called
    this.service.create({
      name: this.name(),
      description: this.description(),
      from: this.from(),
      to: this.to(),
      transportType: this.transportType() as TransportType,
      routeInformation: this.routeInformation(),
      distance: 0,
      time: 0,
    });
    this.router.navigate(['/tours']);
  }
}
