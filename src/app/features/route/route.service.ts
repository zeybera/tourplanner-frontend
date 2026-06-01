import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../../shared/api';
import { GeocodeFeature } from './geocode.model';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private http = inject(HttpClient);
  private apiUrl = `${API.apiBaseUrl}/api/routes`;

  geocode(text: string) {
    return this.http.get<GeocodeFeature[]>(`${this.apiUrl}/geocode`, {
      params: { text },
    });
  }
}
