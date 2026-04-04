export interface TourLog {
  id: number;
  tourId: number;

  date: string;
  comment: string;

  difficulty: number;
  rating: number;

  totalDistance: number; // API
  totalTime: number;     // API
}