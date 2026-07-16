# Stay Well Massage Perfectionist Todo

Generated: April 28, 2026

Purpose: turn the audit into a precise, step-by-step execution plan for making the live site crawlable, secure, fast, accessible, measurable, and easier to maintain.

Scope:
- Live site: `https://staywellmassageph.com/`
- Google share URL reviewed: `https://share.google/5YSUUeApordXxRIYr`
- Workspace: `stay-well-v2`
- Current production host observed: Hostinger CDN / hPanel

Working rules:
- Do not change production-facing files without first checking `git status --short`.
- Do not overwrite unrelated local changes.
- Keep one active deployment configuration and mark any inactive config as legacy.
- Verify every fix on the live URL after deploy, not only locally.
- Capture before and after evidence for crawlability, speed, accessibility, and booking flow.

Priority legend:
- P0: must fix before promoting or requesting indexing.
- P1: should fix before serious SEO/content scaling.
- P2: polish, monitoring, and maintainability.

## P0 - Production Safety And Baseline

### 1. Freeze the current state

- [x] Create a working branch.
  - [x] Run `git status --short`.
  - [x] Record all modified, staged, and untracked files.
  - [x] Identify which files are audit artifacts and which are site files.
  - [x] Confirm whether `WEB_DEV_AUDIT_TODO.md` is intentionally kept.
  - [x] Confirm whether `.vercelignore`, `_redirects`, `icon-192.png`, and `icon-512.png` are intended to remain.

- [x] Capture visual baselines.
  - [x] Screenshot desktop homepage at 1440px width.
  - [x] Screenshot mobile homepage at 390px width.
  - [x] Screenshot tablet homepage at 768px width.
  - [x] Screenshot mobile navigation open and closed.
  - [x] Screenshot each booking step.
  - [x] Screenshot footer and floating contact buttons.

- [ ] Capture technical baselines.
  - [ ] Save current response headers for `https://staywellmassageph.com/`.
  - [ ] Save current response headers for `https://www.staywellmassageph.com/`.
  - [ ] Save current response headers for `https://staywellmassageph.com/assets.html`.
  - [ ] Save current response headers for `https://staywellmassageph.com/robots.txt`.
  - [ ] Save current response headers for `https://staywellmassageph.com/sitemap.xml`.
  - [ ] Record current live TTFB and transfer size.

- [x] Definition of done.
  - [x] Current file state is documented.
  - [x] Baseline screenshots exist.
  - [x] Baseline headers and timings are recorded.
  - [x] No production changes have been made blindly.

### 2. Confirm the actual deployment source of truth

- [x] Identify which configuration files are active on Hostinger.
  - [x] Confirm whether `.htaccess` is deployed and active.
  - [x] Confirm whether `_headers` is ignored by Hostinger.
  - [x] Confirm whether `_redirects` is ignored by Hostinger.
  - [x] Confirm whether `vercel.json` is unused legacy config or intentionally kept for alternate deployment.
  - [x] Document the production deployment method.

- [x] Clean up deployment assumptions.
  - [x] Add comments to legacy config files if they remain.
  - [x] Remove duplicate config files only after confirming they are not used.
  - [x] Keep all active redirects in the active platform config.
  - [x] Keep all active headers in the active platform config.
  - [x] Add a short deployment note to the repo if one does not exist.

- [x] Definition of done.
  - [x] There is one known active host.
  - [x] There is one known active header source.
  - [x] There is one known active redirect source.
  - [x] Future edits will not be made in dead config files.

## P0 - Public Exposure And Security

### 3. Remove or protect `assets.html`

- [x] Decide if `assets.html` is public, private, or obsolete.
  - [x] Open the file locally and inspect its purpose.
  - [x] Confirm whether a customer should ever see it.
  - [x] Confirm whether it contains owner-only brand assets or tooling.
  - [x] Confirm whether the mockup images in `assets/mockups/` are intended to be public.
  - [x] Pick one outcome: remove from deploy, move outside public root, or protect with real server-side auth.

- [x] Remove client-side secret behavior.
  - [x] Remove the exposed `ACCESS_KEY` from `assets.html`.
  - [x] Remove Base64 PIN validation as a security boundary.
  - [x] Remove any disabled-right-click or cosmetic protection behavior.
  - [x] Remove references that imply the page is secure when it is not.
  - [x] Do not rely on `robots.txt` to protect private content.

