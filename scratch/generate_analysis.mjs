import fs from 'node:fs';
import path from 'node:path';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
  Footer,
} from 'docx';

export const hillAfbAnalysis = {
  title: "Acquisition of Commercial Items for 309th SWEG - Product & License Renewals",
  issuing_agency: "Department of the Air Force / Air Force Materiel Command (Hill AFB, UT)",
  opportunity_number: "FA8222-26-Q-3456",
  submission_deadline: "24 September 2026 at 1100 MT",
  estimated_budget: "Not Specified in RFP",
  go_no_go_score: 48,
  go_no_go_verdict: "NOT_RECOMMENDED",
  verdict_rationale: [
    "Extremely compressed submission timeline: Offers are due 24 September 2026 at 1100 MT, leaving under 48 hours for quotation assembly and compliance verification.",
    "Formal Question & Answer deadline (21 September 2026 at 1100 MT) has already elapsed, preventing resolution of any specification ambiguities.",
    "The solicitation references an external 'attached document for detailed specifications' (IAW EL) required to price CLINs 0001 through 0005 accurately.",
    "Evaluation is strictly Lowest Price Technically Acceptable (LPTA), forcing a commodity price competition where technical excellence provides zero scoring advantage.",
    "Strict defense compliance hurdles: Mandatory active SAM.gov registration, CAGE code, SAM UEI, and DFARS 252.204-7012 / NIST SP 800-171 cybersecurity compliance."
  ],
  key_requirements: [
    {
      category: "Small Business Set-Aside",
      description: "Offeror must qualify as a small business under NAICS 541519 (Other Computer Related Services) with small business size standard of $34,000,000.",
      risk_level: "Medium"
    },
    {
      category: "Cybersecurity & CDI Safeguarding",
      description: "Mandatory compliance with DFARS 252.204-7008 and 252.204-7012 (Safeguarding Covered Defense Information and Cyber Incident Reporting per NIST SP 800-171).",
      risk_level: "High"
    },
    {
      category: "Supplier Performance Risk System (SPRS)",
      description: "Evaluation will incorporate offeror risk and past performance scores in the Supplier Performance Risk System pursuant to DFARS 252.204-7024.",
      risk_level: "Medium"
    },
    {
      category: "Delivery & License Duration",
      description: "Delivery FOB Destination to Hill AFB Bldg 1515 not to exceed 9 Months ARO. Software license renewals must guarantee 12 months duration after delivery across 5 PoP periods.",
      risk_level: "Medium"
    },
    {
      category: "Telecommunications & National Security",
      description: "Prohibitions on ByteDance covered applications (FAR 52.204-27) and Covered Defense Telecommunications Equipment (DFARS 252.204-7017/7018).",
      risk_level: "Low"
    }
  ],
  compliance_matrix: [
    {
      section_number: "Section (viii) / FAR 52.212-1",
      requirement: "Offers due NLT 24 September 2026 at 1100 MT via electronic mail to jonathan.graham.11@us.af.mil. Must provide CAGE code and SAM UEI when submitting bid.",
      mandatory: true,
      flag_note: "CRITICAL DEADLINE: Must be transmitted by 1100 MT. Late email bids will be disqualified without review."
    },
    {
      section_number: "Section (x) / FAR 52.212-3",
      requirement: "Offerors must include a completed copy of Offeror Representations and Certifications -- Commercial Items with offer.",
      mandatory: true,
      flag_note: "Verify SAM.gov representations are active or submit written FAR 52.212-3 certification."
    },
    {
      section_number: "Section (b) / SAM.gov",
      requirement: "All firms or individuals responding must be registered with the System for Award Management (SAM). Submit only written offers; oral offers will not be accepted.",
      mandatory: true,
      flag_note: "Must verify active registration status and UEI prior to submission."
    },
    {
      section_number: "Section (v) / CLINs 0001-0005",
      requirement: "Pricing required for Base Year (CLIN 0001) plus four 1-year Option Years (CLINs 0002-0005) IAW Equipment List (EL) through 11/11/2031.",
      mandatory: true,
      flag_note: "All option years must be priced to enable total evaluated price calculation."
    },
    {
      section_number: "Section (vii) / FOB Destination",
      requirement: "Delivery to 6137 Wardleigh Rd, Bldg 1515, Hill AFB, UT 84056. Delivery not to exceed 9 Months ARO. FOB Destination.",
      mandatory: true,
      flag_note: "Ensure freight, packaging, and inside delivery are factored into unit pricing."
    },
    {
      section_number: "DFARS 252.232-7003 / 7006",
      requirement: "Electronic submission of payment requests and receiving reports via Wide Area WorkFlow (WAWF / PIEE).",
      mandatory: true,
      flag_note: "Contractor must maintain operational WAWF account to bill upon delivery acceptance."
    }
  ],
  evaluation_criteria: [
    {
      criterion: "Proposed Total Evaluated Price",
      weight: "Lowest Price Technically Acceptable (LPTA Basis)"
    },
    {
      criterion: "Technical Capability to Meet Government Requirement",
      weight: "Pass / Fail (Technical Acceptability Based on Specifications)"
    }
  ],
  draft_proposal_outline: [
    {
      section_title: "1.0 Transmittal Letter, Corporate Identifiers & SAM Reps/Certs",
      key_points_to_cover: [
        "Formal transmittal letter addressed to Jonathan Graham referencing Solicitation FA8222-26-Q-3456.",
        "Corporate identifiers: CAGE Code, SAM Unique Entity Identifier (UEI), TIN, and Small Business self-certification under NAICS 541519.",
        "Statement confirming active SAM.gov registration and compliance with FAR 52.212-3 Offeror Representations and Certifications.",
        "Explicit acknowledgement that written quote constitutes a binding offer with validity through specified acceptance date."
      ]
    },
    {
      section_title: "2.0 Technical Capability & Specification Compliance Matrix",
      key_points_to_cover: [
        "Item-by-item technical compliance matrix mapping proposed commercial items directly against 309th SWEG specifications.",
        "Verification of part numbers, licensing tiers, and OEM authorized reseller documentation for required products.",
        "Technical acceptance narrative demonstrating zero deviation from requested capabilities on the Equipment List (IAW EL).",
        "Quality assurance verification ensuring delivered products are genuine, unmodified commercial items."
      ]
    },
    {
      section_title: "3.0 Delivery Plan, FOB Destination Logistics & License Duration",
      key_points_to_cover: [
        "Commitment to deliver FOB Destination to Hill AFB Bldg 1515 within the mandatory 9-Month After Receipt of Order (ARO) window.",
        "Detailed software license term tracking guaranteeing exactly 12 months of active coverage post-delivery.",
        "Shipping coordination, base access clearance, and receiving inspection protocols with 309th SWEG personnel.",
        "Warranty support contacts and escalation paths during the initial 12-month license lifecycle."
      ]
    },
    {
      section_title: "4.0 Cyber Safeguarding & National Security Compliance Attestation",
      key_points_to_cover: [
        "Affirmation of compliance with DFARS 252.204-7008 and 252.204-7012 safeguarding covered defense information.",
        "Current Supplier Performance Risk System (SPRS) summary score reference and NIST SP 800-171 self-assessment status.",
        "Certification of non-use of covered telecommunications equipment (DFARS 252.204-7017/7018) and ByteDance applications (FAR 52.204-27).",
        "Mandatory antiterrorism training and security awareness attestation per DFARS 252.204-7004."
      ]
    },
    {
      section_title: "5.0 Firm Fixed Price (FFP) Schedule & Multi-Year CLIN Breakdown",
      key_points_to_cover: [
        "Total Price summary table detailing CLIN 0001 (Base Year: 11/12/2026 - 11/11/2027) through CLIN 0005 (Option Year 4: 11/12/2030 - 11/11/2031).",
        "Confirmation that all pricing is Firm Fixed Price (FFP) and inclusive of shipping and destination delivery costs.",
        "Acknowledgment of electronic invoicing via Wide Area WorkFlow (WAWF) in accordance with DFARS 252.232-7006.",
        "Clear notation that Government reserves the right to cancel solicitation without cost reimbursement per Notice to Offerors."
      ]
    }
  ]
};

