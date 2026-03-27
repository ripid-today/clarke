/**
 * Types for document extraction
 */

export interface ExtractOptions {
  /** Enable OCR for scanned documents */
  ocrEnabled?: boolean;
  /** Specific pages to extract (1-indexed) */
  pages?: number[];
}

export interface BoundingBox {
  /** Extracted text content */
  text: string;
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
  /** Width of the box */
  width: number;
  /** Height of the box */
  height: number;
}

export interface PageResult {
  /** Page number (1-indexed) */
  pageNumber: number;
  /** Extracted text for this page */
  text: string;
  /** Bounding boxes for text elements (if available) */
  boundingBoxes?: BoundingBox[];
}

export interface DocumentMetadata {
  /** Document title */
  title?: string;
  /** Document author */
  author?: string;
  /** Total page count */
  pageCount?: number;
  /** Creation date */
  creationDate?: string;
  /** Modification date */
  modificationDate?: string;
}

export interface ExtractResult {
  /** Full extracted text (all pages combined) */
  text: string;
  /** Per-page results */
  pages: PageResult[];
  /** Document metadata */
  metadata?: DocumentMetadata;
}