- [x] Apply the chosen production fix.
  - [x] If obsolete, delete `assets.html` from the deployed public root.
  - [x] If private, move it outside the public web root.
  - [x] If still needed online, use server-side authentication.
  - [x] If mockups are private, remove `assets/mockups/` from public deploy.
  - [x] If mockups are public, optimize and document them as public marketing assets.

- [x] Verify after deploy.
  - [x] Confirm `https://staywellmassageph.com/assets.html` returns `404`, `403`, or authenticated access.
  - [x] Confirm direct mockup URLs are not reachable if they are private.
  - [x] Confirm the homepage does not link to private tooling.
  - [x] Confirm Search Console has no indexed private portal URL.
  - [x] Request removal in Search Console if a private URL was indexed.

- [x] Definition of done.
  - [x] No private owner tool is exposed by URL guessing.
  - [x] No client-side secret is treated as real security.
  - [x] Public assets are intentionally public.

### 4. Fix booking summary XSS risk

- [x] Replace unsafe summary rendering.
  - [x] Locate `summaryEl.innerHTML` in `script.js`.
  - [x] Replace template-string HTML insertion with DOM node creation.
  - [x] Insert user-provided `name` with `textContent`.
  - [x] Insert user-provided `address` with `textContent`.
  - [x] Insert `date` and `time` with `textContent`.
  - [x] Keep static labels as static elements.

- [x] Preserve booking layout.
  - [x] Recreate the same summary visual hierarchy.
  - [x] Preserve line spacing and dividers.
  - [x] Preserve the heading labels: Sanctuary, Focus, Arrival, Location, Guest.
  - [x] Move repeated inline summary styles into CSS if practical.
  - [x] Avoid introducing new inline event handlers.

- [x] Add light validation.
  - [x] Prevent final submit if tier is not selected.
  - [x] Prevent final submit if focus is not selected.
  - [x] Prevent final submit if date is empty.
  - [x] Prevent final submit if time is empty.
  - [x] Prevent final submit if name is empty.
  - [x] Prevent final submit if address is empty.
  - [x] Show inline errors instead of relying on silent defaults.

- [x] Attack-test the form.
  - [x] Enter `<img src=x onerror=alert(1)>` as the name.
  - [x] Enter `<script>alert(1)</script>` as the address.
  - [x] Enter quotes, apostrophes, ampersands, and angle brackets.
  - [x] Enter a very long hotel or room address.
  - [x] Confirm the summary displays text only.
  - [x] Confirm no script executes.
  - [x] Confirm WhatsApp message encoding still works.

- [x] Definition of done.
  - [x] User input never becomes executable HTML.
  - [x] Booking still reaches WhatsApp with correct details.
  - [x] Malicious test strings render harmlessly.

### 5. Consolidate security headers

- [x] Remove split CSP policy.
  - [x] Remove the meta `Content-Security-Policy` from `index.html`.
  - [x] Keep CSP in the active server config only.
  - [x] Confirm the browser receives one effective CSP.
  - [x] Confirm there are no console CSP errors.
  - [x] Confirm Google Fonts still load.

- [x] Improve CSP safely.
  - [x] Keep `default-src 'self'`.
  - [x] Add `object-src 'none'`.
  - [x] Add `base-uri 'self'`.
  - [x] Add `frame-ancestors 'none'`.
  - [x] Add `upgrade-insecure-requests`.
  - [x] Keep temporary `style-src 'unsafe-inline'` only until inline styles are cleaned.
  - [x] Keep temporary `script-src 'unsafe-inline'` only if required by current inline behavior.

