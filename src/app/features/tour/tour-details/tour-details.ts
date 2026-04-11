import { Component, Input, inject } from '@angular/core';
import { Tour } from '../tour.model';
import { TourService } from '../tour.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-tour-details',
  standalone: true,
  templateUrl: './tour-details.html',
  styleUrls: ['./tour-details.css']
})
export class TourDetailsComponent {
  @Input() tour!: Tour;
  @Input() compact = false;

  service = inject(TourService);
  router = inject(Router);
}
