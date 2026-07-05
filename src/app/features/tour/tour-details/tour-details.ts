import { Component, Input, inject, signal } from '@angular/core';
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
  exportError = signal('');

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
    this.exportError.set('');
    this.showExportMenu = !this.showExportMenu;
  }

  exportTour(): void {
    this.exportError.set('');
    this.showExportMenu = false;

    this.service.exportTour(this.tour.id).subscribe({
      next: (blob) => {
        this.importExportFiles.downloadBlob(blob, 'tourplanner-tour-' + this.tour.id + '.json');
      },
      error: () => {
        this.exportError.set('JSON export failed. Please try again.');
      },
    });
  }

  exportTourXml(): void {
    this.exportError.set('');
    this.showExportMenu = false;

    this.service.exportTourXml(this.tour.id).subscribe({
      next: (blob) => {
        this.importExportFiles.downloadBlob(blob, 'tourplanner-tour-' + this.tour.id + '.xml');
      },
      error: () => {
        this.exportError.set('XML export failed. Please try again.');
      },
    });
  }
}