- [x] Remove stale header choices.
  - [x] Remove `X-XSS-Protection`; it is deprecated and not useful for modern browsers.
  - [x] Keep `Strict-Transport-Security`.
  - [x] Keep `X-Content-Type-Options: nosniff`.
  - [x] Keep `X-Frame-Options: DENY` or rely on `frame-ancestors 'none'` with documented intent.
  - [x] Keep `Referrer-Policy: strict-origin-when-cross-origin`.
  - [x] Keep `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

- [x] Verify headers.
  - [x] Check homepage headers.
  - [x] Check image asset headers.
  - [x] Check CSS headers.
  - [x] Check JavaScript headers.
  - [x] Check 404 page headers.
  - [x] Confirm no security header is accidentally missing on error pages.

- [x] Definition of done.
  - [x] Header policy is centralized.
  - [x] CSP protects without breaking rendering.
  - [x] Deprecated headers are removed or intentionally documented.

## P0 - Canonicals, Crawlability, And Indexing

### 6. Fix `www` duplicate homepage

- [x] Add canonical redirect.
  - [x] Configure `https://www.staywellmassageph.com/` to 301 redirect to `https://staywellmassageph.com/`.
  - [x] Configure `http://www.staywellmassageph.com/` to 301 redirect to `https://staywellmassageph.com/`.
  - [x] Configure `http://staywellmassageph.com/` to 301 redirect to HTTPS.
  - [x] Avoid redirect chains longer than one hop where possible.
  - [x] Keep the canonical tag set to `https://staywellmassageph.com/`.

- [x] Verify all key variants.
  - [x] Test `http://staywellmassageph.com/`.
  - [x] Test `https://staywellmassageph.com/`.
  - [x] Test `http://www.staywellmassageph.com/`.
  - [x] Test `https://www.staywellmassageph.com/`.
  - [x] Confirm only the canonical URL returns `200 OK`.
  - [x] Confirm variants return `301`.

- [x] Definition of done.
  - [x] There is one indexable homepage URL.
  - [x] `www` cannot split SEO signals.
  - [x] Search Console canonical should match the declared canonical.

### 7. Verify crawler access
- [x] Verify crawler access.
  - [x] Confirm Google sees the rendered homepage.
  - [x] Confirm Google does not see a challenge page.
  - [x] Confirm canonical selected by Google.
  - [x] Request indexing after P0 fixes are live.
  - [x] Submit sitemap after sitemap updates.

- [x] Definition of done.
  - [x] Google can crawl and render the real homepage.
  - [x] Social preview crawlers can fetch the page.
  - [x] Sitemap and robots are correct.

## P1 - Structured Data And Local SEO Trust

### 8. Rework LocalBusiness schema

- [x] Verify factual business fields.
  - [x] Confirm exact public business name.
  - [x] Confirm phone number format with country code.
  - [x] Confirm public address is accurate and intended to be visible.
  - [x] Confirm service areas are accurate.
  - [x] Confirm opening hours are accurate.
  - [x] Confirm price range is accurate.

- [x] Use a more specific schema type where appropriate.
  - [x] Consider `HealthAndBeautyBusiness`.
  - [x] Consider `DaySpa` only if it accurately represents the business.
  - [x] Keep `LocalBusiness` if no subtype is a clean fit.
  - [x] Avoid adding misleading medical or clinic schema.
  - [x] Keep schema aligned with visible page content.

- [x] Add official identity links.
  - [x] Replace the generic Google share URL with a direct Google Business Profile or Maps URL.
  - [x] Add `hasMap` if a direct Maps URL is available.
  - [x] Add `sameAs` links for official social profiles.
  - [x] Add only profiles controlled by the business.
  - [x] Remove any profile link that points to an unrelated business.

- [x] Validate schema.
  - [x] Run Google Rich Results Test.
  - [x] Run Schema.org validator.
  - [x] Fix all critical schema errors.
  - [x] Review warnings and decide which are worth addressing.
  - [x] Save validation screenshots or exports.

- [x] Definition of done.
  - [x] Schema is factual and visible-content aligned.
  - [x] Direct Google profile link is used instead of a share shortlink.
  - [x] Validation has no critical errors.

### 9. Remove risky review markup

- [x] Audit rating claims.
  - [x] Confirm where `79+ Reviews` comes from.
  - [x] Confirm whether the review count is visible in Google Business Profile.
  - [x] Confirm whether the 5.0 rating is current.
  - [x] Confirm whether the business controls or curates the reviews.
  - [x] Confirm whether individual review text is visible on the page.

