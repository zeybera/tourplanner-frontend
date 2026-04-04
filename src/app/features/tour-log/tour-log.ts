import { Component, signal, input } from '@angular/core';
import { inject } from '@angular/core';
import { TourLogService } from './tour-log.service';


@Component({
  selector: 'app-tour-log-form',
  standalone: true,
  templateUrl: './tour-log.html'
})

export class TourLogFormComponent {

private service = inject(TourLogService);


  tourId = input<number>();

  // STATE
  comment = signal('');
  difficulty = signal(0);
  rating = signal(0);

  //event handler
  onCommentInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.comment.set(value);
  }

  onDifficultyInput(event: Event): void {}

  onRatingInput(event: Event): void {}

  create(): void {}
 
}