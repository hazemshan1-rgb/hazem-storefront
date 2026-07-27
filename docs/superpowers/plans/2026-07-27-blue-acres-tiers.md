# Blue Acres Methodology — Tier Ladder Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/audit`'s tier ladder around "The Blue Acres Methodology" — rename Blue Sigma sitewide, give Tier 2 a base/Investor-Ready-add-on toggle, and replace the retired "Investor-Ready Enterprise Programme" Tier 3 with a new "Continuous Protection" recurring retainer.

**Architecture:** Content-heavy React/TypeScript change, not a new subsystem. Extends the existing `TierKeys`/`includesKeys` pattern in `AuditPage.tsx`, extends the existing `AuditApplicationInput`/`ApplicationModal` flow with one new optional field, and rewrites the `audit.*` translation namespace. No new backend tables, no new routes.

**Tech Stack:** React 19, TypeScript, react-i18next, Supabase, Vercel edge functions — all existing, unchanged.

## Global Constraints (from spec `docs/superpowers/specs/2026-07-27-blue-acres-tiers-design.md`)

- Never use the words "Six Sigma" in any client-facing page or code comment. "The Blue Acres Methodology" is the only public name.
- Tier 1 pricing/scope/duration: **unchanged** ($4,500–$7,500, 30 days).
- Tier 2 base pricing: **unchanged** ($15,000, 10pp margin guarantee, quarterly scarcity) — do not revert toward £4.5-7.5K, that question is closed (see [[icp-positioning]]).
- Tier 2 + Investor-Ready add-on: **$10,000 on top** ($25,000 total).
- Tier 3 renamed "Continuous Protection," $3,000–$6,000/month, monitoring guarantee (not a margin guarantee).
- British spelling throughout new copy (optimise, colour, etc. — N/A in this specific copy, but keep the convention).

## ⚠️ Correction found during planning (not in the original spec)

The spec said "no dollar-for-dollar credit from the Scan fee" for the Tier 1→2 ascension. **That's wrong — a 100% credit already exists, is live, and is untouched by this redesign.** `translation.json`'s `t1UpgradeCredit` ("100% of this investment credited toward Tier 2 if you upgrade within 30 days...") and `upg1From`/`upg1Detail` are a real, already-shipped mechanic I hadn't read before writing the spec. **This plan leaves that mechanic completely alone** — the only upgrade-path change is `upg2` (Tier 2 → Tier 3), which gets repointed from the old "$5K discount toward Investor-Ready" to the new Sprint→Continuous mechanic. `upg3` (Tier 1 → Tier 3, "not recommended") is **removed outright** — it doesn't make sense once Tier 3 is a monitoring retainer rather than an investor programme; there's nothing to monitor yet if you skip Tier 2.

---

## Task 1: Add the Investor-Ready add-on field to the application flow

**Files:**
- Modify: `src/lib/auditApplication.ts:3-12` (interface), `:21-30` (insert call)
- Modify: `api/audit-application.ts:14-23` (interface), `:26-34` (email rows)
- Modify: `src/components/audit/ApplicationModal.tsx` (accept and forward the flag)
- Modify: `src/pages/AuditPage.tsx` (state to carry the flag through to the modal)

**Interfaces:**
- Produces: `AuditApplicationInput.investorAddOn?: boolean` — consumed by the Supabase insert and the notification email. `ApplicationModalProps.investorAddOn?: boolean` — read-only, passed down from `AuditPage`.

- [ ] **Step 1: Widen `AuditApplicationInput` and the Supabase insert**

In `src/lib/auditApplication.ts`, change:

```typescript
export interface AuditApplicationInput {
  tier: 2 | 3
  name: string
  email: string
  farmLocation: string
  monthlyRevenueBand: string
  pondCount?: string
  species?: string
  biggestProblem: string
  investorAddOn?: boolean
}
```

And in the insert call, add one line:

```typescript
  const { error } = await supabase.from('audit_applications').insert({
    tier: input.tier,
    name: input.name,
    email: input.email,
    farm_location: input.farmLocation,
    monthly_revenue_band: input.monthlyRevenueBand,
    pond_count: input.pondCount || null,
    species: input.species || null,
    biggest_problem: input.biggestProblem,
    investor_add_on: input.investorAddOn ?? false,
  })
```

- [ ] **Step 2: Add the Supabase column**

Run against the `audit_applications` table (via Supabase SQL editor or CLI):

```sql
alter table audit_applications add column if not exists investor_add_on boolean not null default false;
```

- [ ] **Step 3: Widen the edge function's notification email**

