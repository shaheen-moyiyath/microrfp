import { GoogleGenAI } from '@google/genai';
import { buildPrompt, RFP_JSON_SCHEMA } from './rfp-prompt';
import { RFPAnalysis } from '@/types/rfp';

export async function analyzeRFPWithGemini(
  rfpText: string,
  userApiKey?: string
): Promise<RFPAnalysis> {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please supply an API key in .env.local or via the application interface.'
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildPrompt(rfpText);

  // Preferred model: gemini-3.8-flash (or gemini-2.5-flash / gemini-2.5-pro)
  const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const fallbackModel = 'gemini-2.5-flash';

  const config = {
    responseMimeType: 'application/json',
    responseSchema: RFP_JSON_SCHEMA,
    temperature: 0.2,
    maxOutputTokens: 8192,
  };

  try {
    const response = await ai.models.generateContent({
      model: primaryModel,
      contents: prompt,
      config,
    });

    const rawOutput = response.text || '';
    if (!rawOutput) {
      throw new Error('Received an empty response from Gemini model');
    }

    const parsed: RFPAnalysis = JSON.parse(rawOutput);
    return parsed;
  } catch (error: any) {
    // If the model name is unavailable on an older API key tier, try fallback
    if (
      (error?.status === 404 || error?.message?.includes('not found')) &&
      primaryModel !== fallbackModel
    ) {
      try {
        const fallbackResponse = await ai.models.generateContent({
          model: fallbackModel,
          contents: prompt,
          config,
        });
        const fallbackText = fallbackResponse.text || '';
        return JSON.parse(fallbackText) as RFPAnalysis;
      } catch (fallbackError: any) {
        throw new Error(`Gemini analysis failed on fallback: ${fallbackError.message}`);
      }
    }

    // Specific error mapping for user-facing clarity
    const errorStr = (error?.message || '').toLowerCase();
    const status = error?.status;

    if (status === 429 || errorStr.includes('429') || errorStr.includes('quota') || errorStr.includes('resource_exhausted')) {
      throw new Error(
        'Gemini API rate limit or quota exceeded. Please wait 60 seconds or provide a custom API key.'
      );
    }

    if (status === 401 || status === 403 || errorStr.includes('api key not valid') || errorStr.includes('api_key_invalid')) {
      throw new Error(
        'Invalid Gemini API key. Please check your API key in .env.local or enter a valid key in the interface.'
      );
    }

    throw new Error(`Gemini RFP analysis failed: ${error.message || error}`);
  }
}
