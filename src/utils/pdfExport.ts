import { jsPDF } from 'jspdf';
import { DecisionAnalysisResult } from '../types';
import { calculateWeightedScores, calculateCriteriaDifferences } from './scoring';
import { getResearchFrameworks } from './researchFallback';

// Standard PDF Type1 fonts (Helvetica) only support WinAnsi (single-byte).
// Any character outside WinAnsi causes jsPDF to emit UTF-16 null-padded bytes,
// which doubles apparent character width and crops sentences at the right edge.
const WINANSI_SAFE_EXTENDED = new Set(['•', '—', '–', '“', '”', '‘', '’', '…', '™', '€']);

export function sanitizePdfText(input: string): string {
  if (!input) return '';

  let text = String(input)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, '  ')
    .replace(/[\u00A0\u2002-\u200A\u202F\u205F]/g, ' ')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/Δ/g, 'Delta')
    .replace(/λ/g, 'lambda')
    .replace(/≥/g, '>=')
    .replace(/≤/g, '<=')
    .replace(/≠/g, '!=')
    .replace(/≈/g, '~')
    .replace(/[→➔➜⟶]/g, '->')
    .replace(/[←⟵]/g, '<-')
    .replace(/↔/g, '<->')
    .replace(/⇒/g, '=>')
    .replace(/[✓✔]/g, '[OK]')
    .replace(/[✗✕]/g, '[X]')
    .replace(/[★☆]/g, '*');

  // Transliterate or strip any remaining code points > 255 outside WinAnsi
  let safe = '';
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code <= 255 || WINANSI_SAFE_EXTENDED.has(ch)) {
      safe += ch;
      continue;
    }
    const stripped = ch.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
    let asciiPart = '';
    for (const sCh of stripped) {
      const sCode = sCh.charCodeAt(0);
      if (sCode <= 255 || WINANSI_SAFE_EXTENDED.has(sCh)) {
        asciiPart += sCh;
      }
    }
    safe += asciiPart;
  }

  return safe;
}

function wrapTextStrict(doc: jsPDF, text: string, availableWidth: number): string[] {
  const clean = sanitizePdfText(text);
  const paragraphs = clean.split('\n');
  const result: string[] = [];

  for (const para of paragraphs) {
    if (!para.trim()) {
      result.push('');
      continue;
    }

    const initialLines = doc.splitTextToSize(para, availableWidth) as string[];
    for (const line of initialLines) {
      if (doc.getTextWidth(line) <= availableWidth) {
        result.push(line);
        continue;
      }

      // Hard-wrap unbroken tokens (e.g., long URLs or slash-joined identifiers)
      let current = '';
      for (const ch of line) {
        const candidate = current + ch;
        if (current.length > 0 && doc.getTextWidth(candidate) > availableWidth) {
          result.push(current);
          current = ch;
        } else {
          current = candidate;
        }
      }
      if (current.length > 0) {
        result.push(current);
      }
    }
  }

  return result;
}

