import { LiteParse } from '@llamaindex/liteparse';
import type { ExtractOptions, ExtractResult, PageResult } from './types.js';

/**
 * Extract text and metadata from a document file
 * @param filePath - Path to the document file
 * @param options - Extraction options
 * @returns Extracted text, pages, and metadata
 */
export async function extractDocument(
  filePath: string,
  options: ExtractOptions = {}
): Promise<ExtractResult> {
  const parser = new LiteParse({
    ocrEnabled: options.ocrEnabled ?? false,
  });

  const result = await parser.parse(filePath);

  // Transform liteparse result to our format
  const pages: PageResult[] = result.pages?.map((page: any, index: number) => ({
    pageNumber: index + 1,
    text: page.text || '',
    boundingBoxes: page.boundingBoxes?.map((box: any) => ({
      text: box.text || '',
      x: box.x || 0,
      y: box.y || 0,
      width: box.width || 0,
      height: box.height || 0,
    })),
  })) || [];

  // Filter to specific pages if requested
  const filteredPages = options.pages && options.pages.length > 0
    ? pages.filter(p => options.pages!.includes(p.pageNumber))
    : pages;

  // Reconstruct full text from filtered pages
  const fullText = filteredPages.map(p => p.text).join('\n\n');

  return {
    text: fullText,
    pages: filteredPages,
    metadata: {
      title: result.metadata?.title,
      author: result.metadata?.author,
      pageCount: result.metadata?.pageCount || pages.length,
      creationDate: result.metadata?.creationDate,
      modificationDate: result.metadata?.modificationDate,
    },
  };
}

/**
 * Parse page range string (e.g., "1,3,5-7" to [1,3,5,6,7])
 * @param rangeStr - Range string like "1,3,5-7" or "1-5"
 * @returns Array of page numbers
 */
export function parsePageRange(rangeStr: string): number[] {
  const pages: number[] = [];
  const parts = rangeStr.split(',');

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map(s => parseInt(s.trim(), 10));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
      }
    } else {
      const page = parseInt(trimmed, 10);
      if (!isNaN(page)) {
        pages.push(page);
      }
    }
  }

  return [...new Set(pages)].sort((a, b) => a - b);
}
