import { existsSync } from 'node:fs';

// scripts/cards.py writes a 640px WebP for every cover into /media/thumbs/, named after the cover file.
export function thumbFor(cover: string | undefined) {
  if (!cover?.startsWith('/media/')) return undefined;
  const name = cover.slice(cover.lastIndexOf('/') + 1).replace(/\.[^.]+$/, '');
  const thumb = '/media/thumbs/' + name + '.webp';
  return existsSync('src/content' + thumb) ? thumb : undefined;
}

// A smaller copy of a photo saved next to it as <name>-560.webp, when present.
export function smallPhoto(photo: string | undefined) {
  if (!photo?.startsWith('/media/')) return undefined;
  const small = photo.replace(/\.[^.]+$/, '') + '-560.webp';
  return existsSync('src/content' + small) ? small : undefined;
}
