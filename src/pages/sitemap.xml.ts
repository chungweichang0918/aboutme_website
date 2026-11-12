import type { APIRoute } from 'astro';
import { detailRoutes, entryPath } from '../lib/content';
import { detailSections, langCode, locales, pathFor, sections } from '../lib/routes';

export const GET: APIRoute = async ({ site }) => {
  const pageGroups = ['', ...sections.filter((page) => page !== 'search')].map((section) =>
    locales.map((locale) => ({ locale, path: pathFor(locale, section) })));
  const translated = (await Promise.all(detailSections.map(detailRoutes))).flat().filter((route) => route.translated);
  const groups = Map.groupBy(translated, ({section, entry}) => section + '/' + entry.data.contentId);
  const detailGroups = [...groups.values()].map((group) => group.map(({ locale, entry }) => ({ locale, path: entryPath(entry) })));
  const abs = (path: string) => new URL(path, site).href;
  const urls = [...pageGroups, ...detailGroups].flatMap((group) => {
    const links = group.map(({ locale, path }) => '<xhtml:link rel="alternate" hreflang="' + langCode[locale] + '" href="' + abs(path) + '" />').join('');
    return group.map(({ path }) => '<url><loc>' + abs(path) + '</loc>' + links + '</url>');
  });
  return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' + urls.join('\n') + '</urlset>',
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
