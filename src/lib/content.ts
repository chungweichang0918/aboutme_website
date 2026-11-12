import { getCollection, type CollectionKey, type CollectionEntry } from 'astro:content';
import { type Locale, type DetailSection, locales, pathFor } from './routes';

export const collectionNames = ['projects','research','awards','skills','experience','education','posts','certifications','timeline','now'] as const;
export const detailCollection = { projects: 'projects', research: 'research', blog: 'posts' } as const;
export type Entry = CollectionEntry<CollectionKey>;

export function publicEntry(entry: Entry) {
  return !entry.data.draft && entry.data.visibility === 'public';
}

export async function entries<C extends CollectionKey>(collection: C) {
  const all = await getCollection(collection);
  const slugs = new Set<string>();
  const ids = new Set<string>();
  for (const { data } of all) {
    const slug = data.locale + '/' + data.slug;
    const id = data.locale + '/' + data.contentId;
    if (slugs.has(slug)) throw new Error('Duplicate slug in ' + collection + ': ' + slug);
    if (ids.has(id)) throw new Error('Duplicate logical ID in ' + collection + ': ' + id);
    slugs.add(slug);
    ids.add(id);
  }
  return all.filter(publicEntry);
}

export function localized<T extends Entry>(items: T[], locale: Locale, includeOriginal = false) {
  const grouped = Map.groupBy(items, (entry) => entry.collection + '/' + entry.data.contentId);
  const result = [...grouped.values()].flatMap((group) => {
    const translation = group.find((entry) => entry.data.locale === locale);
    if (translation) return [translation];
    if (!includeOriginal) return [];
    const original = locales.flatMap((lang) => group.filter((entry) => entry.data.locale === lang))[0];
    return original ? [original] : [];
  });
  return result.sort((a, b) => b.data.date.localeCompare(a.data.date) || a.data.slug.localeCompare(b.data.slug));
}

export function entryPath(entry: Entry, locale = entry.data.locale) {
  const section = entry.collection === 'posts' ? 'blog' : entry.collection;
  const slug = locale === entry.data.locale ? entry.data.slug : '~' + entry.data.locale + '-' + entry.data.slug;
  return pathFor(locale, section + '/' + slug);
}

export async function detailRoutes(section: DetailSection) {
  const items = await entries(detailCollection[section]);
  return locales.flatMap((locale) => {
    return localized(items, locale, true).map((entry) => {
      const translated = entry.data.locale === locale;
      const slug = translated ? entry.data.slug : '~' + entry.data.locale + '-' + entry.data.slug;
      return { locale, section, slug, entry, translated };
    });
  });
}