async function run() {
  const tableBorder = {
    top: { style: BorderStyle.SINGLE, size: 4, color: 'D1D5DB' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: 'D1D5DB' },
    left: { style: BorderStyle.SINGLE, size: 4, color: 'D1D5DB' },
    right: { style: BorderStyle.SINGLE, size: 4, color: 'D1D5DB' },
  };

  const headerShading = {
    fill: '1E293B',
    type: ShadingType.CLEAR,
    color: 'auto',
  };

  const analysis = hillAfbAnalysis;

  const doc = new Document({
    sections: [
      {
        properties: {},
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Generated with MicroRFP.ai — B2B Proposal Intelligence Engine',
                    italics: true,
                    color: '94A3B8',
                    size: 18,
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          new Paragraph({
            text: 'MicroRFP Strategy & Proposal Blueprint',
            heading: HeadingLevel.TITLE,
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Executive Bid Analysis, Compliance Matrix & Proposal Draft Outline',
                italics: true,
                color: '64748B',
                size: 22,
              }),
            ],
            spacing: { after: 360 },
          }),
          new Paragraph({
            text: '1. Opportunity Overview',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'RFP Title: ', bold: true }),
              new TextRun(analysis.title),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Issuing Agency: ', bold: true }),
              new TextRun(analysis.issuing_agency),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Opportunity / Solicitation ID: ', bold: true }),
              new TextRun(analysis.opportunity_number),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Submission Deadline: ', bold: true }),
              new TextRun(analysis.submission_deadline),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Estimated Budget / Ceiling: ', bold: true }),
              new TextRun(analysis.estimated_budget),
            ],
            spacing: { after: 240 },
          }),
          new Paragraph({
            text: '2. Bid / No-Bid Decision Scorecard',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Decision Verdict: ', bold: true }),
              new TextRun({
                text: `[ ${analysis.go_no_go_verdict} ]`,
                bold: true,
                color: 'B91C1C',
              }),
              new TextRun({
                text: `   (Score: ${analysis.go_no_go_score} / 100)`,
                bold: true,
              }),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Verdict Rationale & Strategic Assessment:',
                bold: true,
              }),
            ],
            spacing: { after: 80 },
          }),
          ...analysis.verdict_rationale.map(
            (point) =>
              new Paragraph({
                children: [new TextRun({ text: '•  ' }), new TextRun(point)],
                spacing: { after: 60 },
              })
          ),
          new Paragraph({
            text: '3. Key Qualifications & Risk Matrix',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 120 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBorder,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: headerShading,
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Category', bold: true, color: 'FFFFFF' })],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: headerShading,
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Requirement Description', bold: true, color: 'FFFFFF' })],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: headerShading,
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Risk Level', bold: true, color: 'FFFFFF' })],
                      }),
                    ],
                  }),
                ],
              }),
              ...analysis.key_requirements.map(
                (req) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [new TextRun({ text: req.category, bold: true })],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [new Paragraph(req.description)],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: req.risk_level,
                                bold: true,
                                color: req.risk_level === 'High' ? 'B91C1C' : req.risk_level === 'Medium' ? 'B45309' : '15803D',
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  })
              ),
            ],
          }),
          new Paragraph({
            text: '4. Compliance & Submission Matrix',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 120 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBorder,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: headerShading,
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Section', bold: true, color: 'FFFFFF' })],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: headerShading,
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Requirement', bold: true, color: 'FFFFFF' })],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: headerShading,
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Mandatory', bold: true, color: 'FFFFFF' })],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: headerShading,
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Proposal Manager Flag Note', bold: true, color: 'FFFFFF' })],
                      }),
                    ],
                  }),
                ],
              }),
              ...analysis.compliance_matrix.map(
                (comp) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph(comp.section_number)],
                      }),
                      new TableCell({
                        children: [new Paragraph(comp.requirement)],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph(comp.mandatory ? 'YES (Strict)' : 'Optional'),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: comp.flag_note,
                                italics: true,
                                color: '991B1B',
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  })
              ),
            ],
          }),
          new Paragraph({
            text: '5. Evaluation Criteria & Scoring Weights',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 120 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBorder,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: headerShading,
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Criterion Factor', bold: true, color: 'FFFFFF' })],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: headerShading,
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Scoring Weight', bold: true, color: 'FFFFFF' })],
                      }),
                    ],
                  }),
                ],
              }),
              ...analysis.evaluation_criteria.map(
                (crit) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph(crit.criterion)],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [new TextRun({ text: crit.weight, bold: true })],
                          }),
                        ],
                      }),
                    ],
                  })
              ),
            ],
          }),
          new Paragraph({
            text: '6. Draft Proposal Response Outline',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 160 },
          }),
          ...analysis.draft_proposal_outline.flatMap((section) => [
            new Paragraph({
              text: section.section_title,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 180, after: 80 },
            }),
            ...section.key_points_to_cover.map(
              (point) =>
                new Paragraph({
                  children: [
                    new TextRun({ text: '  [ ]  ', bold: true, color: '64748B' }),
                    new TextRun(point),
                  ],
                  spacing: { after: 60 },
                })
            ),
          ]),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(path.resolve('MicroRFP_Draft_FA8222-26-Q-3456.docx'), buffer);
  console.log('Successfully generated MicroRFP_Draft_FA8222-26-Q-3456.docx');
}

run().catch(console.error);
