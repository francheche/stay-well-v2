# Deployment and Rollback

## Pre-deployment gate

1. Confirm that Hostinger `public_html` and its `.htaccess` are the active production path.
2. Keep the existing live artifact available as a rollback package.
3. Run `node project/tools/validate-site.mjs` and `node --check public/script.js`.
4. Start localhost with `python -m http.server 4173 --bind 127.0.0.1 --directory public` and test every `public/sitemap.xml` URL on desktop and mobile.
5. Confirm the booking flow through the review step without sending a real booking.
6. Run Rich Results Test and confirm that the homepage has no review-snippet item.
7. Run keyboard, focus, contrast, and 200% zoom checks.

## Production allowlist

The contents of local `public/` are the production allowlist.

- Hostinger: upload everything **inside** `public/` directly into `public_html`.
- Vercel: repository-root `vercel.json` sets `outputDirectory` to `public`.
- Never make the site available under `/public/`.
- Never upload `_archived/`, `archive/`, `project/`, repository Markdown, or CSV files.

## Release order

Deploy this as a document-root change with URL parity. Do not combine it with URL migrations, business-name/category changes, or mass title/copy rewrites.

After deployment:

1. Verify all sitemap URLs return 200.
2. Verify `/robots.txt`, `/sitemap.xml`, `/style.css`, `/script.js`, images, icons, and the web manifest return 200.
3. Verify no link, response URL, canonical, hreflang, or sitemap location contains `/public/`.
4. Verify source-only paths return 403/404/410.
5. Check the browser console and internal assets.
6. Complete a test booking through the WhatsApp handoff without sending it.
7. Request validation of the Search Console review-snippet issue.
8. Record three PageSpeed runs per device and monitor Search Console for 7 and 28 days.

## Rollback triggers

Restore the previous `public_html` artifact immediately if a sitemap URL returns 4xx/5xx, a live URL gains a `/public/` prefix, public assets are missing, the booking flow fails, or the rendered page materially changes. The local pre-migration copy is in `archive/pre-public-migration-2026-07-16/public-root/`. Investigate ranking movement over equivalent 7- and 28-day periods rather than reacting to a one-day fluctuation.

## External work still requiring owner access

- Search Console exports, validation request, indexing review, and query/page analysis.
- Google Business Profile categories, services, hours, service area, photos, official map URL, and Insights.
- Analytics installation/consent decision and verified booking conversion events.
- Citation, backlink, review-response, and local rank-grid work.
