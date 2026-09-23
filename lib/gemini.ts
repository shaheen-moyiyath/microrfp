import { GoogleGenAI } from '@google/genai';
import { buildPrompt, RFP_JSON_SCHEMA } from './rfp-prompt';
import { RFPAnalysis } from '@/types/rfp';

// Clean possible markdown wrapper around JSON
function cleanJsonOutput(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  }
  return cleaned.trim();
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function analyzeRFPWithGemini(
  rfpText: string,
  userApiKey?: string
): Promise<RFPAnalysis> {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please verify your environment variable in Vercel settings.'
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildPrompt(rfpText);

  // Valid, supported models for v1beta in @google/genai
  const modelCandidates = [
    process.env.GEMINI_MODEL,
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-flash-latest',
  ].filter((m): m is string => Boolean(m));

  const uniqueModels = Array.from(new Set(modelCandidates));

  const config = {
    responseMimeType: 'application/json',
    responseSchema: RFP_JSON_SCHEMA,
    temperature: 0.2,
    maxOutputTokens: 8192,
  };

  let lastMeaningfulError: any = null;

  for (const model of uniqueModels) {
    // Up to 3 attempts with backoff for transient 503/429 spikes
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config,
        });

        const rawOutput = response.text || '';
        if (!rawOutput) {
          throw new Error('Received an empty response from Gemini model');
        }

        const cleaned = cleanJsonOutput(rawOutput);
        const parsed: RFPAnalysis = JSON.parse(cleaned);
        return parsed;
      } catch (error: any) {
        const status = error?.status;
        const msg = (error?.message || '').toLowerCase();

        const is503 = status === 503 || msg.includes('503') || msg.includes('high demand') || msg.includes('unavailable');
        const isRateLimit = status === 429 || msg.includes('429') || msg.includes('quota') || msg.includes('resource_exhausted');
        const is404 = status === 404 || msg.includes('404') || msg.includes('not found');

        // Only store as meaningful error if it's not a generic 404 (model name mismatch)
        if (!is404 || !lastMeaningfulError) {
          lastMeaningfulError = error;
        }

        // For transient 503 high demand spikes or 429 rate limits, pause with exponential backoff and retry
        if ((is503 || isRateLimit) && attempt < 3) {
          const delay = attempt * 2000; // 2s on 1st retry, 4s on 2nd retry
          await sleep(delay);
          continue;
        }

        // If it's a 404 or exhausted retries on this model, switch to the next candidate model
        break;
      }
    }
  }

  // Parse meaningful error into clean user-facing guidance
  const errorStr = (lastMeaningfulError?.message || '').toLowerCase();
  const status = lastMeaningfulError?.status;

  if (status === 503 || errorStr.includes('503') || errorStr.includes('high demand') || errorStr.includes('unavailable')) {
    throw new Error(
      'Google Gemini AI is temporarily experiencing high server demand. We automatically retried 3 times, but capacity is still limited. Please wait 15–30 seconds and try again.'
    );
  }

  if (status === 429 || errorStr.includes('429') || errorStr.includes('quota') || errorStr.includes('resource_exhausted')) {
    throw new Error(
      'Gemini API rate limit or quota exceeded. Please wait a minute before submitting your next document.'
    );
  }

  if (status === 401 || status === 403 || errorStr.includes('api key not valid') || errorStr.includes('api_key_invalid')) {
    throw new Error(
      'Invalid Gemini API key. Please verify your GEMINI_API_KEY in your Vercel Project Settings.'
    );
  }

  throw new Error(`Gemini RFP analysis failed: ${lastMeaningfulError?.message || lastMeaningfulError}`);
}
