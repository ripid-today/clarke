#!/usr/bin/env node

import { Command } from 'commander';
import { extractDocument, parsePageRange } from './extract.js';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const program = new Command();

program
  .name('extract-doc')
  .description('Extract text from documents using liteparse')
  .version('1.0.0')
  .argument('<file>', 'Path to document file (PDF, DOCX, PPTX, XLSX, or image)')
  .option('-o, --output <path>', 'Output file path (default: stdout)')
  .option('--ocr', 'Enable OCR for scanned documents', false)
  .option('-p, --pages <pages>', 'Specific pages to extract (e.g., "1,3,5-7")')
  .option('--json', 'Output as JSON with metadata (default: plain text)', false)
  .action(async (file: string, options: {
    output?: string;
    ocr: boolean;
    pages?: string;
    json: boolean;
  }) => {
    try {
      // Resolve file path
      const filePath = resolve(file);

      // Parse page numbers if provided
      const pageNumbers = options.pages
        ? parsePageRange(options.pages)
        : undefined;

      console.error(`Extracting from: ${filePath}`);
      if (pageNumbers) {
        console.error(`Pages: ${pageNumbers.join(', ')}`);
      }
      if (options.ocr) {
        console.error('OCR: enabled');
      }

      // Extract document
      const result = await extractDocument(filePath, {
        ocrEnabled: options.ocr,
        pages: pageNumbers,
      });

      // Format output
      const output = options.json
        ? JSON.stringify(result, null, 2)
        : result.text;

      // Write output
      if (options.output) {
        writeFileSync(options.output, output, 'utf-8');
        console.error(`\nExtracted text saved to: ${options.output}`);
        console.error(`Total pages: ${result.pages.length}`);
        console.error(`Total characters: ${result.text.length}`);
      } else {
        // Print to stdout
        console.log(output);
      }
    } catch (error) {
      console.error('\nError extracting document:');
      if (error instanceof Error) {
        console.error(`  ${error.message}`);

        // Provide helpful hints for common errors
        if (error.message.includes('LibreOffice')) {
          console.error('\nHint: Install LibreOffice for DOCX/PPTX/XLSX support:');
          console.error('  Windows: choco install libreoffice');
          console.error('  macOS: brew install libreoffice');
          console.error('  Linux: sudo apt install libreoffice');
        }
        if (error.message.includes('OCR') || error.message.includes('ImageMagick')) {
          console.error('\nHint: Install ImageMagick for OCR support:');
          console.error('  Windows: choco install imagemagick');
          console.error('  macOS: brew install imagemagick');
          console.error('  Linux: sudo apt install imagemagick');
        }
      } else {
        console.error(`  ${String(error)}`);
      }
      process.exit(1);
    }
  });

program.parse();
