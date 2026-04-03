import { Component, signal, inject, input } from '@angular/core';
import { TourLogService } from './model/tour-log.service';

@Component({
  selector: 'app-tour-log-form',
  standalone: true,
  templateUrl: './tour-log-form.component.html'
})
export class TourLogFormComponent {

  private service = inject(TourLogService);

  tourId = input<number>();

  // 🔥 STATE (ViewModel)
  comment = signal('');
  difficulty = signal(1);
  totalDistance = signal(0);
  totalTime = signal(0);
  rating = signal(1);

  // 🔥 ACTION
  create(): void {
    this.service.create({
      tourId: this.tourId()!,
      date: new Date().toISOString().split('T')[0],
      comment: this.comment(),
      difficulty: this.difficulty(),
      totalDistance: this.totalDistance(),
      totalTime: this.totalTime(),
      rating: this.rating()
    });

    // reset form
    this.comment.set('');
    this.difficulty.set(1);
    this.totalDistance.set(0);
    this.totalTime.set(0);
    this.rating.set(1);
  }
}