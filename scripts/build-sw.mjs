import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const template = await readFile('scripts/sw-template.js', 'utf8');
const hash = createHash('sha256').update(template);
const output = (await readdir('dist', { recursive:true, withFileTypes:true }))
  .filter((file) => file.isFile()).map((file) => relative('dist', join(file.parentPath, file.name)));
const cached = output.filter((name) => /^(?:_astro|icons)[\\/]|^offline\./.test(name) || (name.endsWith('.html') && !/^admin[\\/]/.test(name)));
for (const path of cached.sort()) hash.update(path.replaceAll('\\','/')).update(await readFile(join('dist',path)));
await writeFile('dist/sw.js', template.replace('__BUILD__', hash.digest('hex').slice(0,16)));
