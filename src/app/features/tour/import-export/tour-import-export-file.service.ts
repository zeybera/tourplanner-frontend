import { Injectable } from '@angular/core';
import { TourExport } from '../models/tour-export.model';

export type TourImportFile =
  | { type: 'json'; tours: TourExport[] }
  | { type: 'xml'; xml: string };

@Injectable({
  providedIn: 'root',
})
export class TourImportExportFileService {
  readImportFile(file: File): Promise<TourImportFile> {
    return this.readFileAsText(file).then((content) => {
      if (file.name.toLowerCase().endsWith('.xml')) {
        return {
          type: 'xml',
          xml: this.normalizeTourXmlImport(content),
        };
      }

      const parsedImport = JSON.parse(content) as TourExport | TourExport[];
      const tours = Array.isArray(parsedImport) ? parsedImport : [parsedImport];

      return {
        type: 'json',
        tours,
      };
    });
  }

  downloadBlob(blob: Blob, filename: string): void {
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = downloadUrl;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
  }

  private readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);

      reader.readAsText(file);
    });
  }

  private normalizeTourXmlImport(xml: string): string {
    const parser = new DOMParser();
    const document = parser.parseFromString(xml, 'application/xml');

    if (document.querySelector('parsererror')) {
      throw new Error('Invalid XML import file');
    }

    const root = document.documentElement;

    if (root.localName === 'tours') {
      return xml;
    }

    if (root.localName === 'tour') {
      const serializer = new XMLSerializer();
      return `<tours>${serializer.serializeToString(root)}</tours>`;
    }

    throw new Error('Unsupported XML import format');
  }
}
