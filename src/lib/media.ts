import { existsSync } from 'node:fs';

// scripts/cards.py writes 640px and 960px WebP copies of every cover into /media/thumbs/, named after the cover file.
export function thumbsFor(cover: string | undefined) {
  if (!cover?.startsWith('/media/')) return undefined;
  const name = cover.slice(cover.lastIndexOf('/') + 1).replace(/\.[^.]+$/, '');
  const small = '/media/thumbs/' + name + '.webp';
  const large = '/media/thumbs/' + name + '-960.webp';
  if (!existsSync('src/content' + small) || !existsSync('src/content' + large)) return undefined;
  return { src: small, srcset: small + ' 640w, ' + large + ' 960w' };
}

// A smaller copy of a photo saved next to it as <name>-560.webp, when present.
export function smallPhoto(photo: string | undefined) {
  if (!photo?.startsWith('/media/')) return undefined;
  const small = photo.replace(/\.[^.]+$/, '') + '-560.webp';
  return existsSync('src/content' + small) ? small : undefined;
}
