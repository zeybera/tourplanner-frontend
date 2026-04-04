import { Routes } from '@angular/router';
import { TourComponent } from './features/tour/tour';
import { TourListComponent } from './features/tour/tour-list';
import { TourEditComponent } from './features/tour/tour-edit';

export const routes: Routes = [
{ path: '', component: TourComponent }, // homepage 
{ path: 'tours', component: TourListComponent },
{ path: 'edit', component: TourEditComponent }
];