export function exportDecisionToPdf(decision: DecisionAnalysisResult): string {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 44;
  const footerReserved = 28;
  const maxWidth = pageWidth - margin * 2;
  const bottomLimit = pageHeight - margin - footerReserved;
  let y = margin;

  const research = getResearchFrameworks(decision);
  const scoreResults = calculateWeightedScores(
    decision.weightedScoring.criteria,
    decision.weightedScoring.optionScores,
    {
      lossAversionLambda: 2.0,
      applyCialdiniDebias: true,
      cialdiniBiases: research.cialdiniInfluenceAudit.optionBiases,
      trompenaarsCoordinates: research.trompenaarsHampdenTurner.optionCoordinates,
    }
  );
  const criteriaDiffs = calculateCriteriaDifferences(
    decision.weightedScoring.criteria,
    decision.weightedScoring.optionScores
  );

  const ensureSpace = (neededHeight: number) => {
    if (y + neededHeight > bottomLimit) {
      doc.addPage();
      y = margin;
    }
  };

  const drawWrappedText = (
    text: string,
    options: {
      x?: number;
      fontSize?: number;
      isBold?: boolean;
      color?: [number, number, number];
      gapAfter?: number;
      lineFactor?: number;
      firstLinePrefix?: string;
    } = {}
  ) => {
    const x = options.x ?? margin;
    const fontSize = options.fontSize ?? 9.5;
    const isBold = options.isBold ?? false;
    const color = options.color ?? [31, 41, 55];
    const gapAfter = options.gapAfter ?? 4;
    const lineHeight = fontSize * (options.lineFactor ?? 1.38);
    const availableWidth = Math.max(120, pageWidth - margin - x);

    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);

    const lines = wrapTextStrict(doc, text, availableWidth);
    lines.forEach((line, idx) => {
      ensureSpace(lineHeight);
      if (idx === 0 && options.firstLinePrefix) {
        doc.text(sanitizePdfText(options.firstLinePrefix), margin, y);
      }
      if (line.length > 0) {
        doc.text(line, x, y);
      }
      y += lineHeight;
    });

    y += gapAfter;
  };

  const addSectionHeader = (title: string) => {
    ensureSpace(44);
    y += 8;
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(1);
    doc.line(margin, y, pageWidth - margin, y);
    y += 16;
    drawWrappedText(title.toUpperCase(), {
      fontSize: 11.5,
      isBold: true,
      color: [180, 83, 9],
      gapAfter: 6,
      lineFactor: 1.3,
    });
  };

  const addParagraph = (
    text: string,
    fontSize = 9.5,
    isBold = false,
    color: [number, number, number] = [31, 41, 55]
  ) => {
    drawWrappedText(text, { fontSize, isBold, color, gapAfter: 4 });
  };

  const addBullet = (label: string, body: string) => {
    drawWrappedText(`${label}: ${body}`, {
      x: margin + 10,
      fontSize: 9,
      isBold: false,
      color: [55, 65, 81],
      gapAfter: 3,
      firstLinePrefix: '•',
    });
  };

  // --- Cover / Header ---
  drawWrappedText('THE TIE BREAKER · v3.02 SUNBEAMGAIA EDITION', {
    fontSize: 9,
    isBold: true,
    color: [180, 83, 9],
    gapAfter: 6,
    lineFactor: 1.3,
  });

  drawWrappedText(decision.title, {
    fontSize: 16,
    isBold: true,
    color: [17, 24, 39],
    gapAfter: 4,
    lineFactor: 1.28,
  });

  drawWrappedText(
    `Generated on ${new Date().toLocaleDateString()} · ${decision.options.length} Options Evaluated`,
    {
      fontSize: 8.5,
      isBold: false,
      color: [107, 114, 128],
      gapAfter: 10,
      lineFactor: 1.3,
    }
  );

  addParagraph(decision.summary, 10, false, [31, 41, 55]);

  // --- 1. Definitive Verdict ---
  addSectionHeader('1. Definitive Tie-Breaker Verdict');
  addParagraph(
    `Recommended Option: ${decision.verdict.recommendedOptionName} (${decision.verdict.confidencePercentage}% Conviction)`,
    11,
    true,
    [6, 95, 70]
  );
  addParagraph(`"${decision.verdict.verdictHeadline}"`, 10, true, [17, 24, 39]);
  addParagraph(decision.verdict.coreRationale, 9.5);
  addBullet('When to Choose Alternative', decision.verdict.whenToPickAlternative);

  y += 4;
  addParagraph('48-Hour Execution Protocol:', 9.5, true, [17, 24, 39]);
  decision.verdict.immediateActions.forEach((step) => {
    addBullet(`Step ${step.step} (${step.timeframe})`, `${step.action} — Why: ${step.purpose}`);
  });

  // --- 2. Multi-Theory Scoring Summary ---
  addSectionHeader('2. Multi-Theory Decision Calculus Summary');
  scoreResults.forEach((res, idx) => {
    addParagraph(
      `Rank #${idx + 1}: ${res.optionName} — Linear ${res.percentage}% (${res.totalWeightedScore}/${res.maxPossibleScore} pts) | Simon Floors ${res.floorsCleared}/${res.totalFloors} | Kahneman Utility ${res.prospectAdjustedScore}% | Cialdini De-Biased ${res.debiasedScore}% | Trompenaars Helix ${res.reconciliationIndex}%`,
      9.2,
      true,
      [17, 24, 39]
    );
    if (!res.clearsAllFloors) {
      addBullet(
        'Simon Floor Breaches',
        res.failedFloors.map((f) => `${f.criterionName} (${f.score} < floor ${f.floor})`).join(', ')
      );
    }
  });

  y += 4;
  addParagraph('Top Divergence Axes (Ranked by Weighted Impact Gap):', 9.5, true, [17, 24, 39]);
  [...criteriaDiffs]
    .sort((a, b) => b.weightedImpactDelta - a.weightedImpactDelta)
    .forEach((d) => {
      addBullet(
        `${d.criterionName} [${d.christensenRole}, Wt ${d.weight}/10, Floor >= ${d.aspirationFloor}]`,
        `Gap Delta ${d.spreadDelta} (Weighted ${d.weightedImpactDelta}) — Edge: ${d.leaderOptionName}`
      );
    });

  // --- 3. Research & Paradox Reconciliation ---
  addSectionHeader('3. Research & Paradox Reconciliation Synthesis');
  addBullet(
    'Trompenaars & Hampden-Turner Helix',
    `X: ${research.trompenaarsHampdenTurner.poleXLabel} vs. Y: ${research.trompenaarsHampdenTurner.poleYLabel}. Target (10,10) Synthesis: ${research.trompenaarsHampdenTurner.reconciledHelixName} — ${research.trompenaarsHampdenTurner.reconciledSynthesis}`
  );
  addBullet(
    'Wendy K. Smith Both/And Strategy',
    `${research.wendySmithParadox.differentiationMove} ${research.wendySmithParadox.integrationMove} Plan: ${research.wendySmithParadox.bothAndActionPlan}`
  );
  addBullet(
    'Herbert Simon Satisficing Rule',
    `${research.herbertSimonBounded.satisficingRecommendation} Stopping Rule: ${research.herbertSimonBounded.searchStoppingRule}`
  );
  addBullet(
    'Clayton Christensen JTBD',
    `Core Job: ${research.christensenJTBD.coreJobToBeDone} (${research.christensenJTBD.hygieneVsMotivatorInsight})`
  );
  addBullet(
    'Kahneman & Hahnemannian Probe',
    `Outside View: ${research.kahnemanHahnemann.system2OutsideViewBaseRate} | Minimum-Dose Test: ${research.kahnemanHahnemann.hahnemannMinimumDoseTest}`
  );

  // --- 4. Pros & Cons ---
  addSectionHeader('4. Pros & Cons Deep-Dive');
  decision.prosAndCons.forEach((opt) => {
    addParagraph(opt.optionName, 10, true, [17, 24, 39]);
    opt.pros.forEach((p) => addBullet(`PRO [${p.category}] ${p.title}`, p.description));
    opt.cons.forEach((c) => addBullet(`CON [${c.category}] ${c.title}`, c.description));
    y += 4;
  });

  // --- 5. SWOT Matrix ---
  addSectionHeader('5. Strategic SWOT Analysis');
  decision.swotAnalysis.forEach((swot) => {
    addParagraph(`${swot.optionName} — ${swot.strategicTakeaway}`, 9.5, true, [17, 24, 39]);
    addBullet('Strengths', swot.strengths.join('; '));
    addBullet('Weaknesses', swot.weaknesses.join('; '));
    addBullet('Opportunities', swot.opportunities.join('; '));
    addBullet('Threats', swot.threats.join('; '));
    y += 4;
  });

  // --- Page Footers ---
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - margin - 14, pageWidth - margin, pageHeight - margin - 14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text('The Tie Breaker · v3.02 SUNBEAMGAIA EDITION', margin, pageHeight - margin);
    const pageLabel = `Page ${p} of ${totalPages}`;
    const labelWidth = doc.getTextWidth(pageLabel);
    doc.text(pageLabel, pageWidth - margin - labelWidth, pageHeight - margin);
  }

  // Safe filename slug
  const safeSlug = decision.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
  const fileName = `tie-breaker-${safeSlug || 'dossier'}.pdf`;

  doc.save(fileName);
  return fileName;
}
