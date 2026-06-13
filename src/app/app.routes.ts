import { Routes } from '@angular/router';
import { TourComponent } from './features/tour/tour-creation/tour';
import { TourListComponent } from './features/tour/tour-list/tour-list';
import { TourEditComponent } from './features/tour/tour-edit/tour-edit';
import {TourLogFormComponent} from './features/tour-log/tour-log-form/tour-log-form';
import {TourLogListComponent} from './features/tour-log/tour-log-list/tour-log-list';
import {TourOverviewComponent} from './features/tour/tour-overview/tour-overview';
import { authGuard } from './shared/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'tours', pathMatch: 'full' },
  { path: 'tours', component: TourOverviewComponent, canActivate: [authGuard] },

  { path: 'create', component: TourComponent, canActivate: [authGuard] },
  { path: 'edit', component: TourEditComponent, canActivate: [authGuard] },

  { path: 'logs', component: TourLogListComponent, canActivate: [authGuard] },
  { path: 'logs/new', component: TourLogFormComponent, canActivate: [authGuard] },
  { path: 'logs/edit', component: TourLogFormComponent, canActivate: [authGuard] },
];
