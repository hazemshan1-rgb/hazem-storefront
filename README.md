# Hazem Shannak — Digital Products Storefront

Premium aquaculture resources by Hazem Shannak.

**Live:** https://hazemshannak.qzz.io

## Stack

- React 19 + TypeScript + Vite + Tailwind CSS 4
- Lemon Squeezy (payments + file delivery)
- ConvertKit (email capture)
- Vercel (deployment)

## Deploying to Vercel

1. Go to https://vercel.com/new → Import Git Repository → select `hazemshan1-rgb/hazem-storefront`
2. Framework Preset: **Vite** (auto-detected)
3. Click **Deploy** — no build settings need changing
4. In project Settings → **Environment Variables**, add:
   ```
   VITE_CONVERTKIT_FORM_ID = (from ConvertKit → Forms → your form → embed code)
   ```
5. Redeploy after adding env vars

## Adding a product

1. Upload the PDF to Lemon Squeezy dashboard
2. Copy the checkout URL
3. Add an entry to `src/data/products.ts`
4. Add the cover image to `public/images/covers/`
5. Push to `main` — Vercel auto-deploys

## Environment variables

| Variable | Where to get it |
|---|---|
| `VITE_CONVERTKIT_FORM_ID` | ConvertKit → Forms → your form → embed code |

## Setting up Lemon Squeezy checkout URLs

The placeholder URLs in `src/data/products.ts` must be replaced before launch:

1. Create each product in your Lemon Squeezy dashboard (Products → Add Product → upload PDF)
2. Copy the checkout URL for each product
3. Update the `checkoutUrl` field in `src/data/products.ts`
4. Push to `main`
