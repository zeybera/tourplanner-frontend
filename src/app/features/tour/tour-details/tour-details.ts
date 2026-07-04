import { Component, Input, inject } from '@angular/core';
import { Tour } from '../models/tour.model';
import { TourService } from '../tour.service';
import { TourMapComponent } from '../../map/tour-map/tour-map';

import { Router } from '@angular/router';

@Component({
  selector: 'app-tour-details',
  standalone: true,
  imports: [TourMapComponent],
  templateUrl: './tour-details.html',
  styleUrls: ['./tour-details.css']
})
export class TourDetailsComponent {
  @Input() tour!: Tour;
  @Input() compact = false;

  service = inject(TourService);
  router = inject(Router);

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
