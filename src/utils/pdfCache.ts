import { PDFDocument } from 'pdf-lib';

interface CachedPDF {
  buffer: ArrayBuffer;
  document: PDFDocument;
  timestamp: number;
}

class PDFCache {
  private static instance: PDFCache;
  private cache: Map<string, CachedPDF>;
  private readonly maxAge = 1000 * 60 * 30; // 30 minutes

  private constructor() {
    this.cache = new Map();
  }

  static getInstance(): PDFCache {
    if (!PDFCache.instance) {
      PDFCache.instance = new PDFCache();
    }
    return PDFCache.instance;
  }

  async getDocument(file: File): Promise<PDFDocument> {
    const key = await this.generateCacheKey(file);
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.timestamp < this.maxAge) {
      return cached.document;
    }

    const buffer = await file.arrayBuffer();
    const document = await PDFDocument.load(buffer, {
      ignoreEncryption: true,
      updateMetadata: false
    });

    this.cache.set(key, {
      buffer,
      document,
      timestamp: Date.now()
    });

    return document;
  }

  private async generateCacheKey(file: File): Promise<string> {
    const { name, size, lastModified } = file;
    return `${name}-${size}-${lastModified}`;
  }

  clearCache() {
    this.cache.clear();
  }
}

export const pdfCache = PDFCache.getInstance();