import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
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

  // The tour whose route we want to display.
  // The parent component (tour-details) passes this in via [tour]="tour".
  @Input() tour!: Tour;

  // A reference to the <div> in the HTML template where Leaflet draws the map.
  // #mapContainer in the template matches this @ViewChild.
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  // The Leaflet map instance. We create it in ngAfterViewInit and destroy it in ngOnDestroy.
  private map: L.Map | null = null;

  // A layer group that holds all route lines and markers for the current tour.
  // We keep it as a field so we can remove and re-add it when the tour changes.
  private routeLayer: L.LayerGroup | null = null;

  // ResizeObserver watches the map container div for size changes (e.g. panel resizes).
  // When the container size changes, we tell Leaflet to recalculate the map size.
  private resizeObserver: ResizeObserver | null = null;

  // We use requestAnimationFrame to avoid calling invalidateSize() too many times
  // in a row (e.g. during a CSS transition). This stores the current frame ID.
  private resizeAnimationFrame: number | null = null;

  // ngAfterViewInit is called by Angular once the template (the <div #mapContainer>)
  // is ready in the DOM. We can only create the Leaflet map after that.
  ngAfterViewInit(): void {
    // Create the Leaflet map inside our container div.
    // scrollWheelZoom: false prevents accidental zoom when the user scrolls the page.
    this.map = L.map(this.mapContainer.nativeElement, {
      scrollWheelZoom: false,
    });

    // Add OpenStreetMap tiles as the background of the map.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    // Draw the tour route for the first time.
    this.renderTour();

    // Make sure the map fills its container correctly right away.
    this.invalidateMapSize();

    // Watch for container size changes and update the map layout when they happen.
    this.resizeObserver = new ResizeObserver(() => {
      this.invalidateMapSize();
    });
    this.resizeObserver.observe(this.mapContainer.nativeElement);
  }

  // ngOnChanges is called by Angular whenever an @Input property changes.
  // When the user selects a different tour, [tour]="tour" updates, so we re-draw the route.
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tour'] && this.map) {
      this.renderTour();
    }
  }

  // ngOnDestroy is called when the component is removed from the page.
  // We clean up the ResizeObserver and destroy the Leaflet map to avoid memory leaks.
  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    if (this.resizeAnimationFrame != null) {
      cancelAnimationFrame(this.resizeAnimationFrame);
    }
    this.map?.remove();
  }

  // Draws the tour route, start marker, and end marker on the map.
  // Called when the component first loads and whenever the tour input changes.
  private renderTour(): void {
    if (!this.map) return;

    // Remove the previous route and markers before drawing the new ones.
    this.routeLayer?.remove();
    this.routeLayer = L.layerGroup().addTo(this.map);

    // Convert the tour's start/end coordinates to Leaflet LatLng objects.
    // fromLatitude/fromLongitude and toLatitude/toLongitude are saved when the tour is created.
    const start = this.toLatLng(this.tour.fromLatitude, this.tour.fromLongitude);
    const end = this.toLatLng(this.tour.toLatitude, this.tour.toLongitude);

    // Decode the routeInformation string (encoded polyline from OpenRouteService)
    // into an array of LatLng points that Leaflet can use to draw a line.
    const route = this.decodeRoute(this.tour.routeInformation);

    // bounds will be expanded to include all route points and markers.
    // At the end we use fitBounds() so the map zooms to show the whole route.
    const bounds = L.latLngBounds([]);

    // If we have route points, draw a blue polyline connecting them.
    if (route.length > 0) {
      L.polyline(route, {
        color: '#2563eb',
        weight: 5,
        opacity: 0.85,
      }).addTo(this.routeLayer);

      // Expand the bounds to include every point in the route.
      route.forEach(point => bounds.extend(point));
    }

    // Draw a green circle at the starting location.
    if (start) {
      L.circleMarker(start, {
        radius: 7,
        color: '#14532d',
        fillColor: '#22c55e',
        fillOpacity: 1,
      }).bindPopup('Start').addTo(this.routeLayer);

      bounds.extend(start);
    }

    // Draw a red circle at the destination.
    if (end) {
      L.circleMarker(end, {
        radius: 7,
        color: '#7f1d1d',
        fillColor: '#ef4444',
        fillOpacity: 1,
      }).bindPopup('Destination').addTo(this.routeLayer);

      bounds.extend(end);
    }

    // Zoom and pan the map to fit all the route points and markers.
    // If we have no valid points at all (no coordinates saved), fall back to Vienna.
    if (bounds.isValid()) {
      this.map.fitBounds(bounds, { padding: [24, 24] });
    } else {
      this.map.setView([48.2082, 16.3738], 12);
    }

    this.invalidateMapSize();
  }

  // Converts a nullable latitude/longitude pair to a Leaflet LatLng.
  // Returns null if either value is missing (tour was created without geocoding).
  private toLatLng(latitude: number | null, longitude: number | null): L.LatLng | null {
    if (latitude == null || longitude == null) return null;

    return L.latLng(latitude, longitude);
  }

  // Decodes the encoded polyline string stored in tour.routeInformation.
  // OpenRouteService returns the route geometry as an encoded polyline string.
  // decodePolyline() converts that string into an array of LatLng points.
  // Returns an empty array if there is no route data yet.
  private decodeRoute(encoded: string | null): L.LatLng[] {
    if (!encoded) return [];

    try {
      return decodePolyline(encoded);
    } catch {
      // If decoding fails (e.g. the string is corrupted), show no route line.
      return [];
    }
  }

  // Tells Leaflet to recalculate the map size after a layout change.
  // We use requestAnimationFrame to wait until the browser has finished painting,
  // and we skip the call if the container still has zero size.
  private invalidateMapSize(): void {
    // If a frame is already scheduled, do not schedule another one.
    if (this.resizeAnimationFrame != null) return;

    this.resizeAnimationFrame = requestAnimationFrame(() => {
      this.resizeAnimationFrame = null;

      if (!this.map) return;

      // Skip if the container has no visible size yet (e.g. hidden panel).
      const rect = this.mapContainer.nativeElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      this.map.invalidateSize();
    });
  }
}
