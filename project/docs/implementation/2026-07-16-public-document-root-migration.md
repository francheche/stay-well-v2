# Public Document Root Migration

## Purpose

Separate the deployable Stay Well website from research, source assets, tooling, and rollback material without changing any public URL or search signal.

## Architecture

- `public/`: complete runtime website served at the domain root.
- `project/`: private development workspace.
- `archive/` and `_archived/`: rollback and legacy material.
- `vercel.json`: repository-root platform configuration with `outputDirectory` set to `public`.

## Non-negotiable requirements

- `public/index.html` must be served as `https://staywellmassageph.com/`, not `/public/`.
- All sitemap URLs, canonical URLs, hreflang values, structured data, titles, H1s, and internal links remain unchanged.
- Hostinger receives the contents of `public/` inside `public_html`.
- Repository-only folders are never uploaded to the web document root.

## Validation gates

1. `node project/tools/validate-site.mjs` passes all sitemap pages.
2. `node --check public/script.js` passes.
3. Every sitemap URL returns HTTP 200 when the server is started with `public/` as its root.
4. `/robots.txt`, `/sitemap.xml`, `/style.css`, `/script.js`, icons, hero images, and portraits return HTTP 200.
5. No response or canonical URL contains `/public/`.

## Hostinger release

1. Back up the current `public_html` contents.
2. Upload the contents inside local `public/` directly into `public_html`.
3. Ensure `.htaccess` is present in `public_html`.
4. Do not create `public_html/public/`.
5. Run the post-deployment URL and asset checks before requesting Search Console validation.

## Rollback

Restore the previous production artifact if any sitemap URL, booking interaction, stylesheet, script, image, canonical, hreflang, or structured-data block fails after deployment. The local pre-migration runtime is preserved in `archive/pre-public-migration-2026-07-16/public-root/`.
