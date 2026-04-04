import { Routes } from '@angular/router';
import { TourComponent } from './features/tour/tour';
import { TourListComponent } from './features/tour/tour-list';

export const routes: Routes = [
{ path: '', component: TourComponent }, // homepage 
{ path: 'tours', component: TourListComponent },
];
