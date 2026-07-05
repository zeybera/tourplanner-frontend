export interface TourLog {
  id: number;
  tourId: number;

  date: string;  //date + time
  //time: number;
  comment: string;

  difficulty: number;
  rating: number;

  totalDistance: number;
  totalTime: number;

  photoData?: string | null;
}
