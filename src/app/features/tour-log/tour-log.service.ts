import { Injectable, signal } from '@angular/core';
import { TourLog } from './tour-log.model';
import { Observable, of } from 'rxjs';
//TO DO import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TourLogService {
  // MOCK DATAS
  private mockLogs: TourLog[] = [
    {
      id: 1,
      tourId: 1,
      date: '2026-04-01',
      comment: 'Nice city walk',
      difficulty: 1,
      totalDistance: 5.2,
      totalTime: 40,
      rating: 4,
    },
    {
      id: 2,
      tourId: 1,
      date: '2026-04-02',
      comment: 'Second time better',
      difficulty: 2,
      totalDistance: 5.5,
      totalTime: 42,
      rating: 5,
    },
    {
      id: 3,
      tourId: 2,
      date: '2026-04-03',
      comment: 'Mountain hike',
      difficulty: 4,
      totalDistance: 14.8,
      totalTime: 130,
      rating: 5,
    },
    {
      id: 4,
      tourId: 2,
      date: '2026-04-04',
      comment: 'Very exhausting',
      difficulty: 5,
      totalDistance: 15.2,
      totalTime: 140,
      rating: 4,
    },
    {
      id: 5,
      tourId: 3,
      date: '2026-04-05',
      comment: 'Lakeside run',
      difficulty: 2,
      totalDistance: 8.6,
      totalTime: 65,
      rating: 4,
    },
    {
      id: 6,
      tourId: 4,
      date: '2026-04-06',
      comment: 'Too hot',
      difficulty: 3,
      totalDistance: 10.1,
      totalTime: 85,
      rating: 3,
    },
    {
      id: 7,
      tourId: 6,
      date: '2026-04-07',
      comment: 'Short but nice',
      difficulty: 1,
      totalDistance: 4.3,
      totalTime: 35,
      rating: 4,
    },
  ];
}
