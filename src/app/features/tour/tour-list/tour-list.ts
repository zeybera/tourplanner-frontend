import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourService } from '../tour.service';
import { Tour } from '../tour.model';
import { Router } from '@angular/router';
import {CardComponent} from '../../../shared/card/card';

@Component({
  selector: 'app-tour-list',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './tour-list.html',
  styleUrl: './tour-list.css'
})

export class TourListComponent {

  service = inject(TourService);
  private router = inject(Router);

  editingTour = signal<Tour | null>(null);


  //for detailed view of selected tour in overview
  select(tour: Tour) {
    this.service.selectedId.set(tour.id);
  }
}
