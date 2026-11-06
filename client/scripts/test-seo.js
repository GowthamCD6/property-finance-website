import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dist = path.resolve(__dirname, '../dist');

const routes = [
  { path: '/', file: 'index.html' },
  { path: '/services/home-loans', file: 'services/home-loans/index.html' },
  { path: '/services/loan-against-property', file: 'services/loan-against-property/index.html' },
  { path: '/services/purchase-loans', file: 'services/purchase-loans/index.html' },
  { path: '/services/vehicle-loans', file: 'services/vehicle-loans/index.html' },
  { path: '/about', file: 'about/index.html' },
  { path: '/how-it-works', file: 'how-it-works/index.html' },
  { path: '/calculator', file: 'calculator/index.html' },
  { path: '/faqs', file: 'faqs/index.html' },
  { path: '/contact', file: 'contact/index.html' },
  { path: '/privacy-policy', file: 'privacy-policy/index.html' },
  { path: '/terms-and-conditions', file: 'terms-and-conditions/index.html' }
];

console.log('=== AUDITING ALL 12 PRERENDERED HTML FILES ===\n');

let allPassed = true;

for (const r of routes) {
  const fullPath = path.join(dist, r.file);
  if (!fs.existsSync(fullPath)) {
    console.error(`[FAIL] Missing file: ${fullPath}`);
    allPassed = false;
    continue;
  }

  const html = fs.readFileSync(fullPath, 'utf8');

  // Title check
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : null;

  // Canonical check
  const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
  const canonical = canonicalMatch ? canonicalMatch[1] : null;

  // Description check
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
  const desc = descMatch ? descMatch[1] : null;

  // JSON-LD scripts
  const hasRouteSchema = html.includes('id="jsonld-route"');
  const hasBreadcrumbs = html.includes('id="jsonld-breadcrumbs"');

  // Validate Breadcrumbs uniqueness if present
  let breadcrumbUnique = true;
  if (hasBreadcrumbs) {
    const bcJsonMatch = html.match(/<script type="application\/ld\+json" id="jsonld-breadcrumbs">([\s\S]*?)<\/script>/i);
    if (bcJsonMatch) {
      try {
        const bc = JSON.parse(bcJsonMatch[1].trim());
        const urls = bc.itemListElement.map(i => i.item);
        const set = new Set(urls);
        if (urls.length !== set.size) {
          breadcrumbUnique = false;
        }
      } catch (err) {
        console.error(`JSON parse error in breadcrumbs of ${r.path}:`, err);
        breadcrumbUnique = false;
      }
    }
  }

  console.log(`Route: ${r.path}`);
  console.log(`  File:        dist/${r.file}`);
  console.log(`  Title:       ${title}`);
  console.log(`  Canonical:   ${canonical}`);
  console.log(`  Description: ${desc}`);
  console.log(`  RouteSchema: ${hasRouteSchema ? 'PRESENT' : 'NONE'}`);
  console.log(`  Breadcrumbs: ${hasBreadcrumbs ? (breadcrumbUnique ? 'VALID & UNIQUE' : 'DUPLICATE ERROR') : (r.path === '/' ? 'OMITTED ON ROOT (OK)' : 'MISSING')}`);
  console.log('');

  if (!title || !canonical || !desc || (hasBreadcrumbs && !breadcrumbUnique)) {
    allPassed = false;
  }
}

// Validate Organization Schema on root index.html
console.log('=== AUDITING ORGANIZATION & BUSINESS CONTACT DATA ===\n');
const rootHtml = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const orgMatch = rootHtml.match(/<script type="application\/ld\+json" id="jsonld-route">([\s\S]*?)<\/script>/i);
if (!orgMatch) {
  console.error('[FAIL] Missing #jsonld-route in dist/index.html');
  allPassed = false;
} else {
  try {
    const schemas = JSON.parse(orgMatch[1].trim());
    const org = Array.isArray(schemas) ? schemas.find(s => s['@type'] === 'FinancialService') : (schemas['@type'] === 'FinancialService' ? schemas : null);
    if (!org) {
      console.error('[FAIL] FinancialService Organization schema not found');
      allPassed = false;
    } else {
      console.log('✓ Business Name: ', org.name);
      console.log('✓ Telephones:   ', JSON.stringify(org.telephone));
      console.log('✓ Email:        ', org.email);
      console.log('✓ Address:      ', `${org.address.streetAddress}, ${org.address.addressLocality} - ${org.address.postalCode}`);
      console.log('✓ ContactPoints:', org.contactPoint?.length, 'contact point(s) configured');

      if (org.name !== 'Prime Associates Loans') {
        console.error('[FAIL] Expected name: Prime Associates Loans, got:', org.name);
        allPassed = false;
      }
      if (!JSON.stringify(org.telephone).includes('96555') || !JSON.stringify(org.telephone).includes('95144')) {
        console.error('[FAIL] Missing required official telephone numbers');
        allPassed = false;
      }
      if (org.email !== 'primeassociates2008@gmail.com') {
        console.error('[FAIL] Expected email primeassociates2008@gmail.com, got:', org.email);
        allPassed = false;
      }
      if (org.address.postalCode !== '641601') {
        console.error('[FAIL] Expected postalCode 641601, got:', org.address.postalCode);
        allPassed = false;
      }
    }
  } catch (err) {
    console.error('[FAIL] Error parsing root JSON-LD schema:', err);
    allPassed = false;
  }
}
console.log('');

if (allPassed) {
  console.log('>>> ALL 12 CANONICAL PAGES FULLY VERIFIED IN RAW HTML OUTPUT! <<<');
} else {
  console.error('>>> SOME CHECKS FAILED! <<<');
  process.exit(1);
}
