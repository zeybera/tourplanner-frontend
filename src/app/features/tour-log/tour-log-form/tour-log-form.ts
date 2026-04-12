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
      const [datePart, timePart] = log.date.split('T');

      this.date.set(datePart);
      this.time.set(timePart?.substring(0,5) || '');

      this.comment.set(log.comment);
      this.difficulty.set(log.difficulty);
      this.rating.set(log.rating);

      this.totalDistance.set(log.totalDistance);
      this.totalTime.set(log.totalTime);
    }
    });


  isValid = computed(() => {

    const selectedDateTime = new Date(this.date() + 'T' + this.time());
    const now = new Date();
    const minDate = new Date('2020-01-01');

    return(
    this.date() !== '' &&
    this.time() !== '' &&

    selectedDateTime <= now &&
    selectedDateTime >=minDate &&

    this.comment().trim() !== '' &&
    this.difficulty() >= 1 && this.difficulty() <= 5 &&
    this.rating() >= 1 && this.rating() <= 5 &&

    // validation for total distance
    this.totalDistance() > 0 &&
    this.totalDistance() < 2000 && //max km

    //validation for total time
    this.totalTime() > 0 &&
    this.totalTime() <= 1440 //max 24h
    );
  });

  create(): void {

    if (!this.isValid()) return;

    const tour = this.tourService.selectedTour();
    if (!tour) return;

    const existing = this.service.selectedLog();

    if (existing) {
      this.service.update({
        ...existing,

        date: this.date() + 'T' + this.time,

        comment: this.comment(),
        difficulty: this.difficulty(),
        rating: this.rating(),

        totalDistance: this.totalDistance(),
        totalTime: this.totalTime()
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



  dateError = computed(() => {
    if (this.date() === '' || this.time() === '') return 'Please select date and time';

    const selected = new Date(this.date() + 'T' + this.time());
    const now = new Date();

    if (selected > now) return 'Date cannot be in the future';

    return '';
  });

  distanceError = computed(() => {
    if (this.totalDistance() <= 0) return 'Distance must be greater than 0';
    if (this.totalDistance() > 2000) return 'Distance is too large';
    return '';
  });

  timeError = computed(() => {
    if (this.totalTime() <= 0) return 'Time must be greater than 0';
    if (this.totalTime() > 1440) return 'Max duration is 24h';
    return '';
  });
}
