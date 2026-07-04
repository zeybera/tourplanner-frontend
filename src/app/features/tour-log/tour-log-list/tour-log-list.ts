import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourLogService } from '../tour-log.service';
import { TourService } from '../../tour/tour.service';
import { TourLog } from '../tour-log.model';
import { Router } from '@angular/router';
import { CardComponent } from '../../../shared/card/card';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-tour-log-list',
  standalone: true,
  imports: [CommonModule, CardComponent, ConfirmDialogComponent],
  templateUrl: './tour-log-list.html',
  styleUrls: ['./tour-log-list.css'],
})
export class TourLogListComponent {
  service = inject(TourLogService);
  private router = inject(Router);
  tourService = inject(TourService);
  logIdPendingDelete: number | null = null;

  goToCreate(): void {
    this.service.setSelectedLogId(null);
    this.router.navigate(['/logs/new']);
  }

  edit(log: TourLog): void {
    this.service.setSelectedLogId(log.id);
    this.router.navigate(['/logs/edit']);
  }

  askDelete(id: number): void {
    this.logIdPendingDelete = id;
  }

  cancelDelete(): void {
    this.logIdPendingDelete = null;
  }

  confirmDelete(): void {
    if (this.logIdPendingDelete == null) {
      return;
    }

    this.service.delete(this.logIdPendingDelete);
    this.logIdPendingDelete = null;
  }

  hasSelectedTour(): boolean {
    return this.tourService.selectedTour() !== null;
  }

  formatDate(date: string): string {
    const [datePart, timePart] = date.split('T');
    const time = timePart?.substring(0, 5);

    if (!time) {
      return datePart;
    }

    return `${datePart} at ${time}`;
  }
}
