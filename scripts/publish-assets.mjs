import { copyFile, mkdir, readdir, readFile, realpath, stat } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';

// Only static files referenced by rendered public pages are published.
const dist = resolve('dist');
const roots = { media: resolve('src/content/media'), documents: resolve('src/content/documents') };
const files = await readdir(dist, { recursive: true });
const paths = new Set();
const host = 'https://cwchang.me';
for (const path of files.filter((name) => name.endsWith('.html') && !/^admin[\\/]/.test(name))) {
  const html = await readFile(join(dist,path), 'utf8');
  for (const [, quoted] of html.matchAll(/\b(?:src|href|poster|content)=["']([^"'<>]+)["']/g)) {
    if (!/^(?:https:\/\/cwchang\.me)?\/(?:media|documents)\//.test(quoted)) continue;
    const url = new URL(quoted, host);
    const [ , root, ...segments ] = url.pathname.split('/');
    if (url.origin !== host || !Object.hasOwn(roots, root) ||
      segments.some((part) => !/^[a-z0-9_-]+(?:\.[a-z0-9_-]+)*$/i.test(part)) ||
      !/\.(?:png|jpe?g|webp|avif|gif|pdf|pptx|csv|json|zip|mp4|webm)$/i.test(segments.at(-1) ?? '')) {
      throw new Error('Unsupported public asset: ' + quoted);
    }
    paths.add([root,...segments].join('/'));
  }
}
for (const path of paths) {
  const [root, ...parts] = path.split('/');
  const source = await realpath(join(roots[root], ...parts));
  const local = relative(roots[root], source);
  if (local.startsWith('..') || resolve(roots[root], local) !== source) throw new Error('Asset is outside its source directory: ' + path);
  const info = await stat(source);
  if (!info.isFile() || info.size === 0 || info.size > 25 * 1024 * 1024) throw new Error('Invalid asset size: ' + path);
  const target = join(dist, path);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(source, target);
}
console.log('Published ' + paths.size + ' referenced media and document assets.');
