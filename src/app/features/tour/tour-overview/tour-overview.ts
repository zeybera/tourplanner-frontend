import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourListComponent } from '../tour-list/tour-list';
import { TourService } from '../tour.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tour-overview',
  standalone: true,
  imports: [CommonModule, TourListComponent],
  templateUrl: './tour-overview.html',
  styleUrls: ['./tour-overview.css']
})
export class TourOverviewComponent {

  service = inject(TourService);
  private router = inject(Router);

  goToCreate() {
    this.router.navigate(['/create']);
  }
  
}
