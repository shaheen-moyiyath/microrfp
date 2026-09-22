export interface KeyRequirement {
  category: string;
  description: string;
  risk_level: 'High' | 'Medium' | 'Low';
}

export interface ComplianceItem {
  section_number: string;
  requirement: string;
  mandatory: boolean;
  flag_note: string;
}

export interface EvaluationCriterion {
  criterion: string;
  weight: string;
}

export interface ProposalSection {
  section_title: string;
  key_points_to_cover: string[];
}

export type GoNoGoVerdict = 'RECOMMENDED' | 'RISKY' | 'NOT_RECOMMENDED';

export interface RFPAnalysis {
  title: string;
  issuing_agency: string;
  opportunity_number: string;
  submission_deadline: string;
  estimated_budget: string;
  go_no_go_score: number;
  go_no_go_verdict: GoNoGoVerdict;
  verdict_rationale: string[];
  key_requirements: KeyRequirement[];
  compliance_matrix: ComplianceItem[];
  evaluation_criteria: EvaluationCriterion[];
  draft_proposal_outline: ProposalSection[];
}
