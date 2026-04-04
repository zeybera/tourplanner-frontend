import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourService } from './tour.service';

@Component({
  selector: 'app-tour-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tour-list.html'
})
export class TourListComponent {

  service = inject(TourService);

}