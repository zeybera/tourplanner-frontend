import { Component, signal, input, computed, inject, effect } from '@angular/core';
import { TourLogService } from './tour-log.service';
import { TourService } from '../tour/tour.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tour-log-form',
  standalone: true,
  templateUrl: './tour-log-form.html'
})

export class TourLogFormComponent {

  private service = inject(TourLogService);
  private tourService = inject(TourService);
  private router = inject(Router);


  //tourId = input<number>();

  //
  isEditMode = computed(() => this.service.selectedLog() !== null);

  // STATE
  comment = signal('');
  difficulty = signal(0);
  rating = signal(0);

  //event handler
  onCommentInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.comment.set(value);
  }

  onDifficultyInput(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.difficulty.set(value);
  }

  onRatingInput(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.rating.set(value);
  }

  loadEffect = effect(() => {
    const log = this.service.selectedLog();

    if(log) {
      this.comment.set(log.comment);
      this.difficulty.set(log.difficulty);
      this.rating.set(log.rating);
    }
    });


  create(): void {
    const tour = this.tourService.selectedTour();

    if (!tour) return;

    const existing = this.service.selectedLog();

    if (existing) {
      //UPDATE / EDIT
      this.service.update({
        ...existing,
        comment: this.comment(),
        difficulty: this.difficulty(),
        rating: this.rating()
      });
    } else {
      //CREATE
      this.service.create({
        tourId: tour.id,
        date: new Date().toISOString(),
        comment: this.comment(),
        difficulty: this.difficulty(),
        rating: this.rating(),
        totalDistance: 0,
        totalTime: 0
      });
    }
      //back to list
      this.router.navigate(['/logs']);

    // optional reset
    this.comment.set('');
    this.difficulty.set(0);
    this.rating.set(0);
    }
}
