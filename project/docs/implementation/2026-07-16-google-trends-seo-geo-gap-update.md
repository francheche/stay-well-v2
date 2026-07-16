# Google Trends SEO/GEO Gap Update

Date: 2026-07-16  
Status: Implemented locally; deployment remains a separate action  
Primary language: English  
Market in supplied exports: Philippines  
Export period inferred from filenames: 2026-04-15 to 2026-07-15

## Source files

- `project/research/google-trends/searched_with_top-searches_PH_20260415-1612_20260715-1612.csv`
- `project/research/google-trends/searched_with_rising-searches_PH_20260415-1613_20260715-1613.csv`

The exports are directional national demand data. Search-interest values are relative, not search-volume estimates. They should supplement Search Console and booking data, not override page relevance or proven rankings.

## Finding

The Trends research had already influenced the site before this gap update. Existing public pages already covered the most relevant local and service intent:

| Trend intent | Existing page coverage |
| --- | --- |
| massage near me / open now | Homepage local answer block and FAQ |
| home service massage near me | `/home-massage-angeles-city/` |
| Thai massage / Thai massage near me | `/thai-massage-angeles-city/` |
| Swedish massage / what is Swedish massage | `/swedish-massage-angeles-city/` |
| Ventosa / Ventosa massage | `/ventosa-angeles-city/` |
| deep tissue massage | `/deep-tissue-massage-angeles-city/` |
| Clark local intent | `/massage-clark/` |

## Minimal additions made

1. Added one booking-clarification sentence to `/home-massage-angeles-city/` for the relevant rising `full body massage` intent. The copy asks visitors to confirm full-body versus selected-area preferences and does not introduce a new treatment or promise availability.
2. Added one comparison box to `/swedish-massage-angeles-city/` for `Swedish vs Thai massage`, with a contextual internal link to the existing Thai page.

No title, meta description, canonical, H1, URL, navigation label, schema identity, price, phone number, or homepage conversion section was changed.

## Queries intentionally not added

| Query group | Decision and reason |
| --- | --- |
| Japanese massage, foot massage, lymphatic massage, Shiatsu, prenatal, hot stone | Not added because the current site does not establish these as offered services. |
| Nuat Thai, Sebo, Mont Albo, Vibes, Ogawa | Competitor or product-brand intent; adding it would be irrelevant and potentially confusing. |
| Massage chair, massage gun | Product-shopping intent rather than Stay Well's mobile service intent. |
| Manila, Cebu, Makati, BGC, Quezon City | Outside the documented Angeles City and Clark service area. |
| spa massage / massage spa / spa near me | Existing copy already explains the mobile spa experience. Exact-match repetition could imply a walk-in spa and create keyword stuffing, so no additional insertion was made. |
| massage nearby | Semantically covered by the established local `near me` answer blocks; no duplicate wording was needed. |
| can I take a bath after massage | High percentage growth from very low relative interest. Deferred until a clinically reviewed, well-sourced answer can be added without turning a local landing page into generic health content. |
| Korean-language terms | The supplied exports contain no Korean-language queries. English remains primary and the separate `/ko/` page remains unchanged. |

## Risk controls

- Pre-edit copies are stored under `archive/pre-google-trends-gap-update-2026-07-16/public/`.
- Changes are additive and confined to two existing service pages.
- No new indexable URL was created.
- Existing high-performing page signals were preserved.
- Run `node project/tools/validate-site.mjs` before deployment and compare Search Console landing-page clicks, impressions, CTR, and average position after release.
- If either edited page shows a sustained performance decline after deployment, restore its archived HTML file and revalidate.

## Next measurement step

Before another content change, export current Search Console queries by landing page for the last 28 days and the comparable previous period. Prioritize only relevant queries with meaningful impressions and a realistic local booking path.
