import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourLogService } from '../tour-log.service';
import { TourLog } from '../tour-log.model';
import { Router } from '@angular/router';
import {CardComponent} from '../../../shared/card/card';

@Component({
  selector: 'app-tour-log-list',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './tour-log-list.html',
  styleUrls: ['./tour-log-list.css']
})
export class TourLogListComponent {

  service = inject(TourLogService);
  private router = inject(Router);

  goToCreate() {
    this.service.selectedLogId.set(null);
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