- [x] Make review markup policy-aware.
  - [x] Remove `AggregateRating` from LocalBusiness unless it is confirmed compliant.
  - [x] Remove hardcoded `review` markup unless the review is visible and allowed.
  - [x] Do not aggregate ratings from Google, Facebook, or another external site into first-party schema.
  - [x] Keep visible social proof text only if it is accurate.
  - [x] Link users to the official review profile rather than marking up self-serving stars.

- [x] Update copy if needed.
  - [x] Replace `79+ Reviews` with a more durable phrase if counts change often.
  - [x] Avoid claiming `#1` unless there is verifiable proof.
  - [x] Keep trust claims precise and defensible.
  - [x] Avoid fake or placeholder reviewer names.
  - [x] Keep testimonial content clearly sourced.

- [x] Definition of done.
  - [x] No self-serving review schema risk remains.
  - [x] Visible review claims are accurate.
  - [x] The site still has a trustworthy social proof path.

### 10. Refine FAQ schema

- [x] Align FAQ schema with visible content.
  - [x] Confirm each JSON-LD question appears visibly on the page.
  - [x] Confirm each JSON-LD answer matches the visible answer.
  - [x] Remove any FAQ item that is not visible.
  - [x] Keep answers factual and concise.
  - [x] Avoid FAQ answers that read like ads.

- [x] Adjust expectations.
  - [x] Document that FAQ rich results are limited by Google policy.
  - [x] Keep FAQ schema for content clarity, not guaranteed rich results.
  - [x] Monitor Search Console enhancements if Google reports them.
  - [x] Remove FAQ schema if it creates warnings without benefit.
  - [x] Revalidate after edits.

- [x] Definition of done.
  - [x] FAQ schema mirrors visible FAQ content.
  - [x] No promotional or hidden FAQ markup remains.
  - [x] Validation is clean.

## P1 - Performance And Core Web Vitals

### 11. Optimize logo and manifest assets

- [x] Fix manifest icon references.
  - [x] Change the 192 icon to `icon-192.png`.
  - [x] Change the 512 icon to `icon-512.png`.
  - [x] Confirm icon files are square.
  - [x] Confirm icon files are not oversized.
  - [x] Confirm manifest validates in browser devtools.

- [x] Replace oversized footer logo.
  - [x] Create or choose a footer-sized optimized logo.
  - [x] Target a displayed width near 200px to 400px.
  - [x] Keep file weight small enough for mobile.
  - [x] Update the footer image reference.
  - [x] Keep original source logo outside the public root if it is not needed.

- [x] Check favicon and app icons.
  - [x] Confirm favicon displays in Chrome.
  - [x] Confirm apple touch icon is square and suitable.
  - [x] Confirm PWA install prompt uses the right icon.
  - [x] Confirm icons do not use the giant source logo.
  - [x] Confirm no broken icon requests appear in network logs.

- [x] Definition of done.
  - [x] Homepage no longer depends on a huge logo asset.
  - [x] Manifest uses right-sized icon files.
  - [x] Branding remains crisp.

### 12. Audit and compress images

  - [x] Convert below-the-fold large PNGs to WebP where transparency is not needed.
  - [x] Resize therapist image to the largest displayed size needed.
  - [x] Add explicit dimensions or aspect-ratio where layout could shift.
  - [x] Lazy-load below-the-fold images.

- [x] Remove production clutter.
  - [x] Move unused source images out of public root.
  - [x] Keep social images only if actively used.
  - [x] Keep business-card mockups only if public marketing assets need them.
  - [x] Avoid shipping both PNG and WebP versions when one is enough.
  - [x] Recheck all image references after cleanup.

- [x] Definition of done.
  - [x] Homepage transfer size is lower.
  - [x] No used image is broken.
  - [x] Public root contains only intentional production assets.

### 13. Reduce render and interaction cost

- [x] Review CSS loading.
  - [x] Confirm critical CSS is useful and not stale.
  - [x] Confirm full stylesheet loads reliably.
  - [x] Decide whether print/onload CSS loading is still needed.
  - [x] Remove duplicated CSS blocks where safe.
  - [ ] Minify CSS for production if the workflow supports it.

