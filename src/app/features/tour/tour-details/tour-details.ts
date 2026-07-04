import { Component, Input, inject } from '@angular/core';
import { Tour } from '../models/tour.model';
import { TourService } from '../tour.service';
import { TourMapComponent } from '../../map/tour-map/tour-map';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog';

import { Router } from '@angular/router';

@Component({
  selector: 'app-tour-details',
  standalone: true,
  imports: [TourMapComponent, ConfirmDialogComponent],
  templateUrl: './tour-details.html',
  styleUrls: ['./tour-details.css']
})
export class TourDetailsComponent {
  @Input() tour!: Tour;
  @Input() compact = false;
  showDeleteConfirm = false;

  service = inject(TourService);
  router = inject(Router);

  askDeleteTour(): void {
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  confirmDeleteTour(): void {
    this.showDeleteConfirm = false;
    this.service.delete(this.tour.id);
  }

  exportTour(): void {
    this.service.exportTour(this.tour.id).subscribe({
      next: (blob) => {
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'tourplanner-tour-' + this.tour.id + '.json';
        link.click();
        URL.revokeObjectURL(downloadUrl);
      },
    });
  }
}
