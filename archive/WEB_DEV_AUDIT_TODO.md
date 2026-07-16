# Stay Well Web Dev Audit Todo

Generated: April 27, 2026

This checklist is ordered so the highest-risk issues are handled first: crawlability, security, booking safety, private asset exposure, and performance.

Use this as a working punch list. Each numbered section is a main task. Each top-level checkbox under it is a work package with nested subtasks.

## Next 1-2 Days

### 1. Freeze And Verify Current State

- [ ] Establish a safe working baseline.
  - [ ] Create a working branch before touching production-facing files.
  - [ ] Run `git status --short` and note all existing modified files.
  - [ ] Review the existing modified `style.css` before editing so current work is not overwritten.
  - [ ] Save or screenshot the current homepage before making changes.
  - [ ] Save or screenshot the current booking flow before making changes.

- [ ] Verify what real visitors currently receive.
  - [ ] Open `https://staywellmassageph.com/` in an incognito browser.
  - [ ] Confirm whether normal visitors see the real homepage or a bot verification page.
  - [ ] Test the homepage from mobile data if possible, not only local Wi-Fi.
  - [ ] Confirm the homepage returns the real page without requiring login, CAPTCHA, or challenge.

- [ ] Verify crawl-critical public files.
  - [ ] Test `https://staywellmassageph.com/robots.txt`.
  - [ ] Confirm `robots.txt` returns `200 OK`.
  - [ ] Confirm `robots.txt` points to `https://staywellmassageph.com/sitemap.xml`.
  - [ ] Test `https://staywellmassageph.com/sitemap.xml`.
  - [ ] Confirm `sitemap.xml` returns `200 OK`.
  - [ ] Confirm `sitemap.xml` contains the canonical homepage URL.
  - [ ] Test `https://staywellmassageph.com/stay_well_navy_gold_hero_1777074342140.webp`.
  - [ ] Confirm the social preview image is publicly reachable.

- [ ] Capture baseline search and performance evidence.
  - [ ] Run Google Search Console URL Inspection for `https://staywellmassageph.com/`.
  - [ ] Confirm Google sees the rendered homepage, not "Verifying that you are not a robot."
  - [ ] Record current Lighthouse mobile scores.
  - [ ] Record current Lighthouse desktop scores.
  - [ ] Save screenshots of the mobile nav, hero, booking form, and footer.

- [ ] Completion check.
  - [ ] Current visitor behavior is documented.
  - [ ] Search Console live inspection result is documented.
  - [ ] Lighthouse baseline is documented.
  - [ ] Existing local file changes are understood before edits begin.

### 2. Fix Bot Verification / Crawl Blocking

- [ ] Identify the source of the bot challenge.
  - [ ] Check Cloudflare security settings if Cloudflare is used.
  - [ ] Check hosting firewall or bot protection settings.
  - [ ] Check Vercel protection settings if Vercel is the production host.
  - [ ] Check any domain-level security or proxy service.
  - [ ] Identify exactly which layer produced the bot verification page.

- [ ] Allow legitimate crawlers and previews.
  - [ ] Disable challenges for verified Googlebot.
  - [ ] Disable challenges for verified Bingbot.
  - [ ] Allow Facebook preview crawler access to the homepage and OG image.
  - [ ] Allow WhatsApp preview crawler access to the homepage and OG image.
  - [ ] Allow normal unauthenticated visitors to reach the public homepage.

- [ ] Confirm crawlability after the fix.
  - [ ] Confirm the homepage returns `200 OK` with actual HTML.
  - [ ] Confirm `robots.txt` returns `200 OK` and expected text.
  - [ ] Confirm `sitemap.xml` returns `200 OK` and valid XML.
  - [ ] Confirm the OG image returns `200 OK`.
  - [ ] Re-run Google Search Console live URL inspection.
  - [ ] Request indexing for the homepage after the live inspection passes.

- [ ] Completion check.
  - [ ] Google can render the homepage.
  - [ ] Social preview crawlers can fetch metadata and image assets.
  - [ ] Normal visitors do not hit a bot wall before seeing the site.

### 3. Unify Security Headers

- [ ] Decide the production header source of truth.
  - [ ] Confirm whether production is Vercel, Netlify, Apache, or another host.
  - [ ] If production is Vercel, make `vercel.json` authoritative.
  - [ ] Confirm whether `_headers` is actually deployed.
  - [ ] Confirm whether `.htaccess` is actually deployed.
  - [ ] Mark unused header files as legacy or remove them in a later cleanup.

