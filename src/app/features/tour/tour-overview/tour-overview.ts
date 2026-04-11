import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourListComponent } from '../tour-list/tour-list';
import { TourService } from '../tour.service';
import { Router } from '@angular/router';
import {CardComponent} from '../../../shared/card/card';

@Component({
  selector: 'app-tour-overview',
  standalone: true,
  imports: [CommonModule, TourListComponent, CardComponent],
  templateUrl: './tour-overview.html',
  styleUrls: ['./tour-overview.css']
})
export class TourOverviewComponent {

  service = inject(TourService);
  private router = inject(Router);

  goToCreate() {
    this.router.navigate(['/create']);
  }

  delete(id: number) {
    this.service.delete(id);
  }

  edit(tour: any) {
    this.service.selectedId.set(tour.id);
    this.router.navigate(['/edit']);
  }

  openLogs(tour: any) {
    this.service.selectedId.set(tour.id);
    this.router.navigate(['/logs']);
  }
}