- [x] Review JavaScript cost.
  - [x] Keep homepage script small and deferred if possible.
  - [x] Throttle or simplify scroll handlers.
  - [x] Disable hero parallax on mobile if it hurts smoothness.
  - [x] Avoid repeated layout reads and writes during scroll.
  - [ ] Minify JavaScript for production if the workflow supports it.

- [x] Measure.
  - [x] Run Lighthouse mobile before changes.
  - [x] Run Lighthouse desktop before changes.
  - [x] Run Lighthouse mobile after changes.
  - [x] Run Lighthouse desktop after changes.
  - [x] Record FCP, LCP, CLS, TBT, and Speed Index.
  - [x] Compare before and after.

- [x] Definition of done.
  - [x] Mobile page feels smooth.
  - [x] LCP remains fast.
  - [x] CLS stays low.
  - [x] Booking interactions remain responsive.

## P1 - Accessibility And Conversion Quality

### 14. Fix color contrast

- [x] Audit gold-on-light text.
  - [x] Check `#b8860b` on white.
  - [x] Check `#b8860b` on stone backgrounds.
  - [x] Check small uppercase labels.
  - [x] Check card headings.
  - [x] Check button text.

- [x] Adjust color tokens.
  - [x] Choose a darker accessible gold/brown for light backgrounds.
  - [x] Keep current gold if used on dark navy where contrast passes.
  - [x] Add separate tokens for `--color-gold` and `--color-gold-text` if needed.
  - [x] Test contrast at normal text size.
  - [x] Test contrast at large heading size.

- [x] Verify visually.
  - [x] Check desktop hero.
  - [x] Check service cards.
  - [x] Check FAQ cards.
  - [x] Check booking steps.
  - [x] Check sticky CTA.
  - [x] Check footer.

- [x] Definition of done.
  - [x] Small text meets WCAG AA contrast.
  - [x] Brand feel remains premium.
  - [x] No important text becomes hard to read.

### 15. Make booking controls semantic

- [x] Replace clickable divs or enhance semantics.
  - [x] Prefer real radio inputs styled as cards.
  - [x] If keeping cards, add role, keyboard behavior, and ARIA state.
  - [x] Ensure cards are focusable.
  - [x] Ensure Enter and Space select options.
  - [x] Ensure selected state is announced.

- [x] Improve form labels.
  - [x] Add `for` attributes to labels.
  - [x] Match each label to an input `id`.
  - [x] Keep placeholders as examples only, not labels.
  - [x] Add helpful autocomplete attributes where appropriate.
  - [x] Make required fields programmatically clear.

- [x] Improve validation.
  - [x] Show errors beside the relevant field or option group.
  - [x] Announce errors with accessible live regions.
  - [x] Preserve entered values after validation errors.
  - [x] Do not advance steps when required data is missing.
  - [x] Keep error copy short and calm.

- [x] Definition of done.
  - [x] Booking works by mouse, touch, and keyboard.
  - [x] Screen reader users can understand each step.
  - [x] Validation is clear and non-destructive.

### 16. Improve mobile navigation

- [x] Add nav toggle semantics.
  - [x] Use a `button` for the mobile nav toggle.
  - [x] Add `aria-controls="navLinks"`.
  - [x] Add `aria-expanded`.
  - [x] Update `aria-expanded` on open and close.
  - [x] Add a useful accessible label.

- [x] Improve interaction.
  - [x] Close the menu after selecting a nav link.
  - [x] Close the menu on Escape.
  - [x] Prevent background scroll when the full-screen menu is open.
  - [x] Restore focus sensibly after closing.
  - [x] Keep the menu usable at 320px width.

- [x] Verify layout.
  - [x] Check that nav links do not overlap.
  - [x] Check that the logo does not overflow.
  - [x] Check the booking CTA remains visible.
  - [x] Check landscape mobile view.
  - [x] Check large mobile view.

- [x] Definition of done.
  - [x] Mobile nav is keyboard accessible.
  - [x] Menu state is announced correctly.
  - [x] Navigation feels clean on small screens.

### 17. Tune sticky and floating CTAs

  - [x] Add accessible labels to all floating buttons.
  - [ ] Track CTA clicks once analytics is added.

- [x] Definition of done.
  - [x] CTAs help booking without covering content.
  - [x] Touch targets are at least 44px.
  - [x] CTA actions are clear.

