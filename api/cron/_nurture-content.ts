// Shared copy for the Day 1 / Day 3 / Day 7 nurture sequence sent by
// send-nurture.ts. Kept as one skeleton per touch + an 8-way diagnosis
// paragraph swapped in per top-leak category, rather than 24 separate emails.
//
// DRAFT — none of this sends live until NURTURE_LIVE_SEND=true is set AND
// this copy has been reviewed and approved (see the plan / conversation
// this was built from). Until then send-nurture.ts runs in dry-run/log mode.

export const CATEGORY_NAMES: Record<number, string> = {
  1: 'Feed Efficiency & FCR',
  2: 'Survival & Disease Pressure',
  3: 'Water Quality Management',
  4: 'Stocking & Density Discipline',
  5: 'Financial Visibility',
  6: 'Operations & SOPs',
  7: 'Infrastructure & Aeration',
  8: 'Market Position & Revenue',
}

// Day 1 — restates the score, diagnoses the #1 leak category in Hazem's voice.
export const CATEGORY_DIAGNOSIS: Record<number, string> = {
  1: "An FCR in the range you reported isn't unusual — it's also not free. Every 0.2 above 1.5 on a mid-size vannamei operation is real feed cost that never turns into biomass. It's fixable, and it's usually not a feed quality problem — it's a feeding-schedule and water-quality problem wearing a feed-cost disguise.",
  2: "Survival swings like the one you reported usually trace back to one of three things: stocking density mismatched to your system, biosecurity gaps at the pond edge, or a monitoring gap that means you find out too late. Worth knowing which before your next cycle.",
  3: "Water quality gaps rarely show up as a single dramatic crash — they show up as three or four smaller harvests in a row that never quite get explained. Dissolved oxygen and ammonia don't wait for your monitoring schedule; if you're not measuring at the times stress actually happens, the numbers on your log sheet are telling you the farm was fine when it wasn't.",
  4: "Stocking density set once and never revisited against seasonal water temperature and your actual aeration capacity is one of the most common leaks I see — and one of the cheapest to fix, because it doesn't need new equipment, just a different number on the stocking plan.",
  5: "If you can't say what your breakeven cost per kilogram was on your last cycle within a few cents, you're not managing a farm — you're managing a guess. That's not a judgement, it's the single most common gap I find on-site, and it's usually the first thing that changes once someone starts tracking it properly.",
  6: "Farms without written procedures run fine until the person who holds all the knowledge in their head is unavailable for a week. What you reported suggests some of your critical response windows — especially overnight — depend on judgement calls instead of a documented threshold. That gap costs the most exactly when you can least afford it.",
  7: "Aeration capacity that was right for the stocking density you started with two years ago is rarely right for the density you're running now. Infrastructure doesn't announce that it's become the bottleneck — it just quietly caps your yield below what your biology could otherwise deliver.",
  8: "Everything upstream — feed, survival, water quality — can be dialled in, and you can still leave money on the table at the point of sale if pricing and channel strategy haven't kept pace with your production quality. This is usually the fastest leak to close, because it doesn't require touching the ponds at all.",
}

// Day 3 — one connecting sentence per category, pointing at the case study
// in src/data/caseStudies.ts (index) whose challenge matches most closely.
export const CATEGORY_CASE_STUDY: Record<number, { index: 0 | 1 | 2; connector: string }> = {
  1: { index: 0, connector: 'A 120-hectare operation had the same FCR climb — the cause wasn\'t feed quality, it was aeration misalignment nobody had measured for.' },
  2: { index: 2, connector: 'A first-cycle survival rate of 34% turned into 82% by cycle three — once the actual design gaps were identified instead of guessed at.' },
  3: { index: 0, connector: 'Chronic low-grade hypoxia was the real diagnosis here, not disease — and it had been misdiagnosed for 18 months before someone measured it properly.' },
  4: { index: 0, connector: 'Reducing stocking density 15% in the highest-density blocks — not adding equipment — was most of what fixed this one.' },
  5: { index: 1, connector: 'Three investor conversations had stalled before this farm could even say what their cost-per-kg actually was.' },
  6: { index: 2, connector: 'Twelve sessions of written, system-specific SOPs turned a 34% survival rate into 82% within two cycles.' },
  7: { index: 2, connector: 'The supplier blamed the operators. An independent audit found three real design gaps — and got partial remediation funded because of it.' },
  8: { index: 1, connector: 'The fix here wasn\'t operational at all — it was making the financials auditable enough that an investor could say yes.' },
}

