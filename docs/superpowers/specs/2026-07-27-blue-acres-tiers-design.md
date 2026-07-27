# Blue Acres Methodology — Tier Ladder Redesign

**Status:** Approved by Hazem 2026-07-27, ready for implementation planning.
**Page affected:** `/audit` (primary), plus sitewide "Blue Sigma" references, `caseStudies.ts`.

## Why

Two problems this redesign fixes at once:

1. The tier ladder had a three-week-old unresolved pricing question (Tier 2 live at $15-25K vs. an earlier ICP memo suggesting £4.5-7.5K) that was never actually a pricing error — it was a stale memo overtaken by a deliberate, reasoned re-price. Never closed the loop.
2. The Blue Sigma methodology (Six Sigma + Lean, Vital Six, S.H.R.I.M.P. Loop) was only ever applied to Tier 1. Tiers 2 and 3 were structurally disconnected from it and from each other — three separate offers, not a ladder.

This redesign renames the methodology to **The Blue Acres Methodology**, applies it across all three rungs, and restructures the three tiers into a real Hormozi-style ascension ladder — including retiring the one-time "Investor-Ready Enterprise" capstone in favour of a recurring retainer, which directly serves Hazem's standing subscription-revenue priority ($50K+/month MRR target).

## Naming

"The Blue Acres Methodology" replaces "Blue Sigma method" everywhere client-facing. This is a straight rename — the underlying vocabulary and rules from the original methodology carry over unchanged:

- Client-facing: Vital Six, S.H.R.I.M.P. Loop, the honesty guardrail (improves controllable process, never promises price/weather).
- Internal-only, never in public copy: Lean + Six Sigma + Kaizen blend, named internal tools (Pond Waste Walk™, Variation Killer™, etc.), the DOWNTIME waste taxonomy. **Hard rule unchanged: never use the words "Six Sigma" in any client-facing page or code comment.**

## The Ladder

| Rung | Name | Type | Price | Status |
|---|---|---|---|---|
| 1 | The Farm Profit-Leak Audit | One-time diagnostic | $4,500–$7,500 (30 days) | Unchanged |
| 2 | 90-Day Farm Profitability Transformation | One-time sprint, two configurations | $15,000 base / $25,000 with Investor-Ready add-on | Restructured |
| 3 | Continuous Protection | Recurring retainer | $3,000–$6,000/month | New — replaces "Investor-Ready Enterprise Programme" |

Every rung's card carries the same visible attribution — a small "Built on the Blue Acres Methodology" badge near the tier name/price, identical placement across all three cards. This is in addition to (not instead of) the existing methodology explainer section between the hero and the tier cards, which gets renamed and reframed as the umbrella for all three rungs rather than a Tier-1-only reference.

## Rung 1 — The Farm Profit-Leak Audit

No content changes. Keeps its existing 20-30 variable model, Vital Six tracker deliverable, honesty guardrail, and Jotform application flow (`https://form.jotform.com/261731704452049`) untouched. Adds only the methodology badge.

**Decision, not open for silent revision later:** do not shrink this to the Blue Sigma source doc's shorter "Scan" ($2,500-$4,500, 5-7 days). That's a different, cheaper product with a shallower diagnostic — the current 30-day version already converts via a tested application flow, and a shallower Scan produces a weaker anchor for the Sprint pitch. Keep as-is.

## Rung 2 — 90-Day Farm Profitability Transformation

One card, two configurations — not two separate cards.

- **Base ($15,000):** everything live today unchanged — 20-30 variable model, 10-percentage-point margin guarantee (waived if missed), quarterly scarcity (3 operators/quarter), probiotic protocol chapter.
- **+ Investor-Ready Package (+$10,000 → $25,000 total):** a toggle/checkbox on the same card reveals and adds the folded-in capital-raise deliverables previously living in the standalone "Investor-Ready Enterprise Programme" tier — financial model, operational manual, risk register, pre-close operational review.

**Pricing decision, closed:** keep $15,000-$25,000. Do not revert to the £4.5-7.5K figure from the earlier ICP memo. Rationale (sales-council pass, 2026-07-27): that figure predates the current 10pp margin guarantee mechanic and was never re-tested against it; $15-25K against a $200K-2M/year operation is 0.8%-12.5% of annual revenue, normal high-ticket B2B range for a guaranteed outcome worth $20K-$200K/year in EBITDA. The Blue Sigma source doc's own suggested price for its equivalent tier ($18,000-$30,000) independently confirms this band. **Action item:** update the `icp-positioning` memory to reflect $15-25K as the confirmed, tested flagship price, closing the three-week-old open question there.

**Data model:** `AuditPage.tsx`'s existing `TierKeys`/`includesKeys` pattern extends with a new `investorAddOnKeys` array, rendered only when the toggle is on. The `ApplicationModal` → `audit_applications` Supabase flow needs a field recording which configuration was selected, so Hazem's notification email shows "$25,000 — with Investor-Ready" rather than a bare number.

