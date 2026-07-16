# Stay Well Massage Website

Static multi-page website for Stay Well Massage Home and Hotel Service in Angeles City and Clark.

## Production source

The public website is the root HTML/CSS/JavaScript plus the service/article directories declared in `sitemap.xml`. Hostinger/Apache is the apparent production host, so `.htaccess` is the authoritative server configuration unless hosting is changed.

Do not upload these source-only paths:

- `_archived/`
- `archive/`
- `docs/`
- `scripts/`
- `new add therapist/`
- `google trends/`
- `subpage-template.html`
- Markdown and CSV project files

The server and Vercel exclusion files contain matching protections, but a deployment allowlist is safer than uploading the entire repository.

## Editing

- Edit `style.css` and `script.js`; public pages intentionally reference these source-of-truth files.
- `style.min.css` and `script.min.js` are retained as legacy files but are no longer referenced.
- Preserve originals under `new add therapist/`; production portraits are optimized root-level WebP copies.
- Do not add `aggregateRating` for the business's own reviews.
- Keep schema facts visible and consistent with the page.
- Do not change established URLs, canonicals, titles, or H1s without Search Console evidence and a rollback plan.

## Validation

Run from the repository root:

```powershell
node scripts/validate-site.mjs
node --check script.js
```

Before deployment, also test all sitemap pages in a browser, the complete booking-to-WhatsApp handoff, Rich Results Test, keyboard navigation, and three PageSpeed runs per device.

## Rollback

The pre-change production/source files are preserved in `archive/pre-upgrade-2026-07-15/`. See `docs/operations/deployment.md` and `archive/README.md` before releasing.
