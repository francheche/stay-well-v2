# Stay Well Massage: Full Website, SEO, GEO, and Repository Audit

**Audit date:** July 15, 2026  
**Website:** https://staywellmassageph.com/  
**Repository:** `projects/stay-well-v2-main`  
**Change posture:** Preserve current rankings; make the smallest independently testable changes.  
**Repository safety:** No existing file was deleted or moved during this audit. The new `archive/` directory is preservation-only.

## Executive decision

The site already has a strong crawlable foundation: useful service pages, unique titles and descriptions, canonical URLs, one H1 per indexed page, raw HTML content, a sitemap, robots directives, and good transactional intent. A broad rewrite, URL migration, or mass metadata change is not justified.

The safest upgrade is a staged technical correction:

1. Remove only the ineligible `aggregateRating` object from the homepage JSON-LD.
2. Stop the JavaScript exception affecting the service and article subpages.
3. Repair the one broken hotel-page image.
4. Stabilize the homepage CSS and font loading to reduce layout shift.
5. Correct the confirmed accessibility semantics and contrast issues.
6. Exclude source templates, archive material, internal tools, and project documents from production deployment while keeping every local file.
7. Improve content and local/GEO signals only after Search Console and Google Business Profile baselines are exported.

These actions do not require changing the current production URLs, page purpose, primary headings, titles, descriptions, canonicals, business name, or booking flow.

## Scope and evidence

The audit covered:

- All 10 URLs declared in `sitemap.xml` and the production homepage.
- Fresh PageSpeed Insights mobile and desktop tests.
- HTML, CSS, JavaScript, JSON-LD, robots, sitemap, redirects, headers, server configuration, and deployment files.
- The supplied Google Trends CSV files.
- The existing audit and implementation documents.
- Current-tree secret patterns, browser console behavior, local asset references, and repository organization.
- The supplied integrated web asset auditing framework, with current Google Search guidance used where the framework's recommendations are not authoritative.

Limitations:

- No Google Search Console, Google Business Profile, analytics, backlink-tool, or local rank-grid access was available.
- PageSpeed reported no real-user field data for the tested origin, so the Core Web Vitals conclusions below are lab findings, not a 75th-percentile field pass/fail determination.
- The directory contains no `.git` metadata, so history, branches, prior secrets, deployment commits, and rollback points cannot be audited.
- A number-one organic or Maps ranking cannot be guaranteed. Rankings depend on relevance, distance, prominence, competitors, reviews, links, and Google systems outside this repository.

## Current scorecard

| Domain | Current state | Confidence | Main issue |
|---|---:|---:|---|
| Usability / conversion | 7/10 | High | Strong booking path, but subpage JS crashes and privacy context is missing. |
| Accessibility | 6/10 | High | Lighthouse 86–87; menu semantics, contrast, list semantics, and heading order fail. |
| Technical SEO | 7/10 | High | Crawlable and well structured, but review markup is ineligible and source pages are public. |
| Performance / CWV | 6/10 | High for lab | Performance 66 mobile / 80 desktop; CLS 0.481 / 0.379. |
| On-page SEO / E-E-A-T | 7/10 | High | Good service intent; articles need real HTML hierarchy, citations, bylines, and claim review. |
| Local SEO | 6/10 | Medium | Strong local landing pages; GBP, NAP citations, reviews, and local-pack position were not verifiable. |
| GEO / AI discoverability | 7/10 | Medium | Raw HTML and clear entities help; direct answers, citations, and authorship are thin. |
| Security / privacy | 6/10 | Medium | Low application attack surface; public internal hub, configuration drift, and no visible privacy notice. |
| Repository / delivery | 4/10 | High | No Git history, tests, CI, deployment source-of-truth, or clean separation of production and source assets. |

The numeric scores are prioritization aids, not compliance certifications.

## Confirmed high-priority findings

### 1. Review snippet structured data is ineligible

