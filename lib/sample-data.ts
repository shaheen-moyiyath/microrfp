import { RFPAnalysis } from '@/types/rfp';

export const SAMPLE_RFP_ANALYSIS: RFPAnalysis = {
  title: 'Enterprise Electronic Health Record (EHR) Cloud Migration & Zero Trust Modernization',
  issuing_agency: 'U.S. Department of Veterans Affairs (VA) - Office of Information & Technology',
  opportunity_number: 'VA-24-SOL-09412-EHR',
  submission_deadline: 'November 14, 2026, 4:00 PM EST',
  estimated_budget: '$48,500,000 - $62,000,000 (5-Year IDIQ Ceiling)',
  go_no_go_score: 78,
  go_no_go_verdict: 'RECOMMENDED',
  verdict_rationale: [
    'Strong alignment with enterprise cloud migration capabilities and federal health IT past performance requirements.',
    'Clear 60-day bid submission window provides sufficient runway for teaming agreements and subcontractor past-performance narratives.',
    'FedRAMP High and CMMC Level 2 requirements present high barriers to entry, filtering out commodity competitors and favoring qualified mid-tier vendors.',
    'Pricing weighting is capped at 20%, placing dominant evaluation emphasis on Technical Merit (35%) and Verified Past Performance (25%).'
  ],
  key_requirements: [
    {
      category: 'Security & Compliance',
      description: 'Vendor must hold active FedRAMP High Authorized Cloud Architecture and achieve CMMC Level 2 certification prior to award.',
      risk_level: 'High'
    },
    {
      category: 'Past Performance',
      description: 'Minimum of three (3) prime contracts within past 5 years involving federal healthcare data migration of >= 1M patient records.',
      risk_level: 'Medium'
    },
    {
      category: 'Key Personnel',
      description: 'Key Personnel (Chief Architect, Cyber Lead, Program Manager) must hold active Secret Clearances and minimum 10 years federal experience.',
      risk_level: 'High'
    },
    {
      category: 'Operational SLA',
      description: '24/7/365 US-based Tier 3 Network and Security Operations Center (NOC/SOC) with maximum 15-minute P1 incident response time.',
      risk_level: 'Medium'
    },
    {
      category: 'Small Business Subcontracting',
      description: 'Mandatory 23% small business subcontracting participation plan (SDVOSB, WOSB, HUBZone) with quarterly reporting audits.',
      risk_level: 'Low'
    }
  ],
  compliance_matrix: [
    {
      section_number: 'Section L.4.1',
      requirement: 'Volume I (Technical) strictly limited to 75 pages. Font must be 11pt Arial or Times New Roman with 1-inch margins.',
      mandatory: true,
      flag_note: 'CRITICAL: Page overage will result in immediate disqualification of subsequent pages without review.'
    },
    {
      section_number: 'Section L.4.2',
      requirement: 'Complete Cost Breakdown Structure (CBS) submitted in native, unlocked Excel format with all formulas preserved.',
      mandatory: true,
      flag_note: 'Ensure no hidden cells, password protection, or circular references in the financial model.'
    },
    {
      section_number: 'Section L.5.3',
      requirement: 'Quality Assurance Surveillance Plan (QASP) and Disaster Recovery Plan (< 1 hr RPO, < 4 hr RTO).',
      mandatory: true,
      flag_note: 'Must map directly to NIST SP 800-53 Rev 5 control families.'
    },
    {
      section_number: 'Section M.2',
      requirement: 'Three (3) Past Performance Questionnaires (PPQs) submitted directly from Government Contracting Officers by deadline.',
      mandatory: true,
      flag_note: 'Reach out to past COs at least 3 weeks prior to ensure direct submission.'
    },
    {
      section_number: 'Section H.12',
      requirement: 'Organizational Conflict of Interest (OCI) mitigation plan certification signed by corporate officer.',
      mandatory: true,
      flag_note: 'Required if your firm has advised VA on prior IT strategy.'
    },
    {
      section_number: 'Section L.7',
      requirement: 'Subcontractor commitment letters with signed Teaming Agreements and work-share percentages.',
      mandatory: false,
      flag_note: 'Recommended to substantiate 23% small business utilization score.'
    }
  ],
  evaluation_criteria: [
    {
      criterion: 'Technical & Management Approach',
      weight: '35% / 350 Points'
    },
    {
      criterion: 'Relevant Past Performance',
      weight: '25% / 250 Points'
    },
    {
      criterion: 'Key Personnel & Organizational Staffing',
      weight: '20% / 200 Points'
    },
    {
      criterion: 'Price Realism & Cost Competitiveness',
      weight: '20% / 200 Points'
    }
  ],
  draft_proposal_outline: [
    {
      section_title: '1.0 Executive Summary & Value Proposition',
      key_points_to_cover: [
        'Clear statement of understanding of VA EHR modernization objectives and patient health data protection.',
        'High-level overview of our Zero Trust cloud migration blueprint and proven migration acceleration tooling.',
        'Summary of low-risk transition timeline, key risk mitigation strategies, and measurable agency ROI.',
        'Core differentiators: 99.999% uptime track record and certified federal healthcare migration engineers.'
      ]
    },
    {
      section_title: '2.0 Technical Approach & Cloud Architecture',
      key_points_to_cover: [
        'Detailed FedRAMP High multi-region cloud landing zone architecture diagram and network topology.',
        'Automated ETL pipelines, data deduplication, and zero-downtime cutover methodology for legacy databases.',
        'Zero Trust Architecture compliance (NIST SP 800-207, ICAM integration, microsegmentation).',
        'Continuous monitoring, automated security scanning, and automated audit logging per FISMA standards.'
      ]
    },
    {
      section_title: '3.0 Management Plan, Governance & Key Personnel',
      key_points_to_cover: [
        'Integrated Master Schedule (IMS) with work breakdown structure, gate reviews, and critical path milestones.',
        'Profiles, resumes, and commitment letters for Key Personnel (Chief Architect, Security Lead, PM).',
        'Subcontractor management, SLA accountability mechanisms, and weekly executive cadence with VA leadership.',
        'Risk Management Framework (RMF) proactive identification and remediation protocol.'
      ]
    },
    {
      section_title: '4.0 Past Performance & Mission Case Studies',
      key_points_to_cover: [
        'Project 1: DHA Cloud Migration — 3.2M records migrated, zero security incidents, completed 3 weeks ahead of schedule.',
        'Project 2: HHS Enterprise Zero Trust Rollout — FedRAMP High accreditation achieved in 90 days.',
        'Project 3: VA Telehealth Modernization Subcontract — CPARS ratings of "Exceptional" across all evaluation factors.',
        'Relevance mapping matrix matching solicitation requirements to proven contract outcomes.'
      ]
    },
    {
      section_title: '5.0 Quality Assurance & Service Level Agreements',
      key_points_to_cover: [
        'QASP metrics table with measurable defect rates, MTTR, and uptime performance guarantees.',
        'Disaster Recovery / Business Continuity plans demonstrating 15-minute RPO and 2-hour RTO.',
        'Independent verification & validation (IV&V) testing cycles and automated regression test suites.',
        'Continuous improvement feedback loop incorporating clinician and administrative end-user feedback.'
      ]
    },
    {
      section_title: '6.0 Cost & Price Proposal Narrative',
      key_points_to_cover: [
        'Cost realism methodology demonstrating optimized labor mix and cloud consumption unit economics.',
        'Basis of Estimate (BOE) transparency across CLINs for base year and four option periods.',
        'Value engineering cost savings initiatives passed directly to the government.',
        'Small business subcontracting incentive structure and transparent overhead calculations.'
      ]
    }
  ]
};
