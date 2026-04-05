import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourService } from './tour.service';
import { Tour } from './tour.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tour-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tour-list.html',
})

export class TourListComponent {

  service = inject(TourService);
  private router = inject(Router);

  editingTour = signal<Tour | null>(null);

  // DELETE TOUR
  delete(id: number): void {
    this.service.delete(id);
  }

  // UPDATE TOUR
  edit(tour: Tour) {
    this.service.selectedId.set(tour.id);
    this.router.navigate(['/edit']);
  }

  // TOUR LOGS
  openLogs(tour: Tour) {
    this.service.selectedId.set(tour.id);
    this.router.navigate(['/logs']);
  }
}
