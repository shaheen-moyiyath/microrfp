import { extractText } from 'unpdf';

export interface ExtractedPdfResult {
  text: string;
  pageCount: number;
  wordCount: number;
  isTruncated: boolean;
}

export type ExtractedPDFResult = ExtractedPdfResult;

const MAX_WORD_LIMIT = 150000;

export async function extractPdfText(pdfBuffer: Buffer): Promise<ExtractedPdfResult> {
  if (!pdfBuffer || pdfBuffer.length === 0) {
    throw new Error('PDF file buffer is empty');
  }

  try {
    const uint8 = new Uint8Array(pdfBuffer);
    const result = await extractText(uint8, { mergePages: true });

    const pageCount = result.totalPages || 1;
    const rawResultText = result.text as string | string[];
    let rawText = (
      typeof rawResultText === 'string'
        ? rawResultText
        : Array.isArray(rawResultText)
        ? (rawResultText as string[]).join('\n\n')
        : ''
    ).trim();

    const words = rawText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    if (wordCount < 50) {
      throw new Error(
        'This PDF appears to be a scanned image without readable text layers. Please run OCR on the PDF or upload a text-based document.'
      );
    }

    let isTruncated = false;
    let finalText = rawText;

    if (wordCount > MAX_WORD_LIMIT) {
      finalText = words.slice(0, MAX_WORD_LIMIT).join(' ');
      isTruncated = true;
    }

    return {
      text: finalText,
      pageCount,
      wordCount,
      isTruncated,
    };
  } catch (error: any) {
    if (
      error.message?.includes('password') ||
      error.name === 'PasswordException' ||
      error.message?.includes('Password')
    ) {
      throw new Error('The uploaded PDF is password protected. Please unlock it before analysis.');
    }
    console.error('PDF Extraction Error:', error);
    throw new Error(error.message || 'Failed to extract text from PDF document');
  }
}
