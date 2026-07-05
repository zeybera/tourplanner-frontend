import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourListComponent } from '../tour-list/tour-list';
import { TourService } from '../tour.service';
import { TourDetailsComponent } from '../tour-details/tour-details';
import { ActivatedRoute, Router } from '@angular/router';
import { CardComponent } from '../../../shared/card/card';
import { Tour } from '../models/tour.model';
import { TourImportExportFileService } from '../import-export/tour-import-export-file.service';

@Component({
  selector: 'app-tour-overview',
  standalone: true,
  imports: [CommonModule, TourListComponent, CardComponent, TourDetailsComponent],
  templateUrl: './tour-overview.html',
  styleUrls: ['./tour-overview.css'],
})
export class TourOverviewComponent implements OnInit {
  service = inject(TourService);
  private importExportFiles = inject(TourImportExportFileService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  importExportMessage = '';
  showCreateChoice = false;

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      if (params.get('create') === 'tour') {
        this.openCreateChoice();
      }
    });
  }

  goToCreate(): void {
    this.showCreateChoice = false;
    this.router.navigate(['/create']);
  }

  openCreateChoice(): void {
    this.importExportMessage = '';
    this.showCreateChoice = true;
  }

  closeCreateChoice(): void {
    this.showCreateChoice = false;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { create: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  delete(id: number): void {
    this.service.delete(id);
  }

  edit(tour: Tour): void {
    this.service.selectTour(tour.id);
    this.router.navigate(['/edit']);
  }

  openLogs(tour: Tour): void {
    this.service.selectTour(tour.id);
    this.router.navigate(['/logs']);
  }

  // Called every time the user types in the search input.
  // Only updates the query signal so the input stays in sync.
  // Clears backend results when the input is empty.
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value;
    this.service.setSearchQuery(query);
  }

  // Called when the user clicks the Search button.
  // Sends the current query to the backend via GET /api/tours/search?q=...
  onSearchSubmit(): void {
    const query = this.service.searchQuery();
    this.service.searchTours(query);
  }

  importTours(event: Event): void {
    this.importExportMessage = '';

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.importExportFiles
      .readImportFile(file)
      .then((importFile) => {
        if (importFile.type === 'xml') {
          this.service.importToursXml(importFile.xml).subscribe({
            next: () => this.handleImportSuccess('XML import finished.', input),
            error: () => this.handleImportError('XML import failed.', input),
          });
          return;
        }

        this.service.importTours(importFile.tours).subscribe({
          next: () => this.handleImportSuccess('Import finished.', input),
          error: () => this.handleImportError('Import failed.', input),
        });
      })
      .catch(() => {
        this.importExportMessage = 'Import file is not valid JSON or XML.';
        input.value = '';
      });
  }

  private handleImportSuccess(message: string, input: HTMLInputElement): void {
    this.importExportMessage = message;
    this.showCreateChoice = false;
    input.value = '';
  }

  private handleImportError(message: string, input: HTMLInputElement): void {
    this.importExportMessage = message;
    input.value = '';
  }
}
