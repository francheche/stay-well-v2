import { existsSync, readFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const root = join(repositoryRoot, 'public');
const errors = [];
const warnings = [];
const businessId = 'https://staywellmassageph.com/#business';
const businessUrl = 'https://staywellmassageph.com/';
const serviceLandingPages = new Set([
    '/home-massage-angeles-city/',
    '/hotel-massage-angeles-city/',
    '/massage-clark/',
    '/deep-tissue-massage-angeles-city/',
    '/ventosa-angeles-city/',
    '/swedish-massage-angeles-city/',
    '/thai-massage-angeles-city/'
]);

function error(file, message) {
    errors.push(`${file}: ${message}`);
}

function warning(file, message) {
    warnings.push(`${file}: ${message}`);
}

for (const required of ['index.html', 'style.css', 'script.js', 'robots.txt', 'sitemap.xml', '.htaccess']) {
    if (!existsSync(join(root, required))) error('public/', `missing required runtime file ${required}`);
}

for (const privateDirectory of ['project', 'archive', '_archived']) {
    if (existsSync(join(root, privateDirectory))) {
        error('public/', `contains private repository directory ${privateDirectory}/`);
    }
}

try {
    const vercelConfig = JSON.parse(readFileSync(join(repositoryRoot, 'vercel.json'), 'utf8'));
    if (vercelConfig.outputDirectory !== 'public') {
        error('vercel.json', 'outputDirectory must be public');
    }
} catch (parseError) {
    error('vercel.json', `invalid configuration: ${parseError.message}`);
}

function pagePathFromUrl(urlString) {
    const pathname = new URL(urlString).pathname;
    if (pathname === '/') return join(root, 'index.html');
    return join(root, decodeURIComponent(pathname), 'index.html');
}

function normalizeUrl(urlString) {
    const url = new URL(urlString);
    url.hash = '';
    if (url.pathname !== '/' && !url.pathname.endsWith('/')) url.pathname += '/';
    return url.href;
}

function localTarget(pagePath, reference) {
    const clean = reference.split('#')[0].split('?')[0];
    if (!clean || clean.startsWith('#')) return null;
    if (/^(?:https?:|tel:|sms:|mailto:|data:|javascript:)/i.test(clean)) return null;

    const decoded = decodeURIComponent(clean);
    let target = decoded.startsWith('/')
        ? join(root, decoded.replace(/^\/+/, ''))
        : resolve(dirname(pagePath), decoded);

    if (decoded.endsWith('/')) target = join(target, 'index.html');
    if (!extname(target) && !existsSync(target)) target = join(target, 'index.html');
    return target;
}

function collectStructuredNodes(value, nodes = []) {
    if (Array.isArray(value)) {
        value.forEach(item => collectStructuredNodes(item, nodes));
        return nodes;
    }
    if (!value || typeof value !== 'object') return nodes;

    nodes.push(value);
    Object.values(value).forEach(item => collectStructuredNodes(item, nodes));
    return nodes;
}

function hasType(node, expectedType) {
    const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
    return types.includes(expectedType);
}

const sitemapPath = join(root, 'sitemap.xml');
const sitemap = readFileSync(sitemapPath, 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1].trim());

if (!urls.length) error('sitemap.xml', 'contains no URLs');
if (new Set(urls).size !== urls.length) error('sitemap.xml', 'contains duplicate URLs');