In `api/audit-application.ts`, add `investorAddOn?: boolean` to `ApplicationBody`, and in `buildNotificationHtml`'s `rows` array, add one row right after `Tier`:

```typescript
interface ApplicationBody {
  tier?: number
  name?: string
  email?: string
  farmLocation?: string
  monthlyRevenueBand?: string
  pondCount?: string
  species?: string
  biggestProblem?: string
  investorAddOn?: boolean
}
```

```typescript
  const rows: [string, string][] = [
    ['Tier', body.tier === 2 && body.investorAddOn ? 'Tier 2 — with Investor-Ready ($25,000)' : `Tier ${body.tier}`],
    ['Name', body.name ?? ''],
    ...
```

- [ ] **Step 4: Thread the flag through `ApplicationModal` and `AuditPage`**

In `AuditPage.tsx`, change the apply state from `useState<2 | 3 | null>(null)` to carry the add-on flag:

```typescript
const [applyTier, setApplyTier] = useState<{ tier: 2 | 3; investorAddOn: boolean } | null>(null)
```

Update every `onApply` callsite's type from `(tierId: 2 | 3) => void` to `(tierId: 2 | 3, investorAddOn?: boolean) => void` in `TierCTA`, `TierCard`, `TierDetail` prop signatures, and change their calls from `onApply(tier.id as 2 | 3)` to `onApply(tier.id as 2 | 3, tier.id === 2 ? investorAddOnSelected : undefined)` (the `investorAddOnSelected` local toggle state is added in Task 3). The final CTA button (`onClick={() => setApplyTier(2)}`) and the `ApplicationModal` render call both update to the new shape:

```typescript
<ApplicationModal
  tier={applyTier?.tier ?? null}
  investorAddOn={applyTier?.investorAddOn ?? false}
  onClose={() => setApplyTier(null)}
/>
```

In `ApplicationModal.tsx`, add `investorAddOn?: boolean` to `ApplicationModalProps` and pass it through to `submitAuditApplication`:

```typescript
interface ApplicationModalProps {
  tier: 2 | 3 | null
  investorAddOn?: boolean
  onClose: () => void
}
```

```typescript
const result = await submitAuditApplication({
  tier: tier as 2 | 3,
  investorAddOn,
  name: name.trim(),
  ...
```

- [ ] **Step 5: Verify**

```bash
npx tsc -b
```
Expected: clean, no type errors from the widened `onApply`/`ApplicationModalProps` signatures.

- [ ] **Step 6: Commit**

```bash
git add src/lib/auditApplication.ts api/audit-application.ts src/components/audit/ApplicationModal.tsx src/pages/AuditPage.tsx
git commit -m "feat: thread Investor-Ready add-on flag through the Tier 2 application flow"
```

---

## Task 2: Rewrite Tier 3 translation content — Investor-Ready Enterprise → Continuous Protection

**Files:**
- Modify: `src/locales/en/translation.json` — `audit.t3*` keys

**Interfaces:**
- Produces: the exact key names `t3Name`, `t3Tagline`, `t3Price`, `t3PriceSub`, `t3Length`, `t3BestFor`, `t3Promise`, `t3Guarantee`, `t3GuaranteeShort`, `t3Payment`, `t3LeadTime`, `t3Availability`, `t3CtaLabel`, `t3CtaNote`, `t3P1Name/Label/Detail` through `t3P3Name/Label/Detail` (3 phases, down from 6), `t3Inc1`–`t3Inc7` (7 items, down from 12), `t3Exc1`–`t3Exc3` — all consumed by `AuditPage.tsx`'s existing `tiers[2]` object in Task 4.

- [ ] **Step 1: Replace the `t3*` block in `translation.json`**

