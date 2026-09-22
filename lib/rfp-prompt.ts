export const SYSTEM_PROMPT_TEMPLATE = `You are MicroRFP, an elite B2B Government Contracting & Enterprise Proposal Strategist. Your goal is to conduct an exhaustive analysis of a Request for Proposal (RFP) document and generate an immediate, highly accurate executive summary, a Bid/No-Bid Decision Scorecard, a Compliance & Eligibility Matrix, and a structured Draft Proposal Response Outline.

### OPERATING PRINCIPLES:
1. STRICT ACCURACY: Extract details solely based on the provided RFP text. Never fabricate or extrapolate information. If a field (e.g., explicit budget, clear evaluation weighting, submission email) is missing, explicitly set its value to "Not Specified in RFP".
2. RISK-AWARE ANALYSIS: Evaluate mandatory requirements, security certifications, tight timelines, and heavy financial/legal penalties to identify potential red flags for small-to-medium vendors.
3. CONCRETE ACTIONABILITY: Make all insights clear, structured, and immediately useful for a proposal team deciding whether to invest hours in bidding.

### DATA EXTRACTION & ANALYSIS GUIDELINES:
1. Basic RFP Info: Identify the RFP Title, Issuing Agency/Organization, Opportunity ID, Official Submission Deadline (with timezone), and Budget/Price Range.
2. Go/No-Go Decision Engine: 
   - Calculate a \`go_no_go_score\` (0 to 100) based on document clarity, feasibility, strictness of eligibility, and delivery timeframe.
   - Assign a \`go_no_go_verdict\`: "RECOMMENDED" (score >= 75), "RISKY" (score 50-74), or "NOT_RECOMMENDED" (score < 50).
   - Provide a \`verdict_rationale\` list containing 3 to 5 clear, bulleted reasons explaining the score.
3. Key Requirements & Qualifications: Identify core company eligibility criteria (e.g., years in business, minimum revenue, required certifications like ISO, SOC2, PMP, Security Clearances).
4. Compliance Matrix: Map out explicit rules, mandatory submittals, page limits, required attachments, and formatting constraints.
5. Evaluation Criteria: Extract scoring weightings (e.g., Technical 40%, Cost 30%, Past Performance 30%).
6. Draft Proposal Response Outline: Generate a logical section-by-section outline (5 to 8 sections) that the contractor can use to begin drafting their proposal response immediately.

### OUTPUT FORMAT:
You MUST respond ONLY with a valid JSON object matching the requested schema. No conversational filler or markdown block wrappers outside the JSON.

### INPUT RFP TEXT:
<rfp_text>
{{INSERT_EXTRACTED_PDF_TEXT_HERE}}
</rfp_text>`;

export const RFP_JSON_SCHEMA = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      description: 'RFP Title or "Not Specified in RFP"',
    },
    issuing_agency: {
      type: 'string',
      description: 'Purchasing Agency or Enterprise Name or "Not Specified in RFP"',
    },
    opportunity_number: {
      type: 'string',
      description: 'RFP / Solicitation Identifier or "Not Specified in RFP"',
    },
    submission_deadline: {
      type: 'string',
      description: 'Exact date, time, and timezone or "Not Specified in RFP"',
    },
    estimated_budget: {
      type: 'string',
      description: 'Price ceiling or budget range or "Not Specified in RFP"',
    },
    go_no_go_score: {
      type: 'integer',
      description: 'Score from 0 to 100 based on feasibility, timeline, clarity, and eligibility',
    },
    go_no_go_verdict: {
      type: 'string',
      enum: ['RECOMMENDED', 'RISKY', 'NOT_RECOMMENDED'],
      description: 'RECOMMENDED (>=75), RISKY (50-74), or NOT_RECOMMENDED (<50)',
    },
    verdict_rationale: {
      type: 'array',
      items: { type: 'string' },
      description: '3 to 5 bulleted reasons explaining the score and verdict',
    },
    key_requirements: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'e.g., Qualification, Certification, Financial, Past Performance, Technical',
          },
          description: {
            type: 'string',
            description: 'Specific requirement statement extracted from the document',
          },
          risk_level: {
            type: 'string',
            enum: ['High', 'Medium', 'Low'],
            description: 'High, Medium, or Low risk level for bidder',
          },
        },
        required: ['category', 'description', 'risk_level'],
      },
      description: 'Core eligibility and mandatory qualifications',
    },
    compliance_matrix: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          section_number: {
            type: 'string',
            description: 'e.g., Section 3.1.B or Page 14',
          },
          requirement: {
            type: 'string',
            description: 'What must be provided or adhered to',
          },
          mandatory: {
            type: 'boolean',
            description: 'True if explicitly mandatory, false if optional/recommended',
          },
          flag_note: {
            type: 'string',
            description: 'Strategic warning or note for proposal manager',
          },
        },
        required: ['section_number', 'requirement', 'mandatory', 'flag_note'],
      },
      description: 'Compliance rules, submittals, formatting, and page limit matrix',
    },
    evaluation_criteria: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          criterion: {
            type: 'string',
            description: 'e.g., Technical Solution, Cost/Price, Past Performance',
          },
          weight: {
            type: 'string',
            description: 'e.g., 40% or 40 Points or "Not Specified in RFP"',
          },
        },
        required: ['criterion', 'weight'],
      },
      description: 'Evaluation criteria and scoring weightings',
    },
    draft_proposal_outline: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          section_title: {
            type: 'string',
            description: 'Section Name (e.g., 1.0 Executive Summary & Value Proposition)',
          },
          key_points_to_cover: {
            type: 'array',
            items: { type: 'string' },
            description: 'Actionable bullet points to address in this section',
          },
        },
        required: ['section_title', 'key_points_to_cover'],
      },
      description: '5 to 8 section proposal response outline for immediate drafting',
    },
  },
  required: [
    'title',
    'issuing_agency',
    'opportunity_number',
    'submission_deadline',
    'estimated_budget',
    'go_no_go_score',
    'go_no_go_verdict',
    'verdict_rationale',
    'key_requirements',
    'compliance_matrix',
    'evaluation_criteria',
    'draft_proposal_outline',
  ],
};

export function buildPrompt(extractedPdfText: string): string {
  return SYSTEM_PROMPT_TEMPLATE.replace('{{INSERT_EXTRACTED_PDF_TEXT_HERE}}', extractedPdfText);
}
