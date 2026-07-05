import { TestBed } from '@angular/core/testing';
import { TourImportExportFileService } from './tour-import-export-file.service';

describe('TourImportExportFileService', () => {
  let service: TourImportExportFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourImportExportFileService);
  });

  // Checks that a single exported JSON tour is converted into an import list.
  it('reads a single JSON tour as a list', async () => {
    const file = new File([
      JSON.stringify({
        name: 'Imported tour',
        fromLocation: 'Vienna',
        toLocation: 'Graz',
      }),
    ], 'tour.json', { type: 'application/json' });

    const result = await service.readImportFile(file);

    expect(result.type).toBe('json');
    if (result.type === 'json') {
      expect(result.tours.length).toBe(1);
      expect(result.tours[0].name).toBe('Imported tour');
    }
  });

  // Checks that an exported XML list keeps its tours root element.
  it('keeps XML tour lists unchanged for import', async () => {
    const xml = '<tours><tour><name>Tour list item</name></tour></tours>';
    const file = new File([xml], 'tours.xml', { type: 'application/xml' });

    const result = await service.readImportFile(file);

    expect(result.type).toBe('xml');
    if (result.type === 'xml') {
      expect(result.xml).toBe(xml);
    }
  });

  // Checks that a single exported XML tour is wrapped so the backend can import it.
  it('wraps a single XML tour for backend import', async () => {
    const file = new File(['<tour><name>Single tour</name></tour>'], 'tour.xml', {
      type: 'application/xml',
    });

    const result = await service.readImportFile(file);

    expect(result.type).toBe('xml');
    if (result.type === 'xml') {
      expect(result.xml).toBe('<tours><tour><name>Single tour</name></tour></tours>');
    }
  });
});
