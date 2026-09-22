import { NextRequest, NextResponse } from 'next/server';
import { extractPdfText } from '@/lib/pdf-extract';
import { analyzeRFPWithGemini } from '@/lib/gemini';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let rfpText = '';
    let pageCount = 1;
    let wordCount = 0;
    let isTruncated = false;
    let customApiKey: string | undefined;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      customApiKey = (formData.get('apiKey') as string) || undefined;

      if (!file) {
        return NextResponse.json(
          { error: 'No PDF file was uploaded in the request.' },
          { status: 400 }
        );
      }

      // Check file size (max 20MB to prevent memory spikes on serverless execution)
      const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'File size exceeds the 20MB limit.' },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const extracted = await extractPdfText(buffer);
      rfpText = extracted.text;
      pageCount = extracted.pageCount;
      wordCount = extracted.wordCount;
      isTruncated = extracted.isTruncated;
    } else if (contentType.includes('application/json')) {
      const body = await request.json();
      rfpText = body.rfpText;
      customApiKey = body.apiKey;

      if (!rfpText || rfpText.trim().length < 50) {
        return NextResponse.json(
          { error: 'RFP text is too short or empty for analysis.' },
          { status: 400 }
        );
      }

      wordCount = rfpText.split(/\s+/).length;
    } else {
      return NextResponse.json(
        { error: 'Unsupported Content-Type. Send multipart/form-data or application/json.' },
        { status: 415 }
      );
    }

    // Call Gemini API with low temperature and structured output schema
    const analysis = await analyzeRFPWithGemini(rfpText, customApiKey);

    return NextResponse.json({
      success: true,
      data: analysis,
      metadata: {
        pageCount,
        wordCount,
        isTruncated,
      },
    });
  } catch (error: any) {
    console.error('Error analyzing RFP:', error);
    return NextResponse.json(
      {
        error: error.message || 'An unexpected error occurred during RFP analysis',
      },
      { status: 500 }
    );
  }
}