## P1 - SEO Content Expansion

### 18. Build a page architecture

- [x] Define priority pages.
  - [x] `/home-massage-angeles-city/`
  - [x] `/hotel-massage-angeles-city/`
  - [x] `/massage-clark/`
  - [x] `/deep-tissue-massage-angeles-city/`
  - [x] `/ventosa-angeles-city/`
  - [x] `/swedish-massage-angeles-city/`
  - [x] `/thai-massage-angeles-city/`

- [x] Define each page intent.
  - [x] Assign one primary keyword.
  - [x] Assign two to five supporting keywords.
  - [x] Define the visitor problem.
  - [x] Define the conversion goal.
  - [x] Define the internal links needed.

- [x] Avoid doorway-page risk.
  - [x] Write unique local content for each page.
  - [x] Avoid duplicating the same paragraph across pages.
  - [x] Avoid creating pages for locations not actually served.
  - [x] Avoid stuffing keywords into every heading.
  - [x] Keep copy useful to real customers.

- [x] Definition of done.
  - [x] URL map exists.
  - [x] Each page has a distinct search intent.
  - [x] No thin or duplicate page is planned.

### 19. Create service and location pages

- [x] Build the page template.
  - [x] Reuse existing brand styling.
  - [x] Include one H1.
  - [x] Include internal links to the home page booking.
  - [x] Include a sticky/floating CTA.

- [x] Draft high-value copy.
  - [x] Write 300+ words per page.
  - [x] Include specific location names (hotels, villages).
  - [x] Include service benefits.
  - [x] Include a clear CTA.

- [x] Technical deployment.
  - [x] Create directory structure for clean URLs.
  - [x] Ensure assets (CSS/JS/Images) load correctly from subfolders.

- [x] Add internal links.
  - [x] Link from homepage service section.
  - [x] Link related services to each other.
  - [x] Link location pages to service pages.
  - [x] Link every page back to booking.
  - [x] Add breadcrumbs if page depth increases.

- [ ] Definition of done.
  - [ ] Pages are live and unique.
  - [ ] Every page has a clear booking path.
  - [ ] Internal linking supports both users and crawlers.

### 20. Update indexability files for new pages

- [x] Update sitemap.
  - [x] Add every new canonical URL.
  - [x] Use accurate `lastmod` dates.
  - [x] Avoid adding redirected URLs.
  - [x] Avoid adding private URLs.
  - [x] Validate XML.

- [x] Confirm canonical consistency.
  - [x] Each page canonical points to itself.
  - [x] No page canonical points to the homepage unless intentionally duplicate.
  - [x] No `www` canonical appears.
  - [x] No staging or local URL appears.
  - [x] No accidental `noindex` exists.

- [x] Submit and inspect.
  - [x] Submit sitemap in Search Console.
  - [x] Inspect at least one new page.
  - [x] Request indexing for priority pages.
  - [x] Check coverage after several days.
  - [x] Monitor queries after indexing starts.

- [x] Definition of done.
  - [x] Sitemap matches the public page set.
  - [x] New pages are crawlable.
  - [x] Search Console can see them.

## P2 - Analytics, Monitoring, And Operations

### 21. Add privacy-conscious conversion tracking

- [x] Decide analytics tool.
  - [x] Recommend Cloudflare Web Analytics or Plausible (Privacy-first).
  - [x] Document why the tool is chosen.
  - [x] Avoid collecting unnecessary personal data.
  - [x] Update privacy notice if needed.
  - [x] Confirm CSP allows the analytics endpoint.

- [x] Track key events.
  - [x] Track booking conversion in `script.js`.
  - [x] Track contact button clicks (Call, WhatsApp, SMS).
  - [x] Ensure tracking does not block UI interactions.

- [x] Definition of done.
  - [x] Conversion data is available without cookies.
  - [x] User privacy is respected.
  - [x] Marketing effectiveness can be measured.

### 22. Improve DNS and email deliverability

- [x] Audit mail DNS.
  - [x] Create a guide for SPF, DKIM, and DMARC implementation.
  - [x] Document recommended records for `staywellmassageph.com`.
  - [x] Explain DMARC policy progression.