Replace every key listed below with this exact content (values only — keep the surrounding JSON structure/indentation matching the file's existing style):

```
t3Name: "Continuous Protection"
t3Tagline: "Lock in the gain. Don't let it erode."
t3Price: "$3,000 – $6,000/month"
t3PriceSub: "Single-site, under 10 ponds: $3,000/month. 10–30 ponds: $4,500/month. Multiple species or multiple sites: $6,000/month."
t3Length: "Ongoing, month-to-month"
t3BestFor: "Farms that have already fixed the big leaks — through the 90-Day Transformation or their own operations — and want the daily discipline maintained without hiring internally for it."
t3Promise: "Every month, I review your Vital Six numbers against the control limits we set, catch drift before it becomes a lost cycle, and keep your team accountable to the system. This is not a new engagement — it's the insurance policy on the gain you already paid for."
t3Guarantee: "If a tracked Vital Six metric drifts outside its control limit and I don't flag it to you within 48 hours, that month is free. This is a monitoring guarantee, not a margin guarantee — it protects the speed of detection, not a fixed number, because an open-ended retainer can't honestly promise the same thing a scoped 90-day sprint can."
t3GuaranteeShort: "Miss a control-limit breach by more than 48 hours, that month is free."
t3Payment: "Billed monthly, cancel with 30 days' notice. First 30 days included at no charge for anyone completing the 90-Day Transformation."
t3LeadTime: "Starts immediately at Tier 2 hand-off, or within 2 weeks of signing for a standalone start."
t3Availability: "Onboarding capacity reviewed monthly — ask on your discovery call or Sprint close-out."
t3CtaLabel: "Start Continuous Protection →"
t3CtaNote: "I review every application personally before we begin."
t3P1Name: "Phase 1"
t3P1Label: "Baseline & Control Limits"
t3P1Detail: "If you're coming straight from the 90-Day Transformation, your control limits are already set from that engagement. Starting standalone, I spend the first 2 weeks setting control limits on your Vital Six from your own historical data — the thresholds that define normal variation versus something that needs a call."
t3P2Name: "Phase 2"
t3P2Label: "Monthly Review Cycle"
t3P2Detail: "Every month: your Vital Six data reviewed against control limits, variances flagged within 48 hours, a short written summary, and a call if anything needs a decision from you. Priority response if something urgent comes up between scheduled reviews."
t3P3Name: "Phase 3"
t3P3Label: "Quarterly Refresh"
t3P3Detail: "Every quarter, a mini-Scan — a lighter version of the Tier 1 diagnostic — to catch anything the monthly monitoring wouldn't: new leak sources, equipment drift, crew turnover effects. Control limits get recalibrated if your operation has genuinely changed."
t3Inc1: "Monthly Vital Six review against your control limits"
t3Inc2: "48-hour variance-flagging guarantee"
t3Inc3: "Quarterly mini-Scan refresh"
t3Inc4: "Priority response access between scheduled reviews"
t3Inc5: "Control-chart and KPI-bank maintenance"
t3Inc6: "Monthly written summary and call if action is needed"
t3Inc7: "First 30 days free for 90-Day Transformation graduates"
t3Exc1: "Not a new diagnostic — if you haven't had a Tier 1 or Tier 2 engagement, control limits are set from scratch in Phase 1"
t3Exc2: "Not investor documentation or capital-raise support — that's the Investor-Ready add-on inside Tier 2"
t3Exc3: "Not a guarantee of a specific margin number — see the monitoring guarantee above"
```

Delete `t3P4Name/Label/Detail`, `t3P5Name/Label/Detail`, `t3P6Name/Label/Detail`, `t3Inc8`–`t3Inc12` entirely (they're replaced, not extended — the old 6-phase/12-include Investor-Ready structure is gone).

- [ ] **Step 2: Verify JSON is valid**

```bash
node -e "JSON.parse(require('fs').readFileSync('src/locales/en/translation.json', 'utf8')); console.log('valid JSON')"
```
Expected: `valid JSON`

- [ ] **Step 3: Commit**

```bash
git add src/locales/en/translation.json
git commit -m "content: rewrite Tier 3 — Investor-Ready Enterprise to Continuous Protection"
```

---

## Task 3: Tier 2 Investor-Ready add-on toggle (content + component)

**Files:**
- Modify: `src/locales/en/translation.json` — new `audit.t2Addon*` keys
- Modify: `src/pages/AuditPage.tsx` — `TierDetail` component, `tiers[1]` object

**Interfaces:**
- Produces: `TierKeys.investorAddOnKeys?: string[]` (new optional field on the type), local state `investorAddOnSelected` in `TierDetail`.

- [ ] **Step 1: Add new translation keys**

```
t2AddonToggleLabel: "+ Investor-Ready Package (+$10,000)"
t2AddonToggleNote: "For operators who also want to raise capital or position for sale."
t2AddonIncludesIntro: "With the Investor-Ready Package added:"
t2AddonInc1: "Financial model, business plan, and risk register for investor or buyer due diligence"
t2AddonInc2: "Pitch deck and investor teaser"
t2AddonInc3: "Virtual data room setup"
t2AddonInc4: "Five pre-vetted capital source introductions"
t2AddonInc5: "Pre-close operational review to remediate investor objections"
t2PriceWithAddon: "$25,000"
methodologyBadge: "Built on the Blue Acres Methodology"
```

(This reuses the real content from the old Tier 3's investor deliverables — same substance, now framed as an add-on rather than a separate 180-day tier.)

- [ ] **Step 2: Extend `TierKeys` type and `tiers[1]` in `AuditPage.tsx`**

```typescript
type TierKeys = {
  id: number
  nameKey: string; taglineKey: string; priceKey: string; priceSubKey: string; lengthKey: string
  bestForKey: string; promiseKey: string; guaranteeKey: string; guaranteeShortKey: string
  paymentKey: string; leadTimeKey: string; availabilityKey?: string
  phases: { nameKey: string; labelKey: string; detailKey: string }[]
  includesKeys: string[]; excludesKeys: string[]
  investorAddOnKeys?: string[]
  ctaLabelKey: string; ctaNoteKey: string
}
```

Add `investorAddOnKeys` to the Tier 2 object (`id: 2`), right after `excludesKeys`:

```typescript
    investorAddOnKeys: ['audit.t2AddonInc1', 'audit.t2AddonInc2', 'audit.t2AddonInc3', 'audit.t2AddonInc4', 'audit.t2AddonInc5'],
```

- [ ] **Step 3: Add the toggle to `TierDetail`**

`TierDetail` needs local state for the toggle, only rendered for Tier 2. Add near the top of the function:

```typescript
function TierDetail({ tier, reversed = false, onApply }: { tier: TierKeys; reversed?: boolean; onApply: (tierId: 2 | 3, investorAddOn?: boolean) => void }) {
  const { t } = useTranslation()
  const ref = useScrollReveal<HTMLElement>()
  const featured = tier.id === 2
  const [addonSelected, setAddonSelected] = useState(false)
```

Right after the `<div className="mb-8"><PhasesAccordion .../></div>` block (before "What You Get"), add the toggle for Tier 2 only:

```tsx
          {tier.id === 2 && tier.investorAddOnKeys && (
            <label className="flex items-start gap-3 mb-6 p-3 rounded-sm border border-[var(--color-gold-cta)]/40 cursor-pointer">
              <input
                type="checkbox"
                checked={addonSelected}
                onChange={e => setAddonSelected(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                <span className="block text-xs font-semibold text-[var(--color-gold-cta)]">{t('audit.t2AddonToggleLabel')}</span>
                <span className="block text-[10px] text-[var(--color-text-muted-dark)] mt-0.5">{t('audit.t2AddonToggleNote')}</span>
              </span>
            </label>
          )}
```

In the "What You Get" `<ul>`, append the add-on items when selected, right after the existing `tier.includesKeys.map(...)` block:

```tsx
            {addonSelected && tier.investorAddOnKeys?.map((key, i) => (
              <li key={`addon-${i}`} className="flex items-start gap-2.5">
                <svg className="shrink-0 mt-0.5" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 6l2.5 2.5L10 3.5" stroke="#CA8A04" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs leading-relaxed text-[var(--color-gold-cta)]">{t(key)}</span>
              </li>
            ))}
```

Update the sidebar price display (the `t(tier.priceKey)` line in the sticky sidebar) to reflect the toggle for Tier 2:

```tsx
            <p className={`font-serif text-3xl mb-1 ${featured ? 'text-[var(--color-text-on-dark)]' : 'text-[var(--color-text)]'}`}>
              {tier.id === 2 && addonSelected ? t('audit.t2PriceWithAddon') : t(tier.priceKey)}
            </p>
```

And update both `TierCTA` call sites inside `TierDetail` to pass the flag:

```tsx
<TierCTA tier={tier} featured={featured} onApply={(id) => onApply(id, tier.id === 2 ? addonSelected : undefined)} />
```

- [ ] **Step 4: Add the methodology badge to `TierCard`**

In `TierCard`, right after the tier name/tagline block (after the `</div>` closing the `mb-4` name block, before the price block), add:

```tsx
      <p className={`text-[9px] tracking-widest uppercase font-medium mb-4 ${featured ? 'text-[var(--color-gold-cta)]/70' : 'text-[var(--color-gold)]/70'}`}>
        {t('audit.methodologyBadge')}
      </p>
```

- [ ] **Step 5: Verify**

```bash
npx tsc -b && npx eslint src/pages/AuditPage.tsx
```
Expected: clean.

- [ ] **Step 6: SSR-render both toggle states to catch runtime errors**

```bash
node -e "
const { createServer } = require('vite');
(async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  const { AuditPage } = await server.ssrLoadModule('/src/pages/AuditPage.tsx');
  const { renderToStaticMarkup } = require('react-dom/server');
  const React = require('react');
  const { MemoryRouter } = require('react-router-dom');
  const html = renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(AuditPage)));
  console.log('Rendered', html.length, 'chars, contains Continuous Protection:', html.includes('Continuous Protection'));
  await server.close();
})();
"
```
Expected: no thrown errors, `contains Continuous Protection: true`.

- [ ] **Step 7: Commit**

```bash
git add src/locales/en/translation.json src/pages/AuditPage.tsx
git commit -m "feat: add Investor-Ready toggle to Tier 2, methodology badge to all tier cards"
```

---

## Task 4: Comparison table — split guarantee row, move investor rows under Tier 2, add Continuous rows

**Files:**
- Modify: `src/pages/AuditPage.tsx:75-95` (`tableRowKeys` array)
- Modify: `src/locales/en/translation.json` — table row keys

**Interfaces:**
- Produces: updated `tableRowKeys` array (still the same shape: `{ featureKey, t1?, t2?, t3?, t1k?, t2k?, t3k? }[]`), no signature change.

- [ ] **Step 1: Update translation.json table row copy**

Change:
```
tableRow12: "Margin improvement guarantee"
```
(unchanged text, but its `t3` value in the array changes to `—` — see Step 2)

Add these new keys:
```
tableRow19: "Monthly Vital Six review"
tableRow20: "Quarterly mini-Scan refresh"
tableRow21: "Priority response access"
tableRow22: "Monitoring guarantee (48hr flag)"
tableRowInvestorNote: "+ = available as the Investor-Ready add-on (+$10,000)"
```

Change these existing keys (same feature, now framed as the add-on rather than a Tier-3-only capability):
```
tableRow13: "Financial modeling (3-year)"     — unchanged text
tableRow14: "Investor-grade business plan"    — unchanged text
tableRow15: "Pitch deck + investor teaser"    — unchanged text
tableRow16: "Virtual data room"               — unchanged text
tableRow17: "Investor/buyer introductions"    — unchanged text
```
Delete `tableRow18` ("Quarterly check-ins (1 year)") — that was Investor-Ready-specific and doesn't map to either the add-on or Continuous cleanly; dropped rather than force-fit.

- [ ] **Step 2: Replace `tableRowKeys` in `AuditPage.tsx`**

```typescript
const tableRowKeys: { featureKey: string; t1?: string; t2?: string; t3?: string; t1k?: string; t2k?: string; t3k?: string }[] = [
  { featureKey: 'audit.tableRow1',  t1: '✓', t2: '✓', t3: '✓' },
  { featureKey: 'audit.tableRow2',  t1: '✓', t2: '✓', t3: '✓' },
  { featureKey: 'audit.tableRow3',  t1: '✓', t2: '✓', t3: '✓' },
  { featureKey: 'audit.tableRow4',  t1k: 'audit.tableRow4T1', t2k: 'audit.tableRow4T2', t3k: 'audit.tableRow4T3' },
  { featureKey: 'audit.tableRow5',  t1k: 'audit.tableRow5T1', t2k: 'audit.tableRow5T2', t3k: 'audit.tableRow5T3' },
  { featureKey: 'audit.tableRow6',  t1: '—', t2: '✓', t3: '—' },
  { featureKey: 'audit.tableRow7',  t1: '—', t2: '✓', t3: '—' },
  { featureKey: 'audit.tableRow8',  t1: '—', t2: '✓', t3: '—' },
  { featureKey: 'audit.tableRow9',  t1: '—', t2: '✓', t3: '—' },
  { featureKey: 'audit.tableRow10', t1: '—', t2: '✓', t3: '—' },
  { featureKey: 'audit.tableRow11', t1: '—', t2: '✓', t3: '—' },
  { featureKey: 'audit.tableRow12', t1: '—', t2: '✓', t3: '—' },
  { featureKey: 'audit.tableRowProbiotic', t1k: 'audit.tableRowProbioticT1', t2k: 'audit.tableRowProbioticT2', t3k: 'audit.tableRowProbioticT3' },
  { featureKey: 'audit.tableRow13', t1: '—', t2: '+', t3: '—' },
  { featureKey: 'audit.tableRow14', t1: '—', t2: '+', t3: '—' },
  { featureKey: 'audit.tableRow15', t1: '—', t2: '+', t3: '—' },
  { featureKey: 'audit.tableRow16', t1: '—', t2: '+', t3: '—' },
  { featureKey: 'audit.tableRow17', t1: '—', t2: '+', t3: '—' },
  { featureKey: 'audit.tableRow19', t1: '—', t2: '—', t3: '✓' },
  { featureKey: 'audit.tableRow20', t1: '—', t2: '—', t3: '✓' },
  { featureKey: 'audit.tableRow21', t1: '—', t2: '—', t3: '✓' },
  { featureKey: 'audit.tableRow22', t1: '—', t2: '—', t3: '✓' },
]
```

- [ ] **Step 3: Add the footnote and fix the price row**

Right after the closing `</table>` in `AuditPage.tsx`, add:

```tsx
          <p className="text-[9px] text-[var(--color-text-muted)] mt-3">{t('audit.tableRowInvestorNote')}</p>
```

Change the hardcoded Tier 3 price in the price row:

```tsx
              <tr className="border-t-2 border-[var(--color-gold-muted)]">
                <td className="py-3 pr-6 font-semibold text-[var(--color-text)]">{t('audit.tablePriceRow')}</td>
                <td className="text-center py-3 px-4 font-semibold text-[var(--color-gold)]">$4.5K–$7.5K</td>
                <td className="text-center py-3 px-4 font-semibold text-[var(--color-gold-cta)] bg-[rgba(202,138,4,0.04)]">$15K–$25K</td>
                <td className="text-center py-3 px-4 font-semibold text-[var(--color-text-muted)]">$3K–$6K/mo</td>
              </tr>
```

- [ ] **Step 4: Verify**

```bash
npx tsc -b && node -e "JSON.parse(require('fs').readFileSync('src/locales/en/translation.json', 'utf8')); console.log('valid JSON')"
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/AuditPage.tsx src/locales/en/translation.json
git commit -m "content: rework comparison table for Investor-Ready add-on and Continuous Protection"
```

---

## Task 5: Upgrade path — repoint Tier2→Tier3, remove Tier1→Tier3 skip path

**Files:**
- Modify: `src/locales/en/translation.json` — `upg2From/upg2Detail`, delete `upg3From/upg3Detail`
- Modify: `src/pages/AuditPage.tsx:303-307` (`upgradeKeys` array)

- [ ] **Step 1: Update translation.json**

```
upg2From: "Tier 2 → Continuous Protection"
upg2Detail: "Every 90-Day Transformation includes the first 30 days of Continuous Protection at no charge, enrolled automatically when we close out the engagement — this locks in the gain instead of leaving it to erode once the intensive phase ends. Continue after that at $3,000–$6,000/month, or opt out."
```

Delete `upg3From` and `upg3Detail` entirely.

- [ ] **Step 2: Update `upgradeKeys` in `AuditPage.tsx`**

```typescript
  const upgradeKeys = [
    { fromKey: 'audit.upg1From', detailKey: 'audit.upg1Detail' },
    { fromKey: 'audit.upg2From', detailKey: 'audit.upg2Detail' },
  ]
```

(Drops from 3 entries to 2 — the "Upgrade path" section's `grid-cols-3` will render 2 cards; leave the grid class as `md:grid-cols-3` since 2 cards in a 3-col grid on desktop still reads fine, or change to `md:grid-cols-2` for a tighter layout — use `md:grid-cols-2` since a lopsided 2-of-3 grid looks unfinished.)

In the "Upgrade path" section's grid div, change:
```tsx
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
```

- [ ] **Step 3: Verify**

```bash
npx tsc -b
```

- [ ] **Step 4: Commit**

```bash
git add src/locales/en/translation.json src/pages/AuditPage.tsx
git commit -m "content: repoint Tier2 ascension to Continuous Protection, drop Tier1-to-Tier3 skip path"
```

---

## Task 6: Tier 3 sidebar callout, decision guide, methodology section rename, SEO/JSON-LD

**Files:**
- Modify: `src/pages/AuditPage.tsx` — `tier.id === 3` sidebar block, `decisionKeys`, methodology section, JSON-LD
- Modify: `src/locales/en/translation.json` — `successFeeEyebrow/successFeeBody` replaced, `dec*` keys, `methodVitalSixIntro`, `t1Tagline`, `t2Promise`, `t3Tagline`, `seoDesc`

- [ ] **Step 1: Replace the Tier 3 sidebar callout**

In `translation.json`, replace:
```
successFeeEyebrow: "Why monthly, not one-time"
successFeeBody: "A one-time fee can't buy ongoing vigilance. The Vital Six drift silently — a monthly cadence is the only way to catch it before it costs you a cycle. That's why this is a retainer, not a report."
```

In `AuditPage.tsx`, the `tier.id === 3` sidebar block's keys already point at `audit.successFeeEyebrow`/`audit.successFeeBody` — no JSX change needed, only the translation content changes.

- [ ] **Step 2: Update the decision guide**

Check current `dec1Condition`/`dec1Tier` through `dec4Condition`/`dec4Tier` in `translation.json` for any Tier-3/Investor-Ready-specific phrasing (likely `dec4` references "raise capital" or similar, given the pattern). Replace whichever decision row currently points to the old Investor-Ready framing with:

```
dec4Condition: "You've completed the 90-Day Transformation and want the gain protected long-term, not left to drift back."
dec4Tier: "Continuous Protection"
```

(Read the actual current `dec4Condition`/`dec4Tier` values before editing — replace whichever of dec1-dec4 currently maps to Tier 3, since the exact slot wasn't in the earlier grep output.)

- [ ] **Step 3: Rename Blue Sigma → Blue Acres Methodology (3 occurrences)**

In `translation.json`:
```
methodVitalSixIntro: "Every diagnostic is built on The Blue Acres Methodology — reading the six leading numbers that decide the bulk of your farm's profit, daily or weekly, instead of waiting for harvest to tell the story. Your full report goes deeper still, but these six are what we watch first."
t1Tagline: "Powered by The Blue Acres Methodology — the map, plus the daily system to run it yourself."
t2Promise: "In 90 days, I will increase your net operating margin by a minimum of 10 percentage points. If we fail, you do not pay the final milestone. This is not consulting. This is not coaching. This is a hands-on restructuring of your farm's operations — led by someone who has done it on three continents. Built on the same Blue Acres Methodology as Tier 1: daily Vital Six tracking and a fast improvement loop, not a once-a-crop report card."
```

In `AuditPage.tsx:429`, update the comment:
```tsx
      {/* Blue Acres Methodology */}
```

- [ ] **Step 4: Update `/audit` SEO description and JSON-LD**

In `translation.json`:
```
seoDesc: "Three engagement levels for shrimp operators doing $200K–$2M/year in SE Asia and MENA: a diagnostic audit, a 90-day margin transformation, or ongoing Continuous Protection monitoring. Built on 30+ years of field experience and The Blue Acres Methodology."
```

In `AuditPage.tsx`, update the JSON-LD block:
```tsx
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: 'Aquaculture Farm Audit & Transformation Programme',
          description: 'On-site diagnostic audits, 90-day margin transformation sprints, and ongoing Continuous Protection monitoring retainers for aquaculture operators doing $200K–$2M/year.',
          url: 'https://hazemshannak.cc/audit',
          provider: { '@type': 'Person', name: 'Hazem Shannak' },
          areaServed: ['Southeast Asia', 'Middle East', 'North Africa', 'Sub-Saharan Africa'],
          serviceType: 'Aquaculture Management Consulting',
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Audit Tiers',
            itemListElement: [
              { '@type': 'Offer', name: 'Tier 1 Diagnostic Audit', priceSpecification: { '@type': 'PriceSpecification', minPrice: 4500, maxPrice: 7500, priceCurrency: 'USD' } },
              { '@type': 'Offer', name: 'Tier 2 90-Day Transformation Sprint (with optional Investor-Ready add-on)', priceSpecification: { '@type': 'PriceSpecification', minPrice: 15000, maxPrice: 25000, priceCurrency: 'USD' } },
              { '@type': 'Offer', name: 'Tier 3 Continuous Protection (Monthly Retainer)', priceSpecification: { '@type': 'UnitPriceSpecification', minPrice: 3000, maxPrice: 6000, priceCurrency: 'USD', unitText: 'MONTH' } },
            ],
          },
        }}
```

- [ ] **Step 5: Verify**

```bash
npx tsc -b && node -e "JSON.parse(require('fs').readFileSync('src/locales/en/translation.json', 'utf8')); console.log('valid JSON')"
grep -rn "Blue Sigma" src/ || echo "no Blue Sigma references remain"
```
Expected: `no Blue Sigma references remain`.

- [ ] **Step 6: Commit**

```bash
git add src/pages/AuditPage.tsx src/locales/en/translation.json
git commit -m "content: rename Blue Sigma to Blue Acres Methodology sitewide, update /audit SEO + JSON-LD"
```

---

## Task 7: Tag case studies with their related tier

**Files:**
- Modify: `src/data/caseStudies.ts` (interface + 3 entries)
- Modify: `src/pages/AuditPage.tsx` — Social Proof section render

**Interfaces:**
- Produces: `CaseStudy.relatedTier?: 'tier1' | 'tier2' | 'tier2-investor'` — a display label map consumed by `AuditPage.tsx`'s Social Proof section.

- [ ] **Step 1: Extend the interface and tag the 3 entries**

In `src/data/caseStudies.ts`:

```typescript
export interface CaseStudy {
  client: string
  region: string
  species: string
  challenge: string
  intervention: string[]
  outcome: string
  metric: string
  metricLabel: string
  relatedTier?: 'tier1' | 'tier2' | 'tier2-investor'
}
```

Add `relatedTier: 'tier2'` to the first entry (Integrated Shrimp Operation, $340K margin recovered — matches the Sprint's margin-guarantee value prop).

Add `relatedTier: 'tier2-investor'` to the second entry (Family-Owned Tilapia Producer, $1.2M investment secured — matches the new Investor-Ready add-on).

Add `relatedTier: 'tier2'` to the third entry (Biofloc RAS System, survival 34%→82% via technical audit + 12-session training programme — hands-on restructuring work matches Sprint, not a one-time diagnostic).

- [ ] **Step 2: Show the tag in `AuditPage.tsx`'s Social Proof section**

Add a small label map near the top of the file (after `const T1_JOTFORM = ...`):

```typescript
const RELATED_TIER_LABELS: Record<string, string> = {
  tier1: 'Tier 1',
  tier2: 'Tier 2',
  'tier2-investor': 'Tier 2 + Investor-Ready',
}
```

In the Social Proof section's case study card (inside the `caseStudies.map(cs => ...)` block), add the label right after the metric row:

```tsx
              {cs.relatedTier && (
                <span className="text-[9px] tracking-widest uppercase text-[var(--color-gold-cta)]/70 -mt-2">
                  {RELATED_TIER_LABELS[cs.relatedTier]}
                </span>
              )}
```

- [ ] **Step 3: Verify**

```bash
npx tsc -b
```

- [ ] **Step 4: Commit**

```bash
git add src/data/caseStudies.ts src/pages/AuditPage.tsx
git commit -m "feat: tag case studies with their related audit tier"
```

---

## Task 8: Full build verification, live bundle check, deploy

**Files:** none (verification only)

- [ ] **Step 1: Full clean build**

```bash
npx tsc -b && npx eslint src/pages/AuditPage.tsx src/components/audit/ApplicationModal.tsx src/lib/auditApplication.ts src/data/caseStudies.ts && npm run build
```
Expected: all clean, build succeeds.

- [ ] **Step 2: Grep the built bundle for old and new content**

```bash
grep -o "Continuous Protection" dist/assets/*.js | head -1
grep -o "Blue Sigma" dist/assets/*.js || echo "confirmed: no Blue Sigma in bundle"
grep -o "Investor-Ready Enterprise Programme" dist/assets/*.js || echo "confirmed: old Tier 3 name gone"
```

- [ ] **Step 3: Push and deploy**

```bash
git push origin main
vercel --prod
```

- [ ] **Step 4: Verify live**

```bash
curl -s https://hazemshannak.cc/audit -o /tmp/audit_live.html
ASSET=$(grep -o 'assets/index-[^"]*\.js' /tmp/audit_live.html | head -1)
curl -s "https://hazemshannak.cc/$ASSET" | grep -o "Continuous Protection" | head -1
```

**Explicitly not covered by this verification:** the Tier 2 toggle's actual click behaviour, the Continuous Protection card's visual layout, and the comparison table's rendering — no browser available in this sandbox. Hazem needs to click through `/audit` once live, specifically: toggle the Investor-Ready add-on and confirm the price/included-items update, and submit a test Tier 3 application to confirm the Supabase row shows the new content correctly.

- [ ] **Step 5: Update memory**

Update `blue-acres-redesign.md` memory: status → "shipped," commit hashes, note the Task 1 correction (100% Tier1→2 credit kept unchanged) so future sessions don't rediscover this the hard way.

---

## Self-Review Notes

**Spec coverage:** every item in the approved spec has a task — ladder rename (Task 6), Tier 2 toggle (Task 3), Tier 3 rewrite (Task 2), comparison table (Task 4), ascension mechanics (Task 5), case study tagging (Task 7), JSON-LD (Task 6), verification (Task 8).

**Correction from spec:** the Tier1→2 100% credit mechanic was discovered live during planning (not mentioned in the spec, which assumed no credit existed) — documented above, existing mechanic is preserved unchanged, only `upg2`/`upg3` are touched.

**Type consistency check:** `onApply` signature is `(tierId: 2 | 3, investorAddOn?: boolean) => void` everywhere it's declared or called — `TierCTA`, `TierCard`, `TierDetail`, and the final CTA button all updated consistently in Task 1 and Task 3. `AuditApplicationInput.investorAddOn` and `ApplicationModalProps.investorAddOn` and `ApplicationBody.investorAddOn` all use the same name and `boolean | undefined` type across Task 1's three files.
