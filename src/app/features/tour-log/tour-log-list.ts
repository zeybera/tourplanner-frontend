import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourLogService } from './tour-log.service';
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

  delete(id: number) {
    this.service.delete(id);
  }

}
