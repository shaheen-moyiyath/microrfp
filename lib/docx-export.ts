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
import { saveAs } from 'file-saver';
import { RFPAnalysis } from '@/types/rfp';

export async function exportAnalysisToWord(analysis: RFPAnalysis): Promise<void> {
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
          // Document Header
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

          // Section 1: RFP Overview
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

          // Section 2: Go/No-Go Decision Scorecard
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
                color:
                  analysis.go_no_go_verdict === 'RECOMMENDED'
                    ? '15803D'
                    : analysis.go_no_go_verdict === 'RISKY'
                    ? 'B45309'
                    : 'B91C1C',
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

          // Section 3: Key Requirements & Risk Analysis
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
                        children: [
                          new TextRun({ text: 'Category', bold: true, color: 'FFFFFF' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: headerShading,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Requirement Description', bold: true, color: 'FFFFFF' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: headerShading,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Risk Level', bold: true, color: 'FFFFFF' }),
                        ],
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
                                color:
                                  req.risk_level === 'High'
                                    ? 'B91C1C'
                                    : req.risk_level === 'Medium'
                                    ? 'B45309'
                                    : '15803D',
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

          // Section 4: Compliance Matrix
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
                        children: [
                          new TextRun({ text: 'Section', bold: true, color: 'FFFFFF' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: headerShading,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Requirement', bold: true, color: 'FFFFFF' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: headerShading,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Mandatory', bold: true, color: 'FFFFFF' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: headerShading,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Proposal Manager Flag Note', bold: true, color: 'FFFFFF' }),
                        ],
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

          // Section 5: Evaluation Criteria
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
                        children: [
                          new TextRun({ text: 'Criterion Factor', bold: true, color: 'FFFFFF' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: headerShading,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Scoring Weight', bold: true, color: 'FFFFFF' }),
                        ],
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

          // Section 6: Draft Proposal Response Outline
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

  const blob = await Packer.toBlob(doc);
  const sanitizedTitle = (analysis.title || 'RFP_Proposal_Draft')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 40);
  saveAs(blob, `MicroRFP_Draft_${sanitizedTitle}.docx`);
}