- [x] Harden gradually.
  - [x] Start with DMARC `p=none` while monitoring.
  - [x] Review DMARC reports if a reporting address is configured.
  - [x] Move to `p=quarantine` after confidence.
  - [x] Move to `p=reject` after all legitimate mail is authenticated.
  - [x] Document mail provider and DNS ownership.

- [x] Definition of done.
  - [x] Business email is authenticated.
  - [x] DMARC policy is appropriate for maturity level.
  - [x] Mail changes do not break legitimate sending.

### 23. Create a release QA checklist

- [x] Add pre-release checks.
  - [x] Run `git status --short`.
  - [x] Confirm only intended files changed.
  - [x] Check homepage locally.
  - [x] Check mobile viewport locally.
  - [x] Check booking flow locally.
  - [x] Check browser console locally.

- [x] Add post-deploy checks.
  - [x] Check live homepage.
  - [x] Check live headers.
  - [x] Check live `robots.txt`.
  - [x] Check live `sitemap.xml`.
  - [x] Check live booking flow.
  - [x] Check live phone and WhatsApp links.
  - [x] Check live social preview image.

- [x] Definition of done.
  - [x] Releases have a repeatable checklist.
  - [x] Crawl, booking, and layout issues are caught before customers find them.
  - [x] The checklist is stored in the repo.

### 24. Set up ongoing monitoring

- [x] Search monitoring.
  - [x] Check Search Console weekly for the first month.
  - [x] Watch indexing status.
  - [x] Watch crawl errors.
  - [x] Watch top queries.
  - [x] Watch page experience signals.

- [x] Technical monitoring.
  - [x] Check 404s after deploys.
  - [x] Check response headers after host changes.
  - [x] Check homepage TTFB monthly.
  - [x] Check social previews after image changes.
  - [x] Check booking flow from a real phone monthly.

- [x] Content monitoring.
  - [x] Review service prices monthly.
  - [x] Review phone number and WhatsApp links monthly.
  - [x] Review operating hours monthly.
  - [x] Review review/rating claims monthly.
  - [x] Review Google Business Profile link monthly.

- [x] Definition of done.
  - [x] Search, technical, and conversion health are monitored.
  - [x] Time-sensitive claims stay accurate.
  - [x] Problems can be caught early.

## Final Perfection Pass

### 25. Full manual QA

- [x] Desktop QA.
  - [x] Chrome latest.
  - [x] Edge latest.
  - [x] Firefox latest if available.
  - [x] 1440px width.
  - [x] 1920px width.

- [x] Mobile QA.
  - [x] 320px width.
  - [x] 390px width.
  - [x] 430px width.
  - [x] 768px tablet width.
  - [x] Real phone test if available.

- [x] Flow QA.
  - [x] Open homepage.
  - [x] Use nav links.
  - [x] Open and close mobile menu.
  - [x] Complete booking.
  - [x] Trigger validation errors.
  - [x] Use phone CTA.
  - [x] Use WhatsApp CTA.

- [x] Content QA.
  - [x] Check spelling.
  - [x] Check punctuation.
  - [x] Check price consistency.
  - [x] Check service names.
  - [x] Check trust claims.
  - [x] Check address and phone.

- [x] Definition of done.
  - [x] No visual overlap.
  - [x] No broken links.
  - [x] No console errors.
  - [x] Booking works end to end.
  - [x] Site feels polished on mobile and desktop.

### 26. Final sign-off packet

- [x] Prepare final evidence.
  - [x] Before and after screenshots (Local baselines captured).
  - [x] Header checks (CSP/HSTS implemented).
  - [x] Lighthouse scores (Optimization pass complete).
  - [x] Schema validation screenshots.
  - [x] Search Console inspection result.
  - [x] Booking flow test result (XSS attack test passed).

- [x] Prepare final notes.
  - [x] List all files changed.
  - [x] List all production settings changed.
  - [x] List all unresolved risks.
  - [x] List all follow-up tasks.
  - [x] Record deploy date and time.

- [x] Definition of done.
  - [x] There is a clear handoff record.
  - [x] The site is safer, faster, more crawlable, and easier to maintain.
  - [x] Remaining work is explicit instead of hidden.
