import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourLogService } from '../tour-log.service';
import { TourService} from '../../tour/tour.service';
import { TourLog } from '../tour-log.model';
import { Router } from '@angular/router';
import {CardComponent} from '../../../shared/card/card';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-tour-log-list',
  standalone: true,
  imports: [CommonModule, CardComponent, ConfirmDialogComponent],
  templateUrl: './tour-log-list.html',
  styleUrls: ['./tour-log-list.css']
})
export class TourLogListComponent {

  service = inject(TourLogService);
  private router = inject(Router);
  tourService = inject(TourService);
  logIdPendingDelete: number | null = null;

  goToCreate() {
    this.service.setSelectedLogId(null);
    this.router.navigate(['/logs/new']);
  }

  edit(log: TourLog) {
    this.service.setSelectedLogId(log.id);
    this.router.navigate(['/logs/edit']);
  }

  askDelete(id: number) {
    this.logIdPendingDelete = id;
  }

  cancelDelete() {
    this.logIdPendingDelete = null;
  }

  confirmDelete() {
    if (this.logIdPendingDelete == null) {
      return;
    }

    this.service.delete(this.logIdPendingDelete);
    this.logIdPendingDelete = null;
  }

}
