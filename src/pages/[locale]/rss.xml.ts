import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { entries, entryPath, localized } from '../../lib/content';
import { locales, type Locale } from '../../lib/routes';
import { settings } from '../../lib/settings';

export const getStaticPaths = () => locales.map((locale) => ({ params: { locale } }));
export const GET: APIRoute = async ({ params, site }) => {
  const locale = params.locale as Locale;
  const posts = localized(await entries('posts'), locale);
  return rss({
    title: settings.siteName,
    description: settings.descriptions[locale],
    site: site!,
    items: posts.map((post) => ({
      title: post.data.title, description: post.data.summary, pubDate: new Date(post.data.date), link: entryPath(post),
      categories: [post.data.category, ...post.data.tags],
    })),
  });
};
