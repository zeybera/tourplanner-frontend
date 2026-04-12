import { Component, signal, computed, inject, effect } from '@angular/core';
import { TourLogService } from '../tour-log.service';
import { TourService } from '../../tour/tour.service';
import { Router } from '@angular/router';
import {CardComponent} from '../../../shared/card/card';

@Component({
  selector: 'app-tour-log-form',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './tour-log-form.html',
  styleUrls: ['./tour-log-form.css']
})

export class TourLogFormComponent {

  private service = inject(TourLogService);
  private tourService = inject(TourService);
  private router = inject(Router);


  //tourId = input<number>();

  //
  isEditMode = computed(() => this.service.selectedLog() !== null);

  // STATE
  date = signal ('');
  time = signal('');
  comment = signal('');
  difficulty = signal(0);
  rating = signal(0);
  totalDistance = signal(0);
  totalTime = signal(0);

  //event handler
  onDateInput(event: Event) {
    this.date.set((event.target as HTMLInputElement).value);
  }

  onTimeInput(event: Event) {
    this.time.set((event.target as HTMLInputElement).value);
  }

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

  onDistanceInput(event: Event) {
    this.totalDistance.set(Number((event.target as HTMLInputElement).value));
  }

  onTotalTimeInput(event: Event) {
    this.totalTime.set(Number((event.target as HTMLInputElement).value));
  }

  loadEffect = effect(() => {
    const log = this.service.selectedLog();

    if(log) {
      this.comment.set(log.comment);
      this.difficulty.set(log.difficulty);
      this.rating.set(log.rating);
    }
    });


  isValid = computed(() =>
    this.date() !== '' &&
    this.time() !== '' &&
    this.comment().trim() !== '' &&
    this.difficulty() >= 1 && this.difficulty() <= 5 &&
    this.rating() >= 1 && this.rating() <= 5 &&
    this.totalDistance() > 0 &&
    this.totalTime() > 0
  );

  create(): void {

    if (!this.isValid()) return;

    const tour = this.tourService.selectedTour();
    if (!tour) return;

    const existing = this.service.selectedLog();

    if (existing) {
      this.service.update({
        ...existing,
        comment: this.comment(),
        difficulty: this.difficulty(),
        rating: this.rating()
      });
    } else {
      this.service.create({
        tourId: tour.id,

        date: this.date() + 'T' + this.time(),    // T nur zum speichern

        comment: this.comment(),
        difficulty: this.difficulty(),
        rating: this.rating(),
        totalDistance: this.totalDistance(),
        totalTime: this.totalTime()
      });
    }

    this.router.navigate(['/logs']);
  }
}
