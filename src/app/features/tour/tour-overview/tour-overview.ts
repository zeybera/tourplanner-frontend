import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourListComponent } from '../tour-list/tour-list';
import { TourService } from '../tour.service';
import { TourDetailsComponent} from '../tour-details/tour-details';
import { Router } from '@angular/router';
import {CardComponent} from '../../../shared/card/card';

@Component({
  selector: 'app-tour-overview',
  standalone: true,
  imports: [CommonModule, TourListComponent, CardComponent, TourDetailsComponent],
  templateUrl: './tour-overview.html',
  styleUrls: ['./tour-overview.css']
})
export class TourOverviewComponent {

  service = inject(TourService);
  private router = inject(Router);

  goToCreate(): void {
    this.router.navigate(['/create']);
  }

  delete(id: number): void {
    this.service.delete(id);
  }

  edit(tour: any): void {
    this.service.selectTour(tour.id);
    this.router.navigate(['/edit']);
  }

  openLogs(tour: any): void {
    this.service.selectTour(tour.id);
    this.router.navigate(['/logs']);
  }

  // Called every time the user types in the search input.
  // Only updates the query signal so the input stays in sync.
  // Clears backend results when the input is empty.
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value;
    this.service.setSearchQuery(query);
  }

  // Called when the user clicks the Search button.
  // Sends the current query to the backend via GET /api/tours/search?q=...
  onSearchSubmit(): void {
    const query = this.service.searchQuery();
    this.service.searchTours(query);
  }
}
