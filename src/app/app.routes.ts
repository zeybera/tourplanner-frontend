import { Routes } from '@angular/router';
import { TourComponent } from './features/tour/tour-creation/tour';
import { TourListComponent } from './features/tour/tour-list/tour-list';
import { TourEditComponent } from './features/tour/tour-edit/tour-edit';
import {TourLogFormComponent} from './features/tour-log/tour-log-form/tour-log-form';
import {TourLogListComponent} from './features/tour-log/tour-log-list/tour-log-list';
import {TourOverviewComponent} from './features/tour/tour-overview/tour-overview';

export const routes: Routes = [
  //{ path: '', component: TourComponent }, // homepage
  { path: '', redirectTo: 'tours', pathMatch: 'full' },
  { path: 'tours', component: TourOverviewComponent },

  { path: 'create', component: TourComponent },
  { path: 'edit', component: TourEditComponent },

  { path: 'logs', component: TourLogListComponent },
  { path: 'logs/new', component: TourLogFormComponent },
  { path: 'logs/edit', component: TourLogFormComponent },
];