- [ ] Remove conflicting CSP behavior.
  - [ ] Remove or neutralize the meta CSP in `index.html`.
  - [ ] Keep CSP in server headers, not split across HTML and server config.
  - [ ] Confirm there is only one effective production CSP after deploy.
  - [ ] Confirm browser console no longer reports duplicate/conflicting CSP failures.

- [ ] Build a temporary compatibility CSP.
  - [ ] Include `default-src 'self'`.
  - [ ] Include `script-src 'self'`.
  - [ ] Include `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` as a short-term compatibility step.
  - [ ] Include `font-src https://fonts.gstatic.com`.
  - [ ] Include `img-src 'self' data: https://staywellmassageph.com`.
  - [ ] Include `frame-src https://www.google.com` if the embedded map stays.
  - [ ] Include `object-src 'none'`.
  - [ ] Include `base-uri 'self'`.
  - [ ] Include `frame-ancestors 'none'`.
  - [ ] Include `upgrade-insecure-requests`.

- [ ] Keep useful security headers and remove stale ones.
  - [ ] Keep `Strict-Transport-Security`.
  - [ ] Keep `X-Content-Type-Options: nosniff`.
  - [ ] Keep `Referrer-Policy: strict-origin-when-cross-origin`.
  - [ ] Keep `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
  - [ ] Remove deprecated `X-XSS-Protection`.

- [ ] Verify after deploy.
  - [ ] Confirm the stylesheet loads.
  - [ ] Confirm Google Fonts load.
  - [ ] Confirm the Google Map iframe loads, or intentionally replace it.
  - [ ] Confirm all booking interactions still work.
  - [ ] Confirm there are no CSP errors in the browser console.

- [ ] Completion check.
  - [ ] Production has one clear header policy.
  - [ ] CSP protects the site without breaking current rendering.
  - [ ] Header config matches the actual deployment platform.

### 4. Fix Booking XSS

- [ ] Replace unsafe booking summary rendering.
  - [ ] Locate `summaryEl.innerHTML` in `script.js`.
  - [ ] Replace template HTML insertion with DOM node creation.
  - [ ] Insert all user-controlled values with `textContent`.
  - [ ] Keep static labels separate from user-provided values.
  - [ ] Avoid inserting `name`, `address`, `date`, or `time` as HTML.

- [ ] Confirm booking state is constrained.
  - [ ] Confirm `bookingData.tier` only comes from controlled option cards.
  - [ ] Confirm `bookingData.focus` only comes from controlled option cards.
  - [ ] Confirm date and time are read only from form controls.
  - [ ] Confirm name and address are treated as plain text.
  - [ ] Confirm the final WhatsApp message is encoded with `encodeURIComponent`.

- [ ] Attack-test the form.
  - [ ] Test this input in the name field: `<img src=x onerror=alert(1)>`.
  - [ ] Test this input in the address field: `<script>alert(1)</script>`.
  - [ ] Test a very long hotel address.
  - [ ] Test apostrophes, quotes, ampersands, and angle brackets.
  - [ ] Confirm the summary displays text only.
  - [ ] Confirm no alert or script executes.

- [ ] Verify booking UX still works.
  - [ ] Complete all five booking steps with normal input.
  - [ ] Confirm the summary layout still looks correct.
  - [ ] Confirm WhatsApp opens with the correct booking details.
  - [ ] Confirm the submit button disables only after final submission.

- [ ] Completion check.
  - [ ] User input never becomes executable HTML.
  - [ ] Booking flow still sends the intended WhatsApp message.
  - [ ] Malicious test strings render harmlessly as text.

### 5. Remove Public Private Portal Risk

- [ ] Decide the production status of `assets.html`.
  - [ ] Confirm whether `assets.html` is needed by public visitors.
  - [ ] Confirm whether it is currently deployed.
  - [ ] Confirm whether `https://staywellmassageph.com/assets.html` is reachable.
  - [ ] Decide whether it should be removed, moved, or server-protected.

- [ ] Remove client-side-only protection.
  - [ ] Remove the exposed `ACCESS_KEY` from `assets.html`.
  - [ ] Remove client-side password gate logic if the page is not public.
  - [ ] Do not rely on Base64, JavaScript checks, disabled right-click, or hidden UI.
  - [ ] Do not treat `robots.txt` as a security control.