for (const url of urls) {
    const pagePath = pagePathFromUrl(url);
    const relative = pagePath.slice(root.length + 1);
    if (!existsSync(pagePath)) {
        error('sitemap.xml', `missing local page for ${url}`);
        continue;
    }

    const html = readFileSync(pagePath, 'utf8');
    const titleCount = (html.match(/<title>/gi) || []).length;
    const h1Count = (html.match(/<h1\b/gi) || []).length;
    const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1];
    const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
    const structuredNodes = [];

    if (titleCount !== 1) error(relative, `expected one title, found ${titleCount}`);
    if (h1Count !== 1) error(relative, `expected one H1, found ${h1Count}`);
    if (!description) error(relative, 'missing meta description');
    if (!canonical) error(relative, 'missing canonical');
    if (canonical && normalizeUrl(canonical) !== normalizeUrl(url)) {
        error(relative, `canonical ${canonical} does not match sitemap URL ${url}`);
    }
    if (!/property="og:title"/i.test(html)) error(relative, 'missing Open Graph title');
    if (!/name="twitter:card"/i.test(html)) error(relative, 'missing Twitter card');
    if (/role="menubar"/i.test(html)) error(relative, 'uses application menubar semantics for site navigation');
    if (/\*\*/.test(html)) error(relative, 'contains literal Markdown emphasis markers');
    if (/aggregateRating/i.test(html)) error(relative, 'contains self-serving aggregateRating markup');
    if (/(?:style|script)\.min\.(?:css|js)/i.test(html)) error(relative, 'references an unmanaged minified source file');

    const headings = [...html.matchAll(/<h([1-6])\b[^>]*>/gi)].map(match => Number(match[1]));
    for (let index = 1; index < headings.length; index += 1) {
        if (headings[index] > headings[index - 1] + 1) {
            error(relative, `heading order jumps from H${headings[index - 1]} to H${headings[index]}`);
        }
    }

    for (const match of html.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
        try {
            collectStructuredNodes(JSON.parse(match[1]), structuredNodes);
        } catch (parseError) {
            error(relative, `invalid JSON-LD: ${parseError.message}`);
        }
    }

    for (const node of structuredNodes) {
        if (hasType(node, 'MassageTherapist') && node['@id'] && node['@id'] !== businessId) {
            error(relative, `MassageTherapist must use the shared business ID ${businessId}`);
        }
        if (node['@id'] === businessId && node.url && normalizeUrl(node.url) !== businessUrl) {
            error(relative, `business entity URL must be ${businessUrl}`);
        }
    }

    const pathname = new URL(url).pathname;
    if (serviceLandingPages.has(pathname)) {
        const hasMatchingService = structuredNodes.some(node =>
            hasType(node, 'Service') && node.url && normalizeUrl(node.url) === normalizeUrl(url)
        );
        if (!hasMatchingService) error(relative, 'missing page-specific Service structured data');
    }

    if (pathname === '/' && !structuredNodes.some(node => hasType(node, 'WebSite'))) {
        error(relative, 'missing WebSite structured data for the preferred site name');
    }

    for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/gi)) {
        const target = localTarget(pagePath, match[1]);
        if (target && !existsSync(target)) {
            error(relative, `missing local reference ${match[1]}`);
        }
    }

    for (const match of html.matchAll(/url\(\s*(['"]?)([^'"\)]+)\1\s*\)/gi)) {
        const target = localTarget(pagePath, match[2].trim());
        if (target && !existsSync(target)) {
            error(relative, `missing inline CSS reference ${match[2].trim()}`);
        }
    }

    for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
        if (!/\balt="[^"]*"/i.test(match[0])) error(relative, `image missing alt: ${match[0].slice(0, 100)}`);
        if (!/\bwidth="\d+"/i.test(match[0]) || !/\bheight="\d+"/i.test(match[0])) {
            warning(relative, `image lacks explicit dimensions: ${match[0].slice(0, 100)}`);
        }
    }
}

const cssPath = join(root, 'style.css');
const css = readFileSync(cssPath, 'utf8');
for (const match of css.matchAll(/url\(\s*(['"]?)([^'"\)]+)\1\s*\)/gi)) {
    const target = localTarget(cssPath, match[2].trim());
    if (target && !existsSync(target)) {
        error('style.css', `missing CSS reference ${match[2].trim()}`);
    }
}

const forbiddenSitemapPaths = ['/public/', '/_archived/', '/archive/', '/project/', '/docs/', '/subpage-template.html', '/new%20add%20therapist/'];
for (const path of forbiddenSitemapPaths) {
    if (sitemap.includes(path)) error('sitemap.xml', `contains source-only path ${path}`);
}

if (warnings.length) {
    console.warn(`Warnings (${warnings.length}):`);
    warnings.forEach(item => console.warn(`- ${item}`));
}

if (errors.length) {
    console.error(`Validation failed (${errors.length}):`);
    errors.forEach(item => console.error(`- ${item}`));
    process.exitCode = 1;
} else {
    console.log(`Validation passed for ${urls.length} sitemap pages.`);
}