## Rung 3 — Continuous Protection (new)

Recurring retainer, $3,000-$6,000/month. Replaces "Investor-Ready Enterprise Programme" as a public tier entirely — that tier's capital-raise content is now Rung 2's add-on, not a separate offer.

**Deliverables:**
- Monthly Vital Six review + variance flagging
- Quarterly mini-Scan refresh
- Priority response access
- Control-chart / KPI-bank maintenance (ties to the S.H.R.I.M.P. Loop's "Master" and "Protect" stages)

**Guarantee:** monitoring-based, not outcome-based — distinct mechanism from Rung 2's margin guarantee. "If a tracked Vital Six metric drifts outside its control limit and we don't flag it within 48 hours, that month is free." Do not present this as the same kind of guarantee as the Sprint's — it protects a different thing (detection speed, not a margin number) and the comparison table must not collapse the two into one "Guarantee" row.

**Rollout pricing note:** start new Continuous clients at the $3,000-$4,000 end until 2-3 real retainer case studies exist, then move toward $6,000. This is a commercial sequencing decision for Hazem's own client conversations, not a website change.

**Application flow:** reuses the existing `ApplicationModal` pattern — a new `tier: 'continuous'` value on the existing `audit_applications` Supabase table (not a new table; the fields — name, email, farm details — are the same shape as the other two tiers).

## Ascension Mechanics

- **Scan → Sprint:** no dollar-for-dollar credit from the Scan fee (would undervalue it as real work). The Scan's own scored dollar-leak estimate is already the Sprint's price justification — no new mechanic needed there. Optional, not required for launch: a time-boxed incentive ("$750 off if you start the Sprint within 30 days of your Scan results").
- **Sprint → Continuous:** the primary ascension mechanic. **First 30 days of Continuous Protection included automatically at Sprint hand-off — opt-out, not opt-in.** Framed as loss-aversion ("lock in the gain you just paid for — don't let it erode"), not a fresh sales pitch.
  - **Scope boundary:** the actual enrollment at hand-off is an operational process step (Hazem's team flags it in Supabase/Resend when a Sprint engagement closes), not something the website automates by itself. The website's job is to make Continuous Protection exist as a real page/offer/signup flow that this handoff points to — not to build automatic tier-transition logic. If Hazem wants a lightweight internal trigger for this later, that's a separate, explicitly-scoped follow-up.

## Content Changes

**Rewritten:**
- `audit.t3*` translation keys — full replacement (Investor-Ready Enterprise copy → Continuous Protection)
- `audit.t2*` keys — add toggle copy + `investorAddOnKeys` bullets, adjust the promise paragraph
- Comparison table — new Continuous column; guarantee row split into two (margin guarantee vs. monitoring guarantee are different mechanisms)
- Every public "Blue Sigma method" string sitewide → "Blue Acres Methodology" (exact occurrence count to be confirmed by grep during implementation, not guessed here)
- Methodology intro section on `/audit` — rename + reframe as the umbrella for all three rungs
- `/audit` page SEO title/description — check for stale tier-name references

**Unchanged:**
- Tier 1 content entirely
- Tier 2's base $15K deliverables, 10pp margin guarantee, quarterly scarcity
- Homepage `ConsultationBanner` (still points at `/audit`/`/consultation`) and AboutPage's soft-offer section — both still link correctly, no forced rewrite

**Schema addition:** `caseStudies.ts` gets an optional `relatedTier` field so the "$1.2M Investment Secured" case study can explicitly link to the Sprint+Investor-Ready configuration instead of floating unattached to any tier.

**JSON-LD:** `hasOfferCatalog` on `/audit` needs Tier 2 to reflect two price points ($15K/$25K) and Tier 3 to reflect a recurring offer (schema.org `PriceSpecification` with a billing-period equivalent, or a simpler description-based representation — exact approach decided during implementation).

## Verification Plan

No browser available in this sandbox (confirmed repeatedly across prior sessions). Verification follows the established pattern:

1. `tsc -b`, `npm run build`, `eslint` all clean
2. Grep the built JS bundle to confirm old strings ("Investor-Ready Enterprise", "Blue Sigma") are gone and new copy ("Blue Acres Methodology", "Continuous Protection") is present
3. SSR-render `AuditPage.tsx` (Vite `ssrLoadModule` + `react-dom/server`) with both toggle states to catch runtime errors in the new interactive state
4. **Explicitly not covered:** the toggle's actual click behaviour, visual layout of the new Continuous Protection card, and comparison table rendering — Hazem needs to click through once this is live, same caveat as every other UI change this session.

## Open Items Carried Into the Implementation Plan (not blocking spec approval)

- Exact grep count and locations of "Blue Sigma" references sitewide
- Exact JSON-LD representation for a recurring offer
- Whether the Scan→Sprint $750 time-boxed incentive ships at launch or is deferred
