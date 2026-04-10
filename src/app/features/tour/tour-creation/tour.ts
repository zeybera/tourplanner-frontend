import { Component, signal, inject } from '@angular/core';
import { TourService } from '../tour.service';
import { Router } from '@angular/router';
import { TransportType } from '../tour.model';

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
  description = signal('');
  from = signal('');
  to = signal('');
  transportType = signal<TransportType | ''>('');
  routeInformation = signal('');

  // EVENT HANDLERS
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
    if (!this.description() || !this.from() || !this.to() || !this.transportType()) {
      alert('Please fill all required fields');
      return;
    }
    if (this.from() == this.to()) {
      alert('From and To cannot be the same');
      return;
    }

    //create() function within TourService is called
    this.service.create({
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