- [ ] Apply the real access fix.
  - [ ] Preferred fix: move `assets.html` outside the deployed public root.
  - [ ] If it must remain available, protect it with server-side authentication.
  - [ ] If removed, confirm it returns `404` or redirects intentionally.
  - [ ] If protected, confirm unauthenticated visitors cannot access the content.

- [ ] Reduce accidental exposure.
  - [ ] Confirm private brand-generation tools are not linked from public pages.
  - [ ] Confirm uploaded local photos in the asset tool are not transmitted anywhere unexpectedly.
  - [ ] Add `Disallow: /assets.html` only as a crawl hint after the real access fix.
  - [ ] Remove or isolate any generated private assets that do not belong on the public site.

- [ ] Completion check.
  - [ ] The brand tool is no longer publicly accessible unless intentionally authenticated.
  - [ ] No client-side secret is used as a security boundary.
  - [ ] Production no longer exposes private owner-only tooling by URL guessing.

### 6. Compress The Worst Assets

- [ ] Audit current image usage.
  - [ ] List all image files by size.
  - [ ] Identify which images are used on the homepage.
  - [ ] Identify which images are used only by `assets.html`.
  - [ ] Identify which images are unused.
  - [ ] Confirm `official-logo.png` is currently too large for footer and manifest use.

- [ ] Create production-sized logo assets.
  - [ ] Create a footer logo around `400px` wide.
  - [ ] Create a manifest icon at `512x512`.
  - [ ] Create a manifest icon at `192x192`.
  - [ ] Create a properly optimized favicon.
  - [ ] Keep original source artwork outside the public production root.

- [ ] Optimize large visual assets.
  - [ ] Convert large PNGs to WebP or AVIF where transparency is not required.
  - [ ] Keep PNG only where transparency or sharp logo edges require it.
  - [ ] Keep the existing hero WebP or replace it only with a better optimized version.
  - [ ] Check compression visually at mobile and desktop sizes.
  - [ ] Avoid shipping duplicate PNG and WebP versions when only one is needed publicly.

- [ ] Update file references.
  - [ ] Update `manifest.json` icon paths.
  - [ ] Update the footer image path if a smaller logo file is created.
  - [ ] Update favicon and apple-touch-icon references if new files are created.
  - [ ] Confirm the social preview image still resolves.
  - [ ] Confirm no broken local image references remain.

- [ ] Verify performance impact.
  - [ ] Confirm the homepage no longer downloads the 6.5 MB logo.
  - [ ] Confirm total homepage image transfer is meaningfully reduced.
  - [ ] Confirm visual quality is acceptable on desktop.
  - [ ] Confirm visual quality is acceptable on mobile.
  - [ ] Confirm cache headers apply to root-level image assets, not only `/assets/*`.

- [ ] Completion check.
  - [ ] Heavy original artwork is not loaded by the homepage.
  - [ ] Manifest and footer use right-sized assets.
  - [ ] Image optimization improves load without visible quality loss.

### 7. Final Same-Day QA

- [ ] Test core layouts.
  - [ ] Test desktop Chrome.
  - [ ] Test mobile viewport around `390px` wide.
  - [ ] Test tablet viewport around `768px` wide.
  - [ ] Confirm hero text is readable and not overlapping.
  - [ ] Confirm sticky CTA and floating contact buttons do not cover important content.

- [ ] Test navigation and anchors.
  - [ ] Test the mobile nav open behavior.
  - [ ] Test the mobile nav close behavior.
  - [ ] Test each homepage anchor link.
  - [ ] Confirm smooth scrolling lands at sensible positions.
  - [ ] Confirm nav links remain usable after scrolling.

- [ ] Test booking flow.
  - [ ] Test the full five-step booking funnel.
  - [ ] Test validation when no treatment tier is selected.
  - [ ] Test validation when no treatment focus is selected.
  - [ ] Test validation when date/time is missing.
  - [ ] Test validation when name/address is missing.
  - [ ] Test final WhatsApp handoff.

- [ ] Test contact and embed features.
  - [ ] Test call link.
  - [ ] Test SMS link.
  - [ ] Test WhatsApp floating link.
  - [ ] Test Google Map rendering.
  - [ ] Confirm external links behave intentionally.

