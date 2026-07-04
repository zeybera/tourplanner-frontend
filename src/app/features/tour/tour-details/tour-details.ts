import { Component, Input, inject } from '@angular/core';
import { Tour } from '../models/tour.model';
import { TourService } from '../tour.service';
import { TourMapComponent } from '../../map/tour-map/tour-map';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog';
import { TourImportExportFileService } from '../import-export/tour-import-export-file.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tour-details',
  standalone: true,
  imports: [TourMapComponent, ConfirmDialogComponent],
  templateUrl: './tour-details.html',
  styleUrls: ['./tour-details.css'],
})
export class TourDetailsComponent {
  @Input() tour!: Tour;
  @Input() compact = false;
  showDeleteConfirm = false;
  showExportMenu = false;

  service = inject(TourService);
  private importExportFiles = inject(TourImportExportFileService);
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

  toggleExportMenu(): void {
    this.showExportMenu = !this.showExportMenu;
  }

  exportTour(): void {
    this.showExportMenu = false;

    this.service.exportTour(this.tour.id).subscribe({
      next: (blob) => {
        this.importExportFiles.downloadBlob(blob, 'tourplanner-tour-' + this.tour.id + '.json');
      },
      error: () => {
        alert('JSON export failed.');
      },
    });
  }

  exportTourXml(): void {
    this.showExportMenu = false;

    this.service.exportTourXml(this.tour.id).subscribe({
      next: (blob) => {
        this.importExportFiles.downloadBlob(blob, 'tourplanner-tour-' + this.tour.id + '.xml');
      },
      error: () => {
        alert('XML export failed.');
      },
    });
  }
}
