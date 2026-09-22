import { RFPAnalysis } from '@/types/rfp';

export const HILL_AFB_RFP_ANALYSIS: RFPAnalysis = {
  title: 'Acquisition of Commercial Items for 309th SWEG - Product & License Renewals',
  issuing_agency: 'Department of the Air Force / Air Force Materiel Command (Hill AFB, UT)',
  opportunity_number: 'FA8222-26-Q-3456',
  submission_deadline: '24 September 2026 at 1100 MT',
  estimated_budget: 'Not Specified in RFP',
  go_no_go_score: 48,
  go_no_go_verdict: 'NOT_RECOMMENDED',
  verdict_rationale: [
    'Extremely compressed submission timeline: Offers are due 24 September 2026 at 1100 MT, leaving under 48 hours for quotation assembly and compliance verification.',
    'Formal Question & Answer deadline (21 September 2026 at 1100 MT) has already elapsed, preventing resolution of any specification ambiguities.',
    'The solicitation references an external "attached document for detailed specifications" (IAW EL) required to price CLINs 0001 through 0005 accurately.',
    'Evaluation is strictly Lowest Price Technically Acceptable (LPTA), forcing a commodity price competition where technical excellence provides zero scoring advantage.',
    'Strict defense compliance hurdles: Mandatory active SAM.gov registration, CAGE code, SAM UEI, and DFARS 252.204-7012 / NIST SP 800-171 cybersecurity compliance.'
  ],
  key_requirements: [
    {
      category: 'Small Business Set-Aside',
      description: 'Offeror must qualify as a small business under NAICS 541519 (Other Computer Related Services) with small business size standard of $34,000,000.',
      risk_level: 'Medium'
    },
    {
      category: 'Cybersecurity & CDI Safeguarding',
      description: 'Mandatory compliance with DFARS 252.204-7008 and 252.204-7012 (Safeguarding Covered Defense Information and Cyber Incident Reporting per NIST SP 800-171).',
      risk_level: 'High'
    },
    {
      category: 'Supplier Performance Risk System (SPRS)',
      description: 'Evaluation will incorporate offeror risk and past performance scores in the Supplier Performance Risk System pursuant to DFARS 252.204-7024.',
      risk_level: 'Medium'
    },
    {
      category: 'Delivery & License Duration',
      description: 'Delivery FOB Destination to Hill AFB Bldg 1515 not to exceed 9 Months ARO. Software license renewals must guarantee 12 months duration after delivery across 5 PoP periods.',
      risk_level: 'Medium'
    },
    {
      category: 'Telecommunications & National Security',
      description: 'Prohibitions on ByteDance covered applications (FAR 52.204-27) and Covered Defense Telecommunications Equipment (DFARS 252.204-7017/7018).',
      risk_level: 'Low'
    }
  ],
  compliance_matrix: [
    {
      section_number: 'Section (viii) / FAR 52.212-1',
      requirement: 'Offers due NLT 24 September 2026 at 1100 MT via electronic mail to jonathan.graham.11@us.af.mil. Must provide CAGE code and SAM UEI when submitting bid.',
      mandatory: true,
      flag_note: 'CRITICAL DEADLINE: Must be transmitted by 1100 MT. Late email bids will be disqualified without review.'
    },
    {
      section_number: 'Section (x) / FAR 52.212-3',
      requirement: 'Offerors must include a completed copy of Offeror Representations and Certifications -- Commercial Items with offer.',
      mandatory: true,
      flag_note: 'Verify SAM.gov representations are active or submit written FAR 52.212-3 certification.'
    },
    {
      section_number: 'Section (b) / SAM.gov',
      requirement: 'All firms or individuals responding must be registered with the System for Award Management (SAM). Submit only written offers; oral offers will not be accepted.',
      mandatory: true,
      flag_note: 'Must verify active registration status and UEI prior to submission.'
    },
    {
      section_number: 'Section (v) / CLINs 0001-0005',
      requirement: 'Pricing required for Base Year (CLIN 0001) plus four 1-year Option Years (CLINs 0002-0005) IAW Equipment List (EL) through 11/11/2031.',
      mandatory: true,
      flag_note: 'All option years must be priced to enable total evaluated price calculation.'
    },
    {
      section_number: 'Section (vii) / FOB Destination',
      requirement: 'Delivery to 6137 Wardleigh Rd, Bldg 1515, Hill AFB, UT 84056. Delivery not to exceed 9 Months ARO. FOB Destination.',
      mandatory: true,
      flag_note: 'Ensure freight, packaging, and inside delivery are factored into unit pricing.'
    },
    {
      section_number: 'DFARS 252.232-7003 / 7006',
      requirement: 'Electronic submission of payment requests and receiving reports via Wide Area WorkFlow (WAWF / PIEE).',
      mandatory: true,
      flag_note: 'Contractor must maintain operational WAWF account to bill upon delivery acceptance.'
    }
  ],
  evaluation_criteria: [
    {
      criterion: 'Proposed Total Evaluated Price',
      weight: 'Lowest Price Technically Acceptable (LPTA Basis)'
    },
    {
      criterion: 'Technical Capability to Meet Government Requirement',
      weight: 'Pass / Fail (Technical Acceptability Based on Specifications)'
    }
  ],
  draft_proposal_outline: [
    {
      section_title: '1.0 Transmittal Letter, Corporate Identifiers & SAM Reps/Certs',
      key_points_to_cover: [
        'Formal transmittal letter addressed to Jonathan Graham referencing Solicitation FA8222-26-Q-3456.',
        'Corporate identifiers: CAGE Code, SAM Unique Entity Identifier (UEI), TIN, and Small Business self-certification under NAICS 541519.',
        'Statement confirming active SAM.gov registration and compliance with FAR 52.212-3 Offeror Representations and Certifications.',
        'Explicit acknowledgement that written quote constitutes a binding offer with validity through specified acceptance date.'
      ]
    },
    {
      section_title: '2.0 Technical Capability & Specification Compliance Matrix',
      key_points_to_cover: [
        'Item-by-item technical compliance matrix mapping proposed commercial items directly against 309th SWEG specifications.',
        'Verification of part numbers, licensing tiers, and OEM authorized reseller documentation for required products.',
        'Technical acceptance narrative demonstrating zero deviation from requested capabilities on the Equipment List (IAW EL).',
        'Quality assurance verification ensuring delivered products are genuine, unmodified commercial items.'
      ]
    },
    {
      section_title: '3.0 Delivery Plan, FOB Destination Logistics & License Duration',
      key_points_to_cover: [
        'Commitment to deliver FOB Destination to Hill AFB Bldg 1515 within the mandatory 9-Month After Receipt of Order (ARO) window.',
        'Detailed software license term tracking guaranteeing exactly 12 months of active coverage post-delivery.',
        'Shipping coordination, base access clearance, and receiving inspection protocols with 309th SWEG personnel.',
        'Warranty support contacts and escalation paths during the initial 12-month license lifecycle.'
      ]
    },
    {
      section_title: '4.0 Cyber Safeguarding & National Security Compliance Attestation',
      key_points_to_cover: [
        'Affirmation of compliance with DFARS 252.204-7008 and 252.204-7012 safeguarding covered defense information.',
        'Current Supplier Performance Risk System (SPRS) summary score reference and NIST SP 800-171 self-assessment status.',
        'Certification of non-use of covered telecommunications equipment (DFARS 252.204-7017/7018) and ByteDance applications (FAR 52.204-27).',
        'Mandatory antiterrorism training and security awareness attestation per DFARS 252.204-7004.'
      ]
    },
    {
      section_title: '5.0 Firm Fixed Price (FFP) Schedule & Multi-Year CLIN Breakdown',
      key_points_to_cover: [
        'Total Price summary table detailing CLIN 0001 (Base Year: 11/12/2026 - 11/11/2027) through CLIN 0005 (Option Year 4: 11/12/2030 - 11/11/2031).',
        'Confirmation that all pricing is Firm Fixed Price (FFP) and inclusive of shipping and destination delivery costs.',
        'Acknowledgment of electronic invoicing via Wide Area WorkFlow (WAWF) in accordance with DFARS 252.232-7006.',
        'Clear notation that Government reserves the right to cancel solicitation without cost reimbursement per Notice to Offerors.'
      ]
    }
  ]
};

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