- [ ] Run technical checks.
  - [ ] Check browser console for CSP errors.
  - [ ] Check browser console for JavaScript errors.
  - [ ] Run Lighthouse mobile.
  - [ ] Run Lighthouse desktop.
  - [ ] Re-run Search Console live URL inspection.
  - [ ] Submit updated sitemap if URLs changed.

- [ ] Completion check.
  - [ ] The deployed site is crawlable, functional, and visually stable.
  - [ ] Booking works after security fixes.
  - [ ] No critical console errors remain.

## Next 2-4 Weeks

### 1. Clean Up Inline Styles And CSP Debt

- [ ] Inventory inline code and style debt.
  - [ ] Count inline `style` attributes in `index.html`.
  - [ ] Count inline `style` attributes in `assets.html` if it remains.
  - [ ] Identify inline `onload` handlers.
  - [ ] Identify inline `onclick` handlers.
  - [ ] Identify inline SVG styles that can become classes.

- [ ] Move homepage inline styles into CSS.
  - [ ] Replace hero inline background style with a class.
  - [ ] Replace repeated service-card styles with reusable CSS classes.
  - [ ] Replace repeated wisdom-card styles with reusable CSS classes.
  - [ ] Replace repeated location-list styles with reusable CSS classes.
  - [ ] Replace repeated CTA/link inline styles with reusable CSS classes.

- [ ] Remove inline event-handler dependencies.
  - [ ] Remove `onload="this.media='all'"` stylesheet patterns.
  - [ ] Use standard stylesheet loading unless performance testing proves otherwise.
  - [ ] Replace remaining inline event handlers in `assets.html` if that file remains.
  - [ ] Move JavaScript behavior into external JS files.

- [ ] Tighten CSP after cleanup.
  - [ ] Remove `'unsafe-inline'` from `style-src` after inline styles are gone.
  - [ ] Consider nonce or hash-based CSP only if inline blocks are truly necessary.
  - [ ] Add `report-uri` or `report-to` if a CSP reporting endpoint exists.
  - [ ] Test console output after CSP tightening.
  - [ ] Document the final CSP policy and why each source is allowed.

- [ ] Completion check.
  - [ ] Inline styles are substantially reduced or eliminated.
  - [ ] CSP is stricter than the temporary emergency policy.
  - [ ] Site rendering still matches the intended design.

### 2. Rework Structured Data Carefully

- [ ] Audit existing schema against visible content.
  - [ ] Confirm the `LocalBusiness` name matches the visible business name.
  - [ ] Confirm phone number includes the correct country code format.
  - [ ] Confirm address is accurate and intended for public display.
  - [ ] Confirm opening hours are accurate.
  - [ ] Confirm service areas are accurate.

- [ ] Remove or justify risky review markup.
  - [ ] Remove self-serving `AggregateRating` markup unless compliance is confirmed.
  - [ ] Remove self-serving `review` markup unless compliance is confirmed.
  - [ ] Verify all visible review content is genuine and sourced.
  - [ ] Do not mark up fake, edited, or unsourced reviews.
  - [ ] Keep visible review claims consistent with any remaining structured data.

- [ ] Improve factual business schema.
  - [ ] Add official `sameAs` links for social profiles.
  - [ ] Add `hasMap` if there is an official map/profile URL.
  - [ ] Keep `areaServed` accurate.
  - [ ] Add `paymentAccepted` if payment methods are stable.
  - [ ] Improve the service catalog with specific services and descriptions.

- [ ] Clean up FAQ schema.
  - [ ] Keep FAQ schema only where the exact FAQ content is visible on the page.
  - [ ] Remove advertising-heavy FAQ answers.
  - [ ] Keep answers concise and factual.
  - [ ] Confirm the FAQ page content matches the JSON-LD text.

- [ ] Validate and monitor.
  - [ ] Validate with Google Rich Results Test.
  - [ ] Validate with Schema.org validator.
  - [ ] Inspect the live URL in Search Console.
  - [ ] Keep page content aligned with JSON-LD after every copy change.

- [ ] Completion check.
  - [ ] Structured data is factual, visible, and policy-aware.
  - [ ] Risky review markup is removed or formally justified.
  - [ ] Validation tools show no critical structured data errors.

### 3. Build Real SEO Landing Pages

- [ ] Plan page architecture.
  - [ ] Create a URL map for all planned service/location pages.
  - [ ] Decide whether pages are standalone HTML files or generated from a template.
  - [ ] Define the primary keyword intent for each page.
  - [ ] Define one conversion goal for each page.

