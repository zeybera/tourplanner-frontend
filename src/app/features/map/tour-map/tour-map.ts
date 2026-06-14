import { Component, ElementRef, ViewChild, inject, effect, afterNextRender } from '@angular/core';
import { map, tileLayer, polyline, circleMarker, TileLayer, type Map } from 'leaflet';
import { TourService } from '../../tour/tour.service';
import { decodePolyline } from './polyline-decoder';

@Component({
  selector: 'app-tour-map',
  standalone: true,
  templateUrl: './tour-map.html',
  styleUrls: ['./tour-map.css'],
})
export class TourMapComponent {

  // We read the selected tour directly from the service signal
  private tourService = inject(TourService);

  // This connects to the <div #mapContainer> in our HTML file
  // Leaflet needs a real HTML element to draw the map inside
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  // We save the map here so we can use it in other methods
  private map: Map | null = null;

  constructor() {
    // afterNextRender runs once after the HTML is ready and creates the map
    afterNextRender(() => {
      // Step 1: Create the Leaflet map inside our div element
      this.map = map(this.mapContainer.nativeElement, {
        scrollWheelZoom: false, // do not zoom when user scrolls the page
      });

      // Step 2: Add the map background (OpenStreetMap tiles)
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.map);

      // Step 3: Draw the route for the current selected tour
      this.drawRoute();

      // Step 4: Tell Leaflet to recalculate the map size
      // We use a small delay because the div sometimes has no size yet at this point
      setTimeout(() => this.map?.invalidateSize(), 200);
    });

    // When the selected tour changes, redraw the route automatically
    effect(() => {
      const tour = this.tourService.selectedTour();
      if (this.map && tour) {
        this.drawRoute();
      }
    });
  }

  // This method draws the route line and the start and end markers on the map
  private drawRoute(): void {
    if (!this.map) return;

    const tour = this.tourService.selectedTour();
    if (!tour) return;

    // Remove all existing layers except the tile layer (map background)
    // This is necessary so old routes are cleared before we draw the new one
    this.map.eachLayer(layer => {
      if (!(layer instanceof TileLayer)) {
        layer.remove();
      }
    });

    // The backend saves the route as an encoded string from OpenRouteService
    // We need to decode this string into a list of [latitude, longitude] points
    const routePoints = decodePolyline(tour.routeInformation ?? '');

    // Draw a blue line to show the route on the map
    if (routePoints.length > 0) {
      const routeLine = polyline(routePoints, { color: 'blue', weight: 4 }).addTo(this.map);

      // Zoom the map automatically so the whole route fits on the screen
      this.map.fitBounds(routeLine.getBounds(), { padding: [20, 20] });
    }

    // Draw a green circle marker at the start location
    if (tour.fromLatitude && tour.fromLongitude) {
      circleMarker([tour.fromLatitude, tour.fromLongitude], {
        radius: 8,
        color: 'green',
        fillColor: 'green',
        fillOpacity: 1,
      })
        .bindPopup('Start: ' + tour.fromLocation)
        .addTo(this.map);
    }

    // Draw a red circle marker at the end location
    if (tour.toLatitude && tour.toLongitude) {
      circleMarker([tour.toLatitude, tour.toLongitude], {
        radius: 8,
        color: 'red',
        fillColor: 'red',
        fillOpacity: 1,
      })
        .bindPopup('End: ' + tour.toLocation)
        .addTo(this.map);
    }

    // If we have no route and no coordinates, show Vienna as a default location
    if (routePoints.length == 0 && !tour.fromLatitude) {
      this.map.setView([48.2082, 16.3738], 12);
    }
  }
}
