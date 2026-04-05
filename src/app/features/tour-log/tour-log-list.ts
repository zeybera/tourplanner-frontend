import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourLogService } from './tour-log.service';
import { TourLog } from './tour-log.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tour-log-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tour-log-list.html'
})
export class TourLogListComponent {

  service = inject(TourLogService);
  private router = inject(Router);

  goToCreate() {
    this.router.navigate(['/logs/new']);
  }

  edit(log: TourLog) {
    this.service.selectedLogId.set(log.id);
    this.router.navigate(['/logs/edit']);
  }

  delete(id: number) {
    this.service.delete(id);
  }

}
