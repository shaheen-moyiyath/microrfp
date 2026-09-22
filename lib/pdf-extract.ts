// ============================================================================
// 1. NODE.JS SERVERLESS DOM POLYFILLS (MUST BE AT TOP OF FILE)
// Fixes "ReferenceError: DOMMatrix is not defined" on Vercel Serverless Node.js
// ============================================================================
if (typeof window === 'undefined') {
  if (!(global as any).DOMMatrix) {
    (global as any).DOMMatrix = class DOMMatrix {
      a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
      constructor() {}
    };
  }
}

import pdfParse from 'pdf-parse';

export interface ExtractedPdfResult {
  text: string;
  pageCount: number;
  wordCount: number;
  isTruncated: boolean;
}

export async function extractPdfText(buffer: Buffer): Promise<ExtractedPdfResult> {
  try {
    const data = await pdfParse(buffer);
    const rawText = data.text || '';
    const pageCount = data.numpages || 1;

    const words = rawText.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Scanned image / non-OCR PDF guard
    if (wordCount < 50) {
      throw new Error(
        'This PDF appears to be a scanned image without readable text layers. Please run OCR on the PDF or upload a text-based document.'
      );
    }

    // Context limit safety guard (150,000 words max)
    const MAX_WORDS = 150000;
    let isTruncated = false;
    let finalText = rawText;

    if (wordCount > MAX_WORDS) {
      finalText = words.slice(0, MAX_WORDS).join(' ');
      isTruncated = true;
    }

    return {
      text: finalText,
      pageCount,
      wordCount,
      isTruncated,
    };
  } catch (error: any) {
    console.error('PDF Extraction Error:', error);
    throw new Error(error.message || 'Failed to extract text from PDF.');
  }
}
