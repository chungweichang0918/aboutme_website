import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const host = 'https://cwchang.me';
const locales = ['zh-tw','en','ja'];
const pages = ['','about','projects','research','awards','skills','experience','blog','resume','contact','certifications','timeline','now'];
const read = (path) => readFile(join('dist', path), 'utf8');
const sitemap = await read('sitemap.xml');
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, path]) => path);
assert.equal(new Set(paths).size, paths.length, 'Duplicate sitemap URLs');
assert.match(await read('index.html'), /rel="canonical" href="https:\/\/cwchang.me\/zh-tw\/"/);
for (const locale of locales) {
  for (const page of pages) {
    const folder = [locale, page].filter(Boolean).join('/') + '/';
    assert(paths.includes(host + '/' + folder), 'Missing sitemap entry ' + folder);
  }
  assert.match(await read(locale + '/rss.xml'), /<rss /);
}
for (const href of paths) {
  const url = new URL(href);
  assert.equal(url.origin, host);
  assert(!/^\/(?:admin|api)\//.test(url.pathname));
  const html = await read(url.pathname.slice(1) + 'index.html');
  assert(html.includes('rel="canonical" href="' + href + '"'), 'Canonical mismatch for ' + href);
  assert(!/name="robots" content="noindex/.test(html), 'Unexpected sitemap entry ' + href);
  for (const [, target] of html.matchAll(/rel="alternate" hreflang="[^"]+" href="([^"]+)"/g)) {
    assert(paths.includes(target), 'Missing translation for ' + href);
  }
}
const config = await read('admin/config.yml');
assert(!config.includes('local_backend:'), 'Local CMS cannot ship in a production build');
assert.match(await read('admin/index.html'), /noindex, nofollow/);
assert.match(await read('404.html'), /noindex/);
assert.match(await read('robots.txt'), /Disallow: \/admin\//);
for (const asset of ['icons/icon-192.png','icons/icon-512.png','admin/assets/decap-cms.js','pagefind/pagefind.js','sw.js']) {
  assert((await stat(join('dist', asset))).size > 0);
}
const settings = JSON.parse(await readFile('src/content/settings.json', 'utf8'));
for (const path of [settings.photo, settings.shareImage, ...Object.values(settings.resumes ?? {})].filter(Boolean)) {
  const file = await stat(join('dist', path.slice(1)));
  assert(file.isFile() && file.size > 0, 'Missing configured asset ' + path);
  if (Object.values(settings.resumes ?? {}).includes(path)) {
    assert(path.toLowerCase().endsWith('.pdf'), 'Résumé must be a PDF: ' + path);
    assert((await readFile(join('dist', path.slice(1)))).subarray(0, 5).equals(Buffer.from('%PDF-')), 'Invalid PDF: ' + path);
  }
}
console.log('Verified ' + paths.length + ' canonical URLs, localized RSS, admin, offline, and search assets.');
