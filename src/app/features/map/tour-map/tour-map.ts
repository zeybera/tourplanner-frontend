import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { Tour } from '../../tour/tour.model';
import { decodePolyline } from './polyline-decoder';

@Component({
  selector: 'app-tour-map',
  standalone: true,
  templateUrl: './tour-map.html',
  styleUrls: ['./tour-map.css'],
})
export class TourMapComponent implements AfterViewInit, OnChanges, OnDestroy {

  // The tour object that the parent component passes to us
  @Input() tour!: Tour;

  // This connects to the <div #mapContainer> in our HTML file
  // Leaflet needs a real HTML element to draw the map inside
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  // We save the map here so we can use it in other methods
  private map: L.Map | null = null;

  // Angular calls this method after the HTML is ready
  // We cannot create the map before this because the div does not exist yet
  ngAfterViewInit(): void {
    // Step 1: Create the Leaflet map inside our div element
    this.map = L.map(this.mapContainer.nativeElement, {
      scrollWheelZoom: false, // do not zoom when user scrolls the page
    });

    // Step 2: Add the map background (OpenStreetMap tiles)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    // Step 3: Draw the tour route for the first time
    this.drawRoute();

    // Step 4: Tell Leaflet to recalculate the map size
    // We use a small delay because the div sometimes has no size yet at this point
    setTimeout(() => this.map?.invalidateSize(), 200);
  }

  // Angular calls this method when the tour input changes
  // For example, when the user selects a different tour from the list
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tour'] && this.map) {
      this.drawRoute();
    }
  }

  // Angular calls this when the component is removed from the page
  // We destroy the map so it does not use memory anymore
  ngOnDestroy(): void {
    this.map?.remove();
  }

  // This method draws the route line and the start and end markers on the map
  private drawRoute(): void {
    if (!this.map) return;

    // Remove all existing layers except the tile layer (map background)
    // This is necessary so old routes are cleared before we draw the new one
    this.map.eachLayer(layer => {
      if (!(layer instanceof L.TileLayer)) {
        layer.remove();
      }
    });

    // The backend saves the route as an encoded string from OpenRouteService
    // We need to decode this string into a list of [latitude, longitude] points
    // The decodePolyline function does this conversion for us
    const routePoints = decodePolyline(this.tour.routeInformation ?? '');

    // Draw a blue line to show the route on the map
    if (routePoints.length > 0) {
      const routeLine = L.polyline(routePoints, { color: 'blue', weight: 4 }).addTo(this.map);

      // Zoom the map automatically so the whole route fits on the screen
      this.map.fitBounds(routeLine.getBounds(), { padding: [20, 20] });
    }

    // Draw a green circle marker at the start location
    if (this.tour.fromLatitude && this.tour.fromLongitude) {
      L.circleMarker([this.tour.fromLatitude, this.tour.fromLongitude], {
        radius: 8,
        color: 'green',
        fillColor: 'green',
        fillOpacity: 1,
      })
        .bindPopup('Start: ' + this.tour.fromLocation)
        .addTo(this.map);
    }

    // Draw a red circle marker at the end location
    if (this.tour.toLatitude && this.tour.toLongitude) {
      L.circleMarker([this.tour.toLatitude, this.tour.toLongitude], {
        radius: 8,
        color: 'red',
        fillColor: 'red',
        fillOpacity: 1,
      })
        .bindPopup('End: ' + this.tour.toLocation)
        .addTo(this.map);
    }

    // If we have no route and no coordinates, show Vienna as a default location
    if (routePoints.length === 0 && !this.tour.fromLatitude) {
      this.map.setView([48.2082, 16.3738], 12);
    }
  }
}
