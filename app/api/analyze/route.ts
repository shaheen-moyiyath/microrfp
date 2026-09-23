import { NextRequest, NextResponse } from 'next/server';
import { extractPdfText } from '@/lib/pdf-extract';
import { analyzeRFPWithGemini } from '@/lib/gemini';
import { analyzeRFPWithGroq } from '@/lib/groq';
import { RFPAnalysis } from '@/types/rfp';

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
    let requestedProvider: string | undefined;

    // Parse Input Payload
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      customApiKey = (formData.get('apiKey') as string) || undefined;
      requestedProvider = (formData.get('provider') as string) || undefined;

      if (!file) {
        return NextResponse.json(
          { error: 'No PDF file was uploaded in the request.' },
          { status: 400 }
        );
      }

      // Enforce 20MB payload limit
      const MAX_FILE_SIZE = 20 * 1024 * 1024;
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
      requestedProvider = body.provider;

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

    const geminiKey = customApiKey || process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    if (!geminiKey && !groqKey) {
      return NextResponse.json(
        {
          error:
            'No AI API Key configured. Please add GEMINI_API_KEY or GROQ_API_KEY to your environment variables in Vercel settings.',
        },
        { status: 401 }
      );
    }

    let analysis: RFPAnalysis;
    let providerUsed = 'gemini';
    let fallbackTriggered = false;

    // Timeout promise (52s timeout to respond before Vercel 60s hard kill)
    const createTimeout = (ms: number) =>
      new Promise<never>((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error('AI analysis timed out after 50 seconds. Please try a shorter document.')
            ),
          ms
        )
      );

    // If Groq is explicitly requested and key is available
    if (requestedProvider === 'groq' && groqKey) {
      providerUsed = 'groq';
      analysis = await Promise.race([analyzeRFPWithGroq(rfpText), createTimeout(50000)]);
    } else if (geminiKey) {
      // Primary: Google Gemini with automated fallback to Groq on failure/rate limit
      try {
        providerUsed = 'gemini';
        analysis = await Promise.race([
          analyzeRFPWithGemini(rfpText, geminiKey),
          createTimeout(30000), // Give Gemini 30s before falling back to Groq
        ]);
      } catch (geminiError: any) {
        console.warn('Gemini analysis failed or timed out:', geminiError?.message);

        // If Groq is configured, attempt execution as automated fallback
        if (groqKey) {
          console.info('Attempting fallback to Groq Cloud (llama-3.3-70b-versatile)...');
          providerUsed = 'groq';
          fallbackTriggered = true;
          try {
            analysis = await Promise.race([
              analyzeRFPWithGroq(rfpText),
              createTimeout(20000),
            ]);
          } catch (groqError: any) {
            throw new Error(
              `Both Gemini and Groq fallback failed. Gemini error: ${geminiError.message}. Groq error: ${groqError.message}`
            );
          }
        } else {
          throw geminiError;
        }
      }
    } else {
      // Only Groq key is available
      providerUsed = 'groq';
      analysis = await Promise.race([analyzeRFPWithGroq(rfpText), createTimeout(50000)]);
    }

    analysis.provider = providerUsed as 'gemini' | 'groq';
    analysis.fallbackTriggered = fallbackTriggered;

    return NextResponse.json({
      success: true,
      data: analysis,
      metadata: {
        pageCount,
        wordCount,
        isTruncated,
        provider: providerUsed,
        fallbackTriggered,
      },
    });
  } catch (error: any) {
    console.error('Error analyzing RFP in API route:', error);

    return NextResponse.json(
      {
        error: error.message || 'An unexpected error occurred during RFP analysis.',
      },
      { status: 500 }
    );
  }
}
