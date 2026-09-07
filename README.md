# 1Fi Marketplace — SDE Intern Assignment

Adds the **1Fi Marketplace** section to the existing **Shop** page of the 1Fi app.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000 → redirects to /shop
```

```bash
npm run build && npm start   # production build
npx tsc --noEmit             # types
npx eslint src scripts       # lint (clean)
```

The app is phone-first (`max-width: 500px`, centred on desktop), so it is best
viewed in a mobile viewport.

## Understanding the existing app

I could not be given the 1Fi codebase, so I worked from the live app at
`app.1fi.in/shop` and matched what it actually ships:

| Aspect | What the existing app uses | What this repo uses |
| --- | --- | --- |
| Framework | Next.js App Router | Next.js 16, App Router |
| Styling | Tailwind CSS v4 | Tailwind CSS v4 |
| Icons | `lucide-react` | `lucide-react` |
| Font | Geist / Geist Mono | Geist / Geist Mono |
| Brand colour | `#712CDC`, tints `#F5F0FF` / `#ECE5FF` | same, as `@theme` tokens |
| Shell | `mx-auto w-full max-w-[500px]`, floating bottom nav | reproduced |

Layout details taken from the live Shop page and reused rather than reinvented:
the hero banner that bleeds past the content padding, the pill tab bar
(`rounded-full border bg-brand-tint p-1.5`), the `h-[46px]` rounded search
field, the `rounded-[20px]` empty-state card, and the five-item bottom nav
(Home / Shop / EMI Dues / Limit / Profile) with its active-tab indicator.

## What was built

The Shop page has three tabs, per the brief:

- **Top Brands** — intentionally blank (empty state only).
- **Nearby Stores** — intentionally blank (empty state only).
- **1Fi Marketplace** — fully implemented.

### Marketplace listing (`/shop?tab=marketplace`)

Available-limit summary, category filter rail, debounced search, and a
two-column product grid. Each card shows image, brand, name, rating, price, MRP,
discount and the lowest available EMI.

### Product detail (`/shop/marketplace/[slug]`)

Image, pricing, rating, **variant selector** (out-of-stock variants shown but not
selectable), **EMI plan selector**, highlights, specs, and a sticky CTA that
opens a review sheet summarising the chosen plan before pledging.

Changing the variant re-requests EMI plans for that variant's price. Plans that
need more than the available limit are disabled and labelled — try the 65-inch
variant of the LG OLED against the mock limit of ₹1,75,000.

## Architecture

```
src/
  app/
    shop/page.tsx                     Shop shell (server component)
    shop/marketplace/[slug]/page.tsx  Product detail route (SSG + metadata)
    api/products/                     Mock catalogue endpoints
    api/emi-plans/                    Mock EMI endpoint
    api/limit/                        Mock credit-limit endpoint
    dashboard|emi-dues|...            Placeholders so the bottom nav works
  components/
    layout/    MobileNav, PlaceholderScreen
    shop/      ShopTabs, SearchField, ShopContent
    marketplace/ ProductCard, CategoryChips, LimitSummary, VariantSelector,
                 EmiPlanSelector, PlanSummarySheet, ProductDetailView
    ui/        Skeleton, StateCard, ErrorState
  hooks/       useAsyncResource, useMarketplace
  lib/         api, types, emi, format, shop-tabs, utils
  server/data/ products.ts  (mock datastore — imported only by route handlers)
```

### Data and APIs

No product or EMI data is hardcoded in a component. Everything is served over
HTTP by route handlers and reaches the UI through one typed client
(`src/lib/api.ts`):

- `GET /api/products?q=&category=` — listing, with server-side search/filter
- `GET /api/products/:slug` — detail
- `GET /api/emi-plans?slug=&variantId=` — EMI schedule for a variant
- `GET /api/limit` — the user's mutual-fund backed limit

`src/server/data/products.ts` is the only file that knows the data is mocked;
pointing the client at a real service is a change to `lib/api.ts` alone.

**EMI is always computed server-side** (`src/lib/emi.ts`). The client sends a
variant id, never a price, so instalments cannot be tampered with or drift out
of sync with the catalogue. Short tenures are no-cost (0%); 18 months and above
use a reducing-balance rate.

### State, loading and errors

`useAsyncResource` is the single fetching primitive: it owns loading, error and
retry, aborts in-flight requests when inputs change or the component unmounts,
and ignores responses from superseded requests. Every screen therefore behaves
identically — skeletons while loading, a retry card on failure, a distinct
empty state when a query returns nothing.

Only the user's explicit choices are stored in `ProductDetailView`; the default
variant and default EMI plan are derived during render, so the selection can
never disagree with the data that has arrived. A plan the user picked is
deliberately dropped when they switch to a variant where it is not offered.

### Accessibility and responsiveness

Real `tablist` / `tab` / `tabpanel` and `radiogroup` / `radio` semantics, labelled
controls, `aria-current` on the active nav item, visible focus, safe-area
insets, and a `prefers-reduced-motion` guard. The page never scrolls
horizontally; the category rail scrolls within itself.

## Notes and assumptions

- The brief refers to reference screens and product content attached to the
  assignment; those were not included with the PDF I received, so the catalogue
  is representative mock data of the kind 1Fi advertises (phones, laptops,
  tablets, audio, wearables, TVs on no-cost EMI). Swapping in the real content
  means editing `src/server/data/products.ts` only.
- Product imagery is generated as SVG (`node scripts/generate-artwork.mjs`) to
  keep the repo free of binary assets and avoid runtime image fetches. Real
  catalogue images would come from the 1Fi CDN.
- Top Brands and Nearby Stores are left blank as instructed.
- The pledge/KYC journey after "Pledge funds & continue" belongs to the existing
  app and is out of scope; the flow ends at the confirmation sheet.
