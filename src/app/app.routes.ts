import { Routes } from '@angular/router';
import { TourComponent } from './features/tour/tour';
import { TourListComponent } from './features/tour/tour-list';
import { TourEditComponent } from './features/tour/tour-edit';
import {TourLogFormComponent} from './features/tour-log/tour-log-form';
import {TourLogListComponent} from './features/tour-log/tour-log-list';

export const routes: Routes = [
  { path: '', component: TourComponent }, // homepage
  { path: 'tours', component: TourListComponent },
  { path: 'edit', component: TourEditComponent },
  { path: 'logs', component: TourLogListComponent },
  { path: 'logs/new', component: TourLogFormComponent },
];
