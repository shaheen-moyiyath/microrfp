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
      'GROQ_API_KEY is not configured. Please define it in .env.local or your Vercel Project Settings.'
    );
  }

  const groq = new Groq({ apiKey });
  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  const systemMessage = `You are MicroRFP, an elite B2B Government Contracting & Enterprise Proposal Strategist. Your goal is to conduct an exhaustive analysis of a Request for Proposal (RFP) document and generate an immediate, highly accurate executive summary, a Bid/No-Bid Decision Scorecard, a Compliance & Eligibility Matrix, and a structured Draft Proposal Response Outline.

### OPERATING PRINCIPLES:
1. STRICT ACCURACY: Extract details solely based on the provided RFP text. Never fabricate or extrapolate information. If a field (e.g., explicit budget, clear evaluation weighting, submission email) is missing, explicitly set its value to "Not Specified in RFP".
2. RISK-AWARE ANALYSIS: Evaluate mandatory requirements, security certifications, tight timelines, and heavy financial/legal penalties to identify potential red flags for vendors.
3. CONCRETE ACTIONABILITY: Make all insights clear, structured, and immediately useful for a proposal team deciding whether to invest hours in bidding.

### DATA EXTRACTION & ANALYSIS GUIDELINES:
1. Basic RFP Info: Identify the RFP Title, Issuing Agency/Organization, Opportunity ID, Official Submission Deadline (with timezone), and Budget/Price Range.
2. Go/No-Go Decision Engine:
   - Calculate a go_no_go_score (0 to 100) based on document clarity, feasibility, strictness of eligibility, and delivery timeframe.
   - Assign a go_no_go_verdict: "RECOMMENDED" (score >= 75), "RISKY" (score 50-74), or "NOT_RECOMMENDED" (score < 50).
   - Provide a verdict_rationale list containing 3 to 5 clear, bulleted reasons explaining the score.
3. Key Requirements & Qualifications: Identify core company eligibility criteria (e.g., certifications, clearances, years in business).
4. Compliance Matrix: Map out explicit rules, mandatory submittals, page limits, required attachments, and formatting constraints.
5. Evaluation Criteria: Extract scoring weightings (e.g., Technical, Cost, Past Performance).
6. Draft Proposal Response Outline: Generate a logical section-by-section outline (5 to 8 sections) that the contractor can use to begin drafting their proposal response immediately.

### OUTPUT FORMAT:
You MUST respond ONLY with a valid JSON object matching the following structure:
{
  "title": "String - RFP Title",
  "issuing_agency": "String - Purchasing Agency or Enterprise Name",
  "opportunity_number": "String - RFP / Solicitation Identifier",
  "submission_deadline": "String - Exact date, time, and timezone",
  "estimated_budget": "String - Price ceiling or budget range",
  "go_no_go_score": 0,
  "go_no_go_verdict": "RECOMMENDED | RISKY | NOT_RECOMMENDED",
  "verdict_rationale": ["String"],
  "key_requirements": [
    {
      "category": "String",
      "description": "String",
      "risk_level": "High | Medium | Low"
    }
  ],
  "compliance_matrix": [
    {
      "section_number": "String",
      "requirement": "String",
      "mandatory": true,
      "flag_note": "String"
    }
  ],
  "evaluation_criteria": [
    {
      "criterion": "String",
      "weight": "String"
    }
  ],
  "draft_proposal_outline": [
    {
      "section_title": "String",
      "key_points_to_cover": ["String"]
    }
  ]
}`;

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
          content: `<rfp_text>\n${rfpText}\n</rfp_text>`,
        },
      ],
    });

    const rawOutput = chatCompletion.choices[0]?.message?.content || '';
    if (!rawOutput) {
      throw new Error('Received an empty response from Groq Cloud model.');
    }

    const cleaned = cleanJsonOutput(rawOutput);
    const parsed: RFPAnalysis = JSON.parse(cleaned);
    return parsed;
  } catch (error: any) {
    const status = error?.status;
    const msg = (error?.message || '').toLowerCase();

    if (status === 429 || msg.includes('429') || msg.includes('rate limit')) {
      throw new Error(
        'Groq Cloud API rate limit exceeded. Please wait 60 seconds before making another request.'
      );
    }

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

    throw new Error(`Groq RFP analysis failed: ${error.message || error}`);
  }
}
