import { Component, signal, input } from '@angular/core';
import { inject } from '@angular/core';
import { TourLogService } from './tour-log.service';
import { TourService } from '../tour/tour.service';


@Component({
  selector: 'app-tour-log-form',
  standalone: true,
  templateUrl: './tour-log-form.html'
})

export class TourLogFormComponent {

  private service = inject(TourLogService);
  private tourService = inject(TourService);


  //tourId = input<number>();

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

  create(): void {
    const tour = this.tourService.selectedTour();

    if (!tour) return;

    this.service.create({
      tourId: tour.id,
      date: new Date().toISOString(),
      comment: this.comment(),
      difficulty: this.difficulty(),
      rating: this.rating(),
      totalDistance: 0,
      totalTime: 0
    });

    // optional reset
    this.comment.set('');
    this.difficulty.set(0);
    this.rating.set(0);
  }

}
