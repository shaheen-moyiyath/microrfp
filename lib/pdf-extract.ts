import { PDFParse } from 'pdf-parse';

export interface ExtractedPDFResult {
  text: string;
  pageCount: number;
  wordCount: number;
  isTruncated: boolean;
}

const MAX_WORD_LIMIT = 150000;

export async function extractPdfText(pdfBuffer: Buffer): Promise<ExtractedPDFResult> {
  if (!pdfBuffer || pdfBuffer.length === 0) {
    throw new Error('PDF file buffer is empty');
  }

  let parser: InstanceType<typeof PDFParse> | null = null;
  try {
    parser = new PDFParse({ data: pdfBuffer });
    const result = await parser.getText();
    const pageCount = result.total || result.pages?.length || 1;
    let rawText = (result.text || '').trim();

    const words = rawText.trim().split(/\s+/).filter(Boolean);
    if (words.length < 50) {
      throw new Error(
        'This PDF appears to be a scanned image without readable text layers. Please run OCR on the PDF or upload a text-based document.'
      );
    }

    // Word count calculation and truncation protection
    const totalWords = words.length;
    let isTruncated = false;

    if (totalWords > MAX_WORD_LIMIT) {
      rawText =
        words.slice(0, MAX_WORD_LIMIT).join(' ') +
        '\n\n[NOTICE: Document truncated at 150,000 words for optimal context processing]';
      isTruncated = true;
    }

    return {
      text: rawText,
      pageCount,
      wordCount: totalWords,
      isTruncated,
    };
  } catch (error: any) {
    if (error.message?.includes('password') || error.name === 'PasswordException') {
      throw new Error('The uploaded PDF is password protected. Please unlock it before analysis.');
    }
    throw new Error(error.message || 'Failed to extract text from PDF document');
  } finally {
    if (parser) {
      try {
        await parser.destroy();
      } catch {
        // Ignore cleanup errors
      }
    }
  }
}