- [ ] Create location and service pages.
  - [ ] Create `/home-massage-angeles-city/`.
  - [ ] Create `/hotel-massage-angeles-city/`.
  - [ ] Create `/massage-clark/`.
  - [ ] Create `/deep-tissue-massage-angeles-city/`.
  - [ ] Create `/ventosa-angeles-city/`.

- [ ] Write unique on-page SEO for each page.
  - [ ] Give each page a unique title.
  - [ ] Give each page a unique meta description.
  - [ ] Give each page one clear H1.
  - [ ] Add unique intro copy for each search intent.
  - [ ] Add service-specific benefits without duplicating homepage copy.
  - [ ] Add service area details relevant to each page.
  - [ ] Add a concise FAQ section per page.
  - [ ] Add a strong booking CTA per page.

- [ ] Build internal linking.
  - [ ] Link from the homepage to each landing page.
  - [ ] Link related landing pages to each other naturally.
  - [ ] Add breadcrumbs if pages become more than one level deep.
  - [ ] Make sure visitors can return to the homepage and booking section easily.

- [ ] Update indexability files.
  - [ ] Add all new pages to `sitemap.xml`.
  - [ ] Confirm canonical URLs for every new page.
  - [ ] Confirm all pages return `200 OK`.
  - [ ] Confirm no landing page has accidental `noindex`.

- [ ] Avoid low-quality local SEO patterns.
  - [ ] Avoid doorway-page duplication.
  - [ ] Avoid stuffing "massage Angeles City" into every heading.
  - [ ] Avoid reusing the same paragraph across every page.
  - [ ] Avoid creating pages for locations not actually served.

- [ ] Completion check.
  - [ ] Every landing page has unique value and a clear booking path.
  - [ ] Sitemap and canonicals match the new page set.
  - [ ] Pages are written for humans first and search engines second.

### 4. Improve Core Web Vitals

- [ ] Improve LCP.
  - [ ] Keep the hero image optimized and preloaded.
  - [ ] Confirm the hero image is not larger than needed.
  - [ ] Avoid blocking the first paint with unnecessary CSS or JS.
  - [ ] Confirm the LCP element is stable and visible quickly.

- [ ] Improve CLS.
  - [ ] Add explicit dimensions or aspect-ratio rules for all major images.
  - [ ] Reserve space for the hero, footer logo, and major visual sections.
  - [ ] Reserve space for the Google Map if it stays.
  - [ ] Fix any layout shift caused by sticky bars, fonts, images, or late-loading embeds.

- [ ] Improve INP.
  - [ ] Reduce or disable scroll parallax on mobile.
  - [ ] Avoid expensive scroll handlers.
  - [ ] Keep booking interactions lightweight.
  - [ ] Defer non-critical scripts where possible.

- [ ] Reduce transfer size.
  - [ ] Use responsive image sizes where practical.
  - [ ] Lazy-load below-the-fold images.
  - [ ] Lazy-load or defer the Google Map iframe.
  - [ ] Consider replacing the map iframe with a static image plus "Open in Google Maps."
  - [ ] Avoid loading large unused social assets on the homepage.

- [ ] Optimize production assets.
  - [ ] Minify CSS for production if the deployment process supports it.
  - [ ] Minify JavaScript for production if the deployment process supports it.
  - [ ] Confirm cache headers for immutable assets.
  - [ ] Confirm compression is enabled for HTML, CSS, and JS.

- [ ] Measure results.
  - [ ] Run Lighthouse before changes.
  - [ ] Run Lighthouse after changes.
  - [ ] Track LCP.
  - [ ] Track CLS.
  - [ ] Track INP.
  - [ ] Compare real mobile results, not only desktop.

- [ ] Completion check.
  - [ ] Page loads faster on mobile.
  - [ ] Layout shift is low.
  - [ ] Scroll and booking interactions feel responsive.

### 5. Accessibility And Conversion Polish

- [ ] Make booking controls semantic.
  - [ ] Convert clickable `.option-card` divs into real buttons or radio controls.
  - [ ] Make selected booking options visually clear.
  - [ ] Make selected booking options semantically clear.
  - [ ] Ensure option cards can be selected with keyboard input.

- [ ] Improve form labeling and errors.
  - [ ] Add proper labels using `for` and matching input `id`.
  - [ ] Replace `alert()` validation with inline form errors.
  - [ ] Announce validation errors accessibly.
  - [ ] Keep error text close to the relevant field.
  - [ ] Confirm date/time/name/address fields are understandable without placeholders.

