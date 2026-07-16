# Project Workspace

This folder keeps development and research material separate from the static website in `../public/`. Nothing under `project/` is required at runtime or should be uploaded to production.

## Structure

```text
project/
|-- docs/
|   |-- audits/          SEO, GEO, code, and repository findings
|   `-- operations/      deployment and rollback instructions
|-- references/          auditing frameworks and supporting guides
|-- legacy/              unreferenced files retained for history
|-- research/
|   `-- google-trends/   exported search-trend data
|-- source-assets/
|   `-- therapist-originals/  untouched source photographs
|-- templates/           unpublished page templates
`-- tools/               repeatable validation scripts
```

## Public site boundary

`public/` is intentionally the production document root. Hosting must map its contents to the domain root so that `public/index.html` is served as `/` and `public/ko/index.html` is served as `/ko/`. The word `public` must never appear in a live URL.

## Common commands

Run from the repository root:

```powershell
node project/tools/validate-site.mjs
node --check public/script.js
```

## Adding files

- Put audits and implementation notes in `docs/`.
- Put keyword exports and market research in `research/`.
- Put unoptimized source media in `source-assets/`.
- Put unpublished HTML patterns in `templates/`.
- Put non-runtime scripts in `tools/`.
- Put superseded, unreferenced files that must be retained in `legacy/`.
- Keep only files used by public pages at the repository root.
