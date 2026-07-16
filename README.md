# Stay Well Massage Website

Static multi-page website for Stay Well Massage Home and Hotel Service in Angeles City and Clark.

## Repository layout

- `public/` is the complete website document root. Its contents must be served at `/`, never at `/public/`.
- `project/` contains non-production documentation, research, source assets, templates, and tooling.
- `archive/` and `_archived/` contain rollback material and legacy files; nothing there is deployed.
- `vercel.json` and `.vercelignore` stay at the repository root because they configure the deployment platform.

See `project/README.md` for the complete working structure.

## Editing

- Edit `public/style.css` and `public/script.js`; public pages intentionally reference these source-of-truth files.
- Unreferenced legacy CSS, JavaScript, and superseded therapist images are preserved under `project/legacy/`.
- Preserve originals under `project/source-assets/therapist-originals/`; optimized WebP copies remain in `public/`.
- Do not add `aggregateRating` for the business's own reviews.
- Keep schema facts visible and consistent with page copy.
- Do not change established URLs, canonicals, titles, or H1s without Search Console evidence and a rollback plan.

## Validation

Run from the repository root:

```powershell
node project/tools/validate-site.mjs
node --check public/script.js
```

Before deployment, test every sitemap page, the booking-to-WhatsApp handoff, Rich Results Test, keyboard navigation, and three PageSpeed runs per device.

Start a local server from the repository root with:

```powershell
python -m http.server 4173 --bind 127.0.0.1 --directory public
```

## Deployment and rollback

For Hostinger, upload the **contents of `public/`** directly into the domain's `public_html`; do not upload the `public` folder as a nested URL. Vercel is configured to serve `public/` as its output directory. Read `project/docs/operations/deployment.md` before release.

The immediate pre-migration artifact is preserved in `archive/pre-public-migration-2026-07-16/public-root/`.