- [ ] Improve focus and keyboard behavior.
  - [ ] Add visible focus states for buttons.
  - [ ] Add visible focus states for nav links.
  - [ ] Add visible focus states for booking option cards.
  - [ ] Add visible focus states for form fields.
  - [ ] Test the booking flow keyboard-only.

- [ ] Improve mobile nav accessibility.
  - [ ] Add `aria-expanded` to the mobile nav toggle.
  - [ ] Add `aria-controls` to the mobile nav toggle.
  - [ ] Ensure the mobile menu can be closed with keyboard navigation.
  - [ ] Ensure focus does not get lost when the menu opens or closes.

- [ ] Check visual accessibility and conversion friction.
  - [ ] Ensure touch targets are at least `44px`.
  - [ ] Confirm color contrast for gold text on light backgrounds.
  - [ ] Confirm color contrast for gold text on dark backgrounds.
  - [ ] Ensure sticky CTA and floating contact buttons do not overlap content on mobile.
  - [ ] Confirm CTAs are easy to find without feeling spammy.

- [ ] Completion check.
  - [ ] Booking works with mouse, touch, and keyboard.
  - [ ] Form errors are clear and accessible.
  - [ ] Mobile users can navigate and book without obstruction.

### 6. Deployment Hygiene

- [ ] Decide deployment ownership.
  - [ ] Decide whether the project is Vercel-only, Netlify-only, Apache-only, or intentionally portable.
  - [ ] Document the production host.
  - [ ] Document how deploys happen.
  - [ ] Document which config files are active.

- [ ] Clean up deployment config.
  - [ ] Remove unused deployment configs or clearly mark them as legacy.
  - [ ] Keep one authoritative header policy.
  - [ ] Add cache headers for root image assets.
  - [ ] Confirm compression settings are active on the real host.
  - [ ] Confirm redirects and trailing slash behavior are intentional.

- [ ] Separate source assets from production assets.
  - [ ] Keep source images in a separate non-public folder.
  - [ ] Keep generated social assets out of the public root unless needed.
  - [ ] Keep owner-only tools out of the public root.
  - [ ] Keep only optimized production assets publicly deployed.

- [ ] Add a release checklist to the repo.
  - [ ] Include "no console errors" in the release checklist.
  - [ ] Include "no broken assets" in the release checklist.
  - [ ] Include "schema validates" in the release checklist.
  - [ ] Include "sitemap updated" in the release checklist.
  - [ ] Include "homepage crawlable" in the release checklist.
  - [ ] Include "booking tested" in the release checklist.
  - [ ] Include "mobile nav tested" in the release checklist.
  - [ ] Include "CSP checked" in the release checklist.

- [ ] Completion check.
  - [ ] The repo clearly shows what deploys to production.
  - [ ] Header behavior is predictable.
  - [ ] Releases have a repeatable QA gate.

### 7. Monitoring

- [ ] Set up search monitoring.
  - [ ] Connect Google Search Console if not already connected.
  - [ ] Submit the sitemap.
  - [ ] Check indexing weekly for the first month after fixes.
  - [ ] Monitor coverage issues after new landing pages launch.

- [ ] Track local SEO query performance.
  - [ ] Track top queries for Angeles City.
  - [ ] Track top queries for Clark.
  - [ ] Track top queries for hotel massage.
  - [ ] Track top queries for home massage.
  - [ ] Watch for query cannibalization after adding landing pages.

- [ ] Monitor technical health.
  - [ ] Monitor `404` errors after every deploy.
  - [ ] Monitor crawl errors after every deploy.
  - [ ] Check social preview rendering after major asset changes.
  - [ ] Periodically test the booking funnel from a real mobile device.
  - [ ] Periodically check browser console on production.

- [ ] Add analytics carefully.
  - [ ] Add privacy-safe analytics if needed.
  - [ ] Track booking CTA clicks.
  - [ ] Track WhatsApp handoff clicks.
  - [ ] Track call and SMS clicks.
  - [ ] Avoid collecting unnecessary personal data.

- [ ] Completion check.
  - [ ] Search visibility, crawl health, and conversion actions are monitored.
  - [ ] Issues can be detected after deploys instead of discovered by customers.
  - [ ] Analytics respect user privacy while still showing business-critical behavior.
