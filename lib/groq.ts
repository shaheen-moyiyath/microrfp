import Groq from 'groq-sdk';
import { RFPAnalysis } from '@/types/rfp';

function cleanJsonOutput(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  }
  return cleaned.trim();
}

export async function analyzeRFPWithGroq(
  rfpText: string,
  userApiKey?: string
): Promise<RFPAnalysis> {
  const apiKey = userApiKey || process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      'GROQ_API_KEY is not configured. Please define it in your Vercel Project Settings.'
    );
  }

  const groq = new Groq({ apiKey });

  // Query active models dynamically from the user's Groq account to avoid decommissioned models
  let activeGroqModels: string[] = [];
  try {
    const listResponse = await groq.models.list();
    if (listResponse && Array.isArray(listResponse.data)) {
      activeGroqModels = listResponse.data
        .filter(
          (m: any) =>
            m.active !== false &&
            !m.id.includes('whisper') &&
            !m.id.includes('guard') &&
            !m.id.includes('vision')
        )
        .map((m: any) => m.id);
    }
  } catch (err) {
    console.warn('Could not query groq.models.list dynamically:', err);
  }

  // Preferred order of supported models
  const preferredModels = [
    process.env.GROQ_MODEL,
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
  ].filter((m): m is string => Boolean(m));

  const candidatesToTry =
    activeGroqModels.length > 0
      ? [
          ...preferredModels.filter((p) => activeGroqModels.includes(p)),
          ...activeGroqModels.filter((id) => id.includes('llama')),
        ]
      : ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

  const uniqueModels = Array.from(new Set(candidatesToTry));

  // Groq Free Tier enforces a 6,000 Tokens Per Minute (TPM) limit.
  // Guard input text to 3,000 words (~4,000 tokens) to ensure fallback always succeeds within TPM limits.
  const words = rfpText.split(/\s+/);
  const groqSafeText =
    words.length > 3000
      ? words.slice(0, 3000).join(' ') + '\n\n[Document truncated to 3,000 words for Groq capacity]'
      : rfpText;

  const systemMessage = `You are MicroRFP, an elite B2B Government Contracting & Enterprise Proposal Strategist. Your goal is to conduct an exhaustive analysis of a Request for Proposal (RFP) document and generate an immediate, highly accurate executive summary, a Bid/No-Bid Decision Scorecard, a Compliance & Eligibility Matrix, and a structured Draft Proposal Response Outline.

### OPERATING PRINCIPLES:
1. STRICT ACCURACY: Extract details solely based on the provided RFP text. Never fabricate or extrapolate information. If a field is missing, explicitly set its value to "Not Specified in RFP".
2. RISK-AWARE ANALYSIS: Evaluate mandatory requirements, security certifications, tight timelines, and heavy financial/legal penalties to identify potential red flags for vendors.
3. CONCRETE ACTIONABILITY: Make all insights clear, structured, and immediately useful for a proposal team deciding whether to invest hours in bidding.

### DATA EXTRACTION & ANALYSIS GUIDELINES:
1. Basic RFP Info: Identify RFP Title, Issuing Agency, Opportunity ID, Submission Deadline, and Budget.
2. Go/No-Go Decision Engine: Calculate go_no_go_score (0-100), verdict (RECOMMENDED >=75, RISKY 50-74, NOT_RECOMMENDED <50), and 3-5 bulleted verdict_rationale reasons.
3. Key Requirements & Qualifications: Identify company eligibility criteria with risk_level (High, Medium, Low).
4. Compliance Matrix: Map out explicit rules, section numbers, mandatory flags, and strategic flag_note warnings.
5. Evaluation Criteria: Extract scoring weightings (e.g., Technical, Cost, Past Performance).
6. Draft Proposal Response Outline: 5 to 8 sections with bulleted key_points_to_cover.

### OUTPUT FORMAT:
You MUST respond ONLY with a valid JSON object matching this structure:
{
  "title": "String",
  "issuing_agency": "String",
  "opportunity_number": "String",
  "submission_deadline": "String",
  "estimated_budget": "String",
  "go_no_go_score": 0,
  "go_no_go_verdict": "RECOMMENDED | RISKY | NOT_RECOMMENDED",
  "verdict_rationale": ["String"],
  "key_requirements": [{"category": "String", "description": "String", "risk_level": "High | Medium | Low"}],
  "compliance_matrix": [{"section_number": "String", "requirement": "String", "mandatory": true, "flag_note": "String"}],
  "evaluation_criteria": [{"criterion": "String", "weight": "String"}],
  "draft_proposal_outline": [{"section_title": "String", "key_points_to_cover": ["String"]}]
}`;

  let lastError: any = null;

  for (const model of uniqueModels) {
    try {
      const chatCompletion = await groq.chat.completions.create({
        model,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: systemMessage,
          },
          {
            role: 'user',
            content: `<rfp_text>\n${groqSafeText}\n</rfp_text>`,
          },
        ],
      });

      const rawOutput = chatCompletion.choices[0]?.message?.content || '';
      if (!rawOutput) {
        throw new Error(`Received empty response from Groq model ${model}`);
      }

      const cleaned = cleanJsonOutput(rawOutput);
      const parsed: RFPAnalysis = JSON.parse(cleaned);
      return parsed;
    } catch (error: any) {
      lastError = error;
      const status = error?.status;
      const msg = (error?.message || '').toLowerCase();

      // If invalid key, fail fast
      if (
        status === 401 ||
        status === 403 ||
        msg.includes('invalid_api_key') ||
        msg.includes('unauthorized')
      ) {
        throw new Error(
          'Invalid Groq API key. Please check your GROQ_API_KEY environment variable in your Vercel Project Settings.'
        );
      }

      // Try next available active model
      continue;
    }
  }

  // Format clean user-facing error message
  const errorMsg = (lastError?.message || '').toLowerCase();
  const errorStatus = lastError?.status;

  if (errorStatus === 429 || errorMsg.includes('429') || errorMsg.includes('rate limit')) {
    throw new Error(
      'Groq Cloud API rate limit (TPM) exceeded. Please wait 60 seconds before making another request.'
    );
  }

  throw new Error(`Groq RFP analysis failed: ${lastError?.message || lastError}`);
}
