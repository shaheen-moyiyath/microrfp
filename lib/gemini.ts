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

  // Model fallback chain: tries primary, then cascades through available high-capacity models
  const modelCandidates = [
    process.env.GEMINI_MODEL,
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-3.8-flash',
    'gemini-1.5-flash',
  ].filter((m): m is string => Boolean(m));

  // Remove duplicates while preserving order
  const uniqueModels = Array.from(new Set(modelCandidates));

  const config = {
    responseMimeType: 'application/json',
    responseSchema: RFP_JSON_SCHEMA,
    temperature: 0.2,
    maxOutputTokens: 8192,
  };

  let lastError: any = null;

  for (const model of uniqueModels) {
    // Up to 2 attempts per model for transient 503 spikes
    for (let attempt = 1; attempt <= 2; attempt++) {
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
        lastError = error;
        const status = error?.status;
        const msg = (error?.message || '').toLowerCase();

        const is503 = status === 503 || msg.includes('503') || msg.includes('high demand') || msg.includes('unavailable');
        const isRateLimit = status === 429 || msg.includes('429') || msg.includes('quota') || msg.includes('resource_exhausted');

        // If 503 high demand or 429, wait 2 seconds before retry or next model
        if ((is503 || isRateLimit) && attempt === 1) {
          await sleep(2000);
          continue; // retry same model once
        }

        // If not retryable on this model, break to try the next model candidate
        break;
      }
    }
  }

  // If all models and retries failed, parse last error into user-friendly message
  const errorStr = (lastError?.message || '').toLowerCase();
  const status = lastError?.status;

  if (status === 503 || errorStr.includes('503') || errorStr.includes('high demand') || errorStr.includes('unavailable')) {
    throw new Error(
      'Gemini AI servers are temporarily experiencing high demand across models. Please wait 30 seconds and try analyzing again.'
    );
  }

  if (status === 429 || errorStr.includes('429') || errorStr.includes('quota') || errorStr.includes('resource_exhausted')) {
    throw new Error(
      'Gemini API rate limit or quota exceeded. Please wait a minute or check your quota at ai.google.dev.'
    );
  }

  if (status === 401 || status === 403 || errorStr.includes('api key not valid') || errorStr.includes('api_key_invalid')) {
    throw new Error(
      'Invalid Gemini API key. Please verify your GEMINI_API_KEY environment variable in your Vercel Project Settings.'
    );
  }

  throw new Error(`Gemini RFP analysis failed: ${lastError?.message || lastError}`);
}
