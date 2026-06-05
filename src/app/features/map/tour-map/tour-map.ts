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
  @Input() tour!: Tour;
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  private map: L.Map | null = null;
  private routeLayer: L.LayerGroup | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private resizeAnimationFrame: number | null = null;

  ngAfterViewInit(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.renderTour();
    this.invalidateMapSize();

    this.resizeObserver = new ResizeObserver(() => {
      this.invalidateMapSize();
    });
    this.resizeObserver.observe(this.mapContainer.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tour'] && this.map) {
      this.renderTour();
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    if (this.resizeAnimationFrame != null) {
      cancelAnimationFrame(this.resizeAnimationFrame);
    }
    this.map?.remove();
  }

  private renderTour(): void {
    if (!this.map) return;

    this.routeLayer?.remove();
    this.routeLayer = L.layerGroup().addTo(this.map);

    const start = this.toLatLng(this.tour.fromLatitude, this.tour.fromLongitude);
    const end = this.toLatLng(this.tour.toLatitude, this.tour.toLongitude);
    const route = this.decodeRoute(this.tour.routeInformation);
    const bounds = L.latLngBounds([]);

    if (route.length > 0) {
      L.polyline(route, {
        color: '#2563eb',
        weight: 5,
        opacity: 0.85,
      }).addTo(this.routeLayer);
      route.forEach(point => bounds.extend(point));
    }

    if (start) {
      L.circleMarker(start, {
        radius: 7,
        color: '#14532d',
        fillColor: '#22c55e',
        fillOpacity: 1,
      }).bindPopup('Start').addTo(this.routeLayer);
      bounds.extend(start);
    }

    if (end) {
      L.circleMarker(end, {
        radius: 7,
        color: '#7f1d1d',
        fillColor: '#ef4444',
        fillOpacity: 1,
      }).bindPopup('Destination').addTo(this.routeLayer);
      bounds.extend(end);
    }

    if (bounds.isValid()) {
      this.map.fitBounds(bounds, { padding: [24, 24] });
    } else {
      this.map.setView([48.2082, 16.3738], 12);
    }

    this.invalidateMapSize();
  }

  private toLatLng(latitude: number | null, longitude: number | null): L.LatLng | null {
    if (latitude == null || longitude == null) return null;

    return L.latLng(latitude, longitude);
  }

  private decodeRoute(encoded: string | null): L.LatLng[] {
    if (!encoded) return [];

    try {
      return decodePolyline(encoded);
    } catch {
      return [];
    }
  }

  private invalidateMapSize(): void {
    if (this.resizeAnimationFrame != null) return;

    this.resizeAnimationFrame = requestAnimationFrame(() => {
      this.resizeAnimationFrame = null;

      if (!this.map) return;

      const rect = this.mapContainer.nativeElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      this.map.invalidateSize();
    });
  }
}
