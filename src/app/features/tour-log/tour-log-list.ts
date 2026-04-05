import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourLogService } from './tour-log.service';

@Component({
  selector: 'app-tour-log-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tour-log-list.html'
})
export class TourLogListComponent {

  service = inject(TourLogService);

}