export function fmtUsd(n: number): string {
  return n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`
}

export function buildDay1Html(params: { score: number; topCategoryId: number }): { subject: string; html: string } {
  const categoryName = CATEGORY_NAMES[params.topCategoryId] ?? 'your top leak category'
  const diagnosis = CATEGORY_DIAGNOSIS[params.topCategoryId] ?? ''

  return {
    subject: `Your Leak Index: ${params.score} — what ${categoryName} is costing you`,
    html: `<div style="font-family:Georgia,'Times New Roman',serif;color:#111;max-width:600px;margin:0 auto;">
  <p style="font-size:14px;line-height:1.6;margin:0 0 16px 0;">
    You scored <strong>${params.score}</strong> on the Farm Health Diagnostic. ${categoryName} is where you're leaking the most.
  </p>
  <p style="font-size:14px;line-height:1.6;margin:0 0 20px 0;">${diagnosis}</p>
  <p style="font-size:14px;line-height:1.6;margin:0 0 24px 0;">
    Full breakdown is in the report you already have. If you want it walked through:
  </p>
  <a href="https://form.jotform.com/261731896819068" style="display:inline-block;background:#CA8A04;color:#0a1628;font-weight:bold;font-size:13px;letter-spacing:0.05em;text-transform:uppercase;text-decoration:none;padding:14px 28px;border-radius:4px;">
    Book 15 minutes, free
  </a>
  <p style="margin-top:32px;font-size:11px;color:#777;border-top:1px solid #ccc;padding-top:12px;">
    Hazem Shannak, Director &amp; Business Growth Architect · hazemshannak.cc · connect@hazemshannak.cc
  </p>
</div>`,
  }
}

export function buildDay3Html(params: { topCategoryId: number; caseStudy: { client: string; challenge: string; outcome: string; metric: string; metricLabel: string } }): { subject: string; html: string } {
  const meta = CATEGORY_CASE_STUDY[params.topCategoryId]
  const connector = meta?.connector ?? ''

  return {
    subject: `How ${params.caseStudy.client} fixed a similar leak`,
    html: `<div style="font-family:Georgia,'Times New Roman',serif;color:#111;max-width:600px;margin:0 auto;">
  <p style="font-size:14px;line-height:1.6;margin:0 0 16px 0;">${connector}</p>
  <div style="border:1px solid #ccc;border-radius:4px;padding:16px 18px;margin:0 0 20px 0;">
    <p style="font-size:20px;font-weight:bold;margin:0 0 2px 0;color:#8B6914;">${params.caseStudy.metric}</p>
    <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#666;margin:0 0 12px 0;">${params.caseStudy.metricLabel}</p>
    <p style="font-size:13px;line-height:1.6;margin:0;">${params.caseStudy.outcome}</p>
  </div>
  <p style="font-size:14px;line-height:1.6;margin:0 0 24px 0;">
    Same diagnostic process is behind every one of these. Worth 15 minutes to see what it finds on your farm.
  </p>
  <a href="https://hazemshannak.cc/audit" style="display:inline-block;background:#CA8A04;color:#0a1628;font-weight:bold;font-size:13px;letter-spacing:0.05em;text-transform:uppercase;text-decoration:none;padding:14px 28px;border-radius:4px;">
    See the Audit Programme
  </a>
  <p style="margin-top:32px;font-size:11px;color:#777;border-top:1px solid #ccc;padding-top:12px;">
    Hazem Shannak, Director &amp; Business Growth Architect · hazemshannak.cc · connect@hazemshannak.cc
  </p>
</div>`,
  }
}

export function buildDay7Html(params: { leakLow: number; leakHigh: number; cycleDeadline?: string }): { subject: string; html: string } {
  const leakRange = `${fmtUsd(params.leakLow)}–${fmtUsd(params.leakHigh)}`
  const deadlineLine = params.cycleDeadline
    ? `<p style="font-size:14px;line-height:1.6;margin:0 0 20px 0;">Based on the cycle timing you gave us, that means starting by <strong>${params.cycleDeadline}</strong> to have fixes in place before you stock.</p>`
    : ''

  return {
    subject: `${leakRange} a year — here's the fix`,
    html: `<div style="font-family:Georgia,'Times New Roman',serif;color:#111;max-width:600px;margin:0 auto;">
  <p style="font-size:14px;line-height:1.6;margin:0 0 16px 0;">
    Your diagnostic estimated <strong>${leakRange} a year</strong> in leaks across your farm. The Tier 1 Diagnostic Audit
    prices every one of them from your own numbers, starting at $5,000, delivered 2–3 weeks from contract signing.
  </p>
  ${deadlineLine}
  <p style="font-size:14px;line-height:1.6;margin:0 0 24px 0;">
    No pressure either way — this is the last email in this sequence. If it's not the right time, the report stays yours.
  </p>
  <a href="https://form.jotform.com/261731704452049" style="display:inline-block;background:#CA8A04;color:#0a1628;font-weight:bold;font-size:13px;letter-spacing:0.05em;text-transform:uppercase;text-decoration:none;padding:14px 28px;border-radius:4px;">
    Book the Tier 1 Audit
  </a>
  <p style="margin-top:32px;font-size:11px;color:#777;border-top:1px solid #ccc;padding-top:12px;">
    Hazem Shannak, Director &amp; Business Growth Architect · hazemshannak.cc · connect@hazemshannak.cc
  </p>
</div>`,
  }
}