**Evidence:** `index.html` declares a `MassageTherapist` entity with an embedded `aggregateRating` of 5.0 and 79 reviews. Google Search Console reports `Invalid object type for field "<parent_node>"`.

Google's review-snippet rules do not allow self-serving review rich results for `LocalBusiness` or `Organization` entities, including reviews embedded from Google or Facebook. Google's `LocalBusiness` documentation describes `aggregateRating` for sites that capture reviews about other local businesses. Changing the type to `Product`, inventing a parent, or otherwise disguising the reviewed entity would be incorrect.

**Smallest correct change:** Remove only the `aggregateRating` object from JSON-LD. Keep the visible, accurate review summary and testimonials, ideally with a normal link to the verified Google Business Profile. Validate the resulting markup with Rich Results Test, deploy, and then use Search Console's validation workflow.

**Ranking risk:** Low. This removes an ineligible enhancement; it does not remove the visible reviews, business entity, LocalBusiness information, or page content.

Sources: [Google review snippet structured data](https://developers.google.com/search/docs/appearance/structured-data/review-snippet), [Google LocalBusiness structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business).

### 2. Homepage layout shift is the largest performance defect

Fresh PageSpeed lab results:

| Mode | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Mobile | 66 | 87 | 100 | 100 | 3.2 s | 3.2 s | 0 ms | 0.481 |
| Desktop | 80 | 86 | 100 | 100 | 0.8 s | 0.8 s | 0 ms | 0.379 |

The desktop layout-shift audit attributed 0.355 of 0.379 to the main hero/journey container. The homepage inlines partial critical CSS, then loads the full unminified `style.css` through a `media="print"`/`onload` pattern; Google Fonts are also loaded asynchronously. The page changes layout after first paint. Image savings were only about 5–7 KiB, so a broad image-compression campaign is not the primary fix.

**Smallest test:** Load the existing full minified stylesheet synchronously on the homepage and remove the asynchronous full-CSS handoff. Test fonts separately only if CLS remains. Do not combine this with a visual redesign.

CLS is considered good at 0.1 or less and poor above 0.25. Real-user evaluation should use the 75th percentile, but this origin currently has no PageSpeed field data. Source: [Optimize Cumulative Layout Shift](https://web.dev/articles/cls), [Web Vitals](https://web.dev/articles/vitals).

### 3. JavaScript crashes on subpages

The live browser console on a service page reports:

`TypeError: Cannot read properties of null (reading 'addEventListener')`

In `script.js`, homepage-only previous/next controls are queried and then receive listeners without null guards. Those controls are absent from service and article pages, so script execution stops on every page that imports the shared bundle without those elements.

**Smallest change:** Guard both controls and their related logic, or initialize the component only when its container exists. Rebuild `script.min.js` from the same source and run a console smoke test on all 10 sitemap URLs.

### 4. Broken image on the hotel service page

`hotel-massage-angeles-city/index.html` references `../therapist-arrival.png`, but the asset does not exist. The live URL returns a Hostinger HTML 404 page instead of an image.

**Smallest change:** Add an approved, optimized image at that exact path or point the element to an existing relevant asset. Preserve the current page URL and alt-text intent. Add an automated internal asset-reference check.

### 5. Internal/source pages are publicly reachable

- `/_archived/private/assets.html` is live as “Stay Well Massage - Elite Brand Hub.”
- `/subpage-template.html` is live with placeholder copy and a canonical to a nonexistent slug.
- The production tree also contains archive files, source photos, Google Trends exports, and project/audit documents.

Moving an internal tool beneath a directory named `_archived` did not make it private. `.vercelignore` is not a sufficient control for the apparent Hostinger production path.

**Smallest change:** Establish a production allowlist containing only the public site files. Exclude `_archived/`, `archive/`, `new add therapist/`, `google trends/`, `docs/`, Markdown files, and source templates from uploads. Keep all local files. Add `noindex` immediately if deployment exclusion cannot happen in the same release; exclusion/404 is the final state.

### 6. Confirmed accessibility failures

PageSpeed identified:

- `role="menubar"` without the required child roles.
- Insufficient color contrast.
- List items without valid list parents.
- Heading levels that skip their logical order.

The site navigation is normal web navigation, not an application menubar. Removing `role="menubar"` is safer and simpler than adding a full ARIA menu interaction model. Article pages jump from H1 to H3, and the homepage also has skipped section levels. Gold normal-sized text and white-on-gold buttons need contrast verification. The booking cards also need a proper `radiogroup`, linked validation messages, `aria-invalid`, and an `aria-live` error summary.

**Smallest change:** Fix semantics without changing visible copy or layout, then perform keyboard-only, focus-visible, 200% zoom, and screen-reader smoke tests.

### 7. Article HTML, evidence, and health claims need correction

The two article pages contain literal Markdown `**` markers inside HTML paragraphs and use H3 without preceding H2 sections. Article JSON-LD lacks a visible byline, reviewer credentials, citations, and `dateModified`.

Several claims are stronger than the available evidence, including “flush out lactic acid and toxins,” broad cortisol implications, and ventosa as preparation for deep sleep. These should be softened, sourced, or removed. Author/reviewer identity should reflect a real, verifiable person rather than a fabricated expert profile.

Sources: [NCCIH massage therapy overview](https://www.nccih.nih.gov/health/massage-therapy-what-you-need-to-know), [NCCIH cupping overview](https://www.nccih.nih.gov/health/cupping).

### 8. The booking flow needs a concise privacy notice

The booking flow asks for a person's name and home/hotel address, then transfers that information to WhatsApp after confirmation. The code safely uses `textContent` and URL encoding, but the user does not see a privacy notice explaining controller identity, purpose, recipient/channel, retention, or rights.

**Smallest change:** Add a short just-in-time notice immediately before submission and link a concise privacy page. Confirm actual operational retention and deletion practices with the business before publishing them. This audit is not a legal certification.

Sources: [Philippines National Privacy Commission—right to be informed](https://privacy.gov.ph/the-right-to-be-informed/), [Data Privacy Act of 2012](https://privacy.gov.ph/data-privacy-act/).

## SEO and GEO assessment

### Preserve these strengths

- All sitemap pages expose substantive text in initial HTML; content does not depend on client-side rendering.
- Each inspected public page has a unique title, description, canonical, and a single H1.
- Commercial pages map cleanly to Thai, Swedish, deep-tissue, ventosa, home, hotel, Clark, and Angeles City intent.
- The homepage presents pricing, service-area context, hours, policies, testimonials, and a direct booking path.
- `robots.txt` permits crawling and names the sitemap.
- A neutral web search for Angeles City home/hotel massage showed the domain prominently, although that is not proof of a stable Google organic or Maps position.

### Do not make these risky changes now

- Do not rename or consolidate the existing ranking URLs.
- Do not mass-rewrite titles, descriptions, H1s, or service copy just to meet arbitrary character counts.
- Do not add doorway pages for every neighborhood or low-volume keyword.
- Do not change business name/category/location fields without verified GBP and business records.
- Do not add fake reviews, fabricated author biographies, unsupported awards, or schema properties not visible on the page.
- Do not change the entity type to evade Google's self-serving review policy.
- Do not prioritize `llms.txt` as if it were a Google requirement. Google says no special AI text file or special schema is required for its AI search features; normal crawlability, internal links, textual content, page experience, accurate structured data, and an up-to-date Business Profile remain the foundation.

Source: [Google guidance for AI features and websites](https://developers.google.com/search/docs/appearance/ai-features).

### Low-risk GEO improvements

1. Give each service page a concise, visible answer block: what the service is, who it may suit, session options, service area, arrival expectations, and how to book.
2. Add factual FAQ answers only where they help visitors; do not duplicate identical FAQ blocks across pages.
3. Add real author and clinical/content reviewer attribution to health-adjacent articles, with sources and truthful modified dates.
4. Use consistent entity facts—business name, phone, URL, hours, service area, map/GBP URL, and social profiles—across visible content, JSON-LD, GBP, and citations.
5. Add `sameAs` and `hasMap` only after the exact official URLs are verified.
6. Keep schema aligned with visible content and validate after each release.

### Google Trends interpretation

The supplied three-month Philippines-wide exports show high absolute interest in broad terms such as “Japanese massage,” “spa massage,” and “massage near me,” plus growth for “full body massage,” “Thai massage near me,” and “can I take a bath after massage.” They also contain competitor/brand queries.

Recommended use:

- Do not target Japanese massage, Nuat Thai, Sebo, or other brands unless they describe services genuinely offered and can be discussed without confusion or trademark abuse.
- Naturally clarify “full body massage,” “home service massage,” “near me/open now,” Thai, and ventosa intent on the existing most-relevant pages, but only after checking current Search Console queries.
- Consider one well-sourced aftercare FAQ answering bathing after massage and one comparison guide for genuinely offered modalities. The bathing query rose quickly but has low absolute interest, so it does not justify a content cluster by itself.
- Re-run Trends for Pampanga/Angeles City where possible and use the massage/spa category. National three-month data alone should not drive local page creation.
- Combine Trends with Search Console impressions, clicks, CTR, query-to-page mapping, and booking conversion data.

Google likewise recommends using Trends when a topic is relevant to the audience and warns against creating content merely because it is trending. Source: [Google Trends for content strategy](https://developers.google.com/search/docs/monitor-debug/trends-start).

## Repository audit

### Inventory and organization

- 77 files occupy approximately 41.25 MB.
- `_archived/` contains about 30.88 MB across 32 files.
- `new add therapist/` contains about 6.49 MB across four unintegrated PNG source images.
- Those two directories account for about 90.6% of repository size.
- `favicon.ico` and `horizontal-logo.png` have the same size and SHA-256 digest, which strongly suggests a PNG was duplicated with an `.ico` extension.
- Two large archived therapist images are byte-identical duplicates.
- Multiple hosting systems are represented: `.htaccess`, `_headers`, `_redirects`, and `vercel.json`. The live missing-page response appears to be Hostinger, so the actual deployment source and authoritative configuration must be documented.
- There is no package manifest, test runner, CI workflow, deploy script, repository README, or Git metadata.
- `style.css` contains repeated navigation/FAQ rules; source and minified assets have no reproducible build step.
- Existing plans reference guide files that are not present, including `gbp_optimization_guide.md`, `local_citations_checklist.md`, `review_management_templates.md`, and `search_console_monitoring_guide.md`.

### Safe target structure

No move should happen until the production source-of-truth is confirmed. When approved, use this logical layout and record each relocation in `archive/README.md`:

```text
stay-well-v2-main/
  public/                 # production allowlist only
    index.html
    service-page-folders/
    assets/
    robots.txt
    sitemap.xml
    .htaccess
  src/                    # human-editable CSS/JS/templates
  content/                # page copy and content references
  docs/
    audits/
    operations/
  data/
    google-trends/
  archive/                # preserved retired/unintegrated material
    source-images/
    retired-pages/
    legacy-config/
  scripts/                # repeatable validation/build checks
```

An immediate physical reorganization is not required for the technical fixes. First document which folder is uploaded to Hostinger and create a production allowlist. Archive moves can happen later in small, reversible batches; nothing needs to be deleted.

## Code critique: 20 criteria across 7 dimensions

| # | Dimension / criterion | Result | Evidence or required action |
|---:|---|---|---|
| 1 | Correctness—JavaScript syntax | Pass | Both source and minified files pass `node --check`. |
| 2 | Correctness—runtime behavior | Fail | Shared script crashes on pages without homepage slider controls. |
| 3 | Correctness—booking logic | Partial | Validation and WhatsApp encoding are sensible; no automated coverage and later script logic can be skipped. |
| 4 | Correctness—edge/assets | Fail | Hotel image 404; public template points to a placeholder canonical. |
| 5 | Security—hardcoded secrets | Pass, current tree | No private key/token pattern found; Google site-verification token is intended to be public. History cannot be checked. |
| 6 | Security—input/injection | Pass with limits | User values use `textContent` and `encodeURIComponent`; there is no server/database/auth layer. |
| 7 | Security—headers/exposure | Partial | `.htaccess` is stronger than the other configs, but CSP uses inline allowances and an internal hub is public. |
| 8 | Security—privacy | Fail | Personal booking details are transferred to WhatsApp without a visible notice or policy link. |
| 9 | Quality—dead/stale material | Fail | Public source template, broken fallback image, obsolete plans, and missing referenced documents. |
| 10 | Quality—error handling | Partial | Form errors exist, but component initialization lacks guards and accessible error state. |
| 11 | Quality—duplication/smell | Partial | Repeated CSS blocks and manually duplicated page shells increase drift. |
| 12 | Performance—hot path/CWV | Fail | Poor lab CLS; asynchronous full CSS causes a major reflow. |
| 13 | Performance—JavaScript/animation | Partial | TBT is 0 ms, but 69 non-composited animations and scroll writes are reported. Optimize only after CLS. |
| 14 | Performance—assets/caching | Partial | WebP assets and caching exist; missing dimensions/source PNGs and deployment ambiguity remain. |
| 15 | Consistency—source/minified files | Fail | No build command proves minified outputs match sources. |
| 16 | Consistency—naming/configuration | Fail | `_archived`, `archive`, `new add therapist`, and four hosting-config styles lack ownership rules. |
| 17 | Integration—imports/assets | Fail | One live image is missing and the shared bundle assumes homepage DOM. |
| 18 | Integration—tests/deploy | Fail | No tests, CI, production allowlist, Git checkpoint, or documented deploy verification. |
| 19 | Architecture—crawlable static design | Pass | Raw HTML, shallow paths, and limited client logic are appropriate and resilient for this site. |
| 20 | Architecture—boundaries/templates | Partial | Production, source, archive, data, and internal tooling are mixed; duplicated HTML has no controlled generation path. |

## Critique of the existing plans: 22 criteria across 10 dimensions

The existing documents contain useful ideas, but they cannot serve as proof of completion. Several “complete” statements conflict with live or repository evidence.

| # | Dimension / criterion | Result | Critique |
|---:|---|---|---|
| 1 | Completeness—requirements | Partial | Broad SEO/accessibility coverage, but not the current review error, privacy gap, public moved hub, template, or broken image. |
| 2 | Completeness—edge cases | Fail | Missing-DOM initialization, missing assets, and host-specific exclusions were not covered. |
| 3 | Completeness—deliverables | Fail | Several claimed guide files do not exist. |
| 4 | Correctness—repository facts | Fail | Git branch/status work is marked done even though there is no `.git` directory. |
| 5 | Correctness—live facts | Fail | Schema removal, low CLS, no console errors, and no broken assets are marked complete but are false on the audited site. |
| 6 | Correctness—external guidance | Partial | Many practices are sound; `llms.txt` is overstated and self-review eligibility is mishandled. |
| 7 | Testability—specific tests | Partial | Some test names/checklists exist, but exact commands, URLs, expected results, and artifacts are inconsistent. |
| 8 | Testability—E2E coverage | Fail | No all-page console/asset test or booking regression suite exists. |
| 9 | Testability—evidence | Fail | Checkboxes substitute for stored PSI, Rich Results, header, or crawl evidence; some adjacent baseline items contradict each other. |
| 10 | Security—secret/input design | Partial | XSS and headers were considered, but history scanning is impossible and internal pages remain public. |
| 11 | Security—privacy/abuse | Partial | Policy language is discussed, but booking-data disclosure and operational retention are not implemented/verified. |
| 12 | Consistency—status semantics | Fail | “Guide prepared,” “implemented,” and “verified live” are treated as equivalent. |
| 13 | Consistency—naming/patterns | Fail | Multiple overlapping TODOs and hosting configs have no owner or canonical status. |
| 14 | Simplicity—scope control | Partial | Good minimal-change intent, but duplicate mega-checklists obscure the few material defects. |
| 15 | Simplicity—avoid reinvention | Partial | Manual page duplication and output files are planned without a small reproducible checker/build path. |
| 16 | Dependencies—ordering | Fail | Plans declare optimization complete before establishing source-of-truth, Git checkpoint, baseline, and deploy host. |
| 17 | Dependencies—availability | Fail | Assumed analytics, Search Console evidence, guides, and Git state are absent. |
| 18 | Resilience—rollback | Partial | Risk is mentioned, but there is no actual versioned release or tested restoration point. |
| 19 | Resilience—performance monitoring | Partial | Targets exist; repeat-run variance, field-data absence, and post-release observation rules are not handled. |
| 20 | Integration—paths/build/deploy | Fail | Missing files, live 404, subpage crash, and source/minified drift show integration was not verified. |
| 21 | Architecture—boundaries | Fail | Production files, internal tools, data, source assets, and documentation share the deployable tree. |
| 22 | Architecture—shortcuts | Partial | Moving a private page into `_archived` was treated as access control; filenames are not security boundaries. |

## Minimal-change implementation plan

### Release gate 0 — Establish a reversible baseline (before code changes)

- Confirm the authoritative production host, document root, upload method, DNS/CDN path, and which config file is active.
- Create a private backup of the exact current production files.
- Initialize version control or place the repository under an existing private Git remote; make an untouched baseline commit. Do not publish source photos or internal data to a public remote.
- Export Search Console Performance (last 3 and 6 months), Page Indexing, Enhancements, and Links reports.
- Export/record GBP categories, services, hours, service area, website/appointment URLs, review count/rating, and Insights.
- Record three PSI runs per device, Rich Results output, a 10-URL console crawl, and current booking completions/clicks if analytics exists.

**Exit:** A rollback copy exists, the deploy source is known, and baseline evidence is stored under `docs/audits/evidence/`.

### Release 1 — Correct validity and runtime defects (one small release)

- Remove only homepage JSON-LD `aggregateRating`.
- Guard homepage-only JavaScript controls; rebuild the minified file from source.
- Repair `therapist-arrival.png` without changing the hotel-page URL.
- Exclude internal/source/archive/data/doc files using the actual Hostinger deployment path; keep them locally.
- Prevent indexing of `subpage-template.html` until it is excluded from deployment.

**Tests:** JSON parses; Rich Results Test has no review item; all 10 pages return 200; no internal image/script/style 4xx; zero uncaught console exceptions; desktop/mobile booking completes to the pre-WhatsApp confirmation step.

**Rollback trigger:** Booking regression, missing public asset, new 5xx/4xx on a sitemap URL, or materially changed rendered content.

### Release 2 — Fix CLS only (separate release)

- Load the existing minified full stylesheet synchronously on the homepage.
- Remove the asynchronous duplicate full-stylesheet handoff.
- Re-test before changing font strategy, animation, or layout.
- If needed, reserve explicit media dimensions and then tune font loading in a second micro-release.

**Tests:** Median of three clean PSI runs per device; screenshot comparison at 360, 390, 768, 1024, and 1440 px; booking and navigation smoke test.

**Target:** Lab CLS ≤0.10, no new LCP/TBT regression, and no visible design change. Use field CWV when enough data becomes available.

### Release 3 — Accessibility and privacy semantics

- Remove the inappropriate `menubar` role and correct the exact list semantics.
- Repair heading hierarchy without rewriting headings for keywords.
- Use contrast-safe gold/dark combinations and add consistent `:focus-visible` styles.
- Add booking radiogroup/error relationships and keyboard focus management.
- Add a verified just-in-time privacy notice and privacy page link.

**Tests:** Lighthouse accessibility ≥95 as a guardrail, axe scan, keyboard-only completion, 200% zoom, focus order, and a screen-reader smoke test. Automated scores do not replace manual testing.

### Release 4 — Content quality and GEO (after technical stability)

- Remove literal Markdown from both articles and introduce accurate H2/H3 hierarchy.
- Review health claims against credible sources; add visible citations.
- Add real byline/reviewer details and truthful `dateModified` values.
- Add concise answer blocks and non-duplicative FAQs to the most relevant existing pages.
- Add Open Graph/Twitter metadata to subpages for sharing consistency.
- Add verified `sameAs`/`hasMap` only when official URLs are confirmed.
- Make only query-supported wording improvements from GSC + local Trends; do not create doorway pages.

**Tests:** HTML/schema validation, visible/schema parity, internal-link crawl, duplicate-content review, and editorial fact check.

### Days 30–90 — Local authority, measurement, and selective growth

- Reconcile NAP and entity facts across site, GBP, Facebook, directories, and citations.
- Complete GBP services, categories, attributes, photos, hours, appointment URL, and review response process.
- Earn relevant local links through real partnerships, hotels, tourism/travel resources, local organizations, and useful cited content; do not buy bulk links.
- Run a neutral local rank grid for priority queries and neighborhoods; separate organic results from Maps/local-pack visibility.
- Map Search Console queries to existing pages, identify cannibalization, and improve only pages with sufficient impressions and CTR opportunity.
- Publish at most one well-supported content improvement at a time and measure it.

## Measurement and rollback rules

Track weekly, comparing equivalent weekdays and noting seasonality, campaigns, outages, and GBP changes:

- Search Console clicks, impressions, CTR, average position, query-to-page mapping, indexed pages, and enhancements.
- GBP calls, messages, website clicks, direction/service-area signals, review velocity, review rating, and local rank-grid visibility.
- Booking start, validation success, WhatsApp handoff, and confirmed booking events. The current `trackEvent` implementation only logs locally unless a separate beacon exists, so real measurement must be installed and verified before claiming conversion data.
- Broken resources, console exceptions, PSI lab medians, and field CWV when available.

Release in batches of one to three related changes. If a release causes a clear technical regression, restore the previous version immediately. For ranking movements, do not panic-roll back on a one-day fluctuation; inspect indexing, crawl, seasonality, competitor/algorithm changes, and compare 7- and 28-day windows before deciding.

## Acceptance criteria

- Search Console reports no invalid review-snippet item from the homepage markup.
- All 10 sitemap URLs return 200 with the intended canonical and exactly one H1.
- No uncaught JavaScript exception occurs on any sitemap URL.
- No internal image, stylesheet, or script reference returns 4xx/5xx or HTML in place of the declared asset.
- `/_archived/`, `/archive/`, source templates, source photos, data exports, and project documents are absent from the production artifact.
- Median three-run lab CLS is ≤0.10 on mobile and desktop without a visual redesign.
- Accessibility testing confirms keyboard completion, visible focus, correct menu/list/heading semantics, readable contrast, and announced form errors.
- Visible business facts and JSON-LD agree.
- A production backup/version checkpoint and documented rollback procedure exist.
- Search and GBP baselines are recorded before content or entity changes.

## Final priority order

1. Baseline and rollback point.
2. Review JSON-LD correction.
3. Subpage JavaScript guard.
4. Broken hotel image.
5. Production allowlist / internal page exclusion.
6. Homepage CLS correction.
7. Accessibility and privacy semantics.
8. Article evidence and GEO clarity.
9. GBP/citation/link work informed by exports.
10. Repository reorganization in reversible archive batches.

This order protects current rankings by correcting invalid or broken behavior before touching successful search copy.
