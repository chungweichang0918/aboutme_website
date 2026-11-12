import { copyFile, mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { stringify } from 'yaml';
import { cmsConfig } from './cms-config.mjs';
import { iconPng } from './icons.mjs';

const origin = process.env.CMS_PUBLIC_ORIGIN || 'https://cwchang.me';
if (new URL(origin).origin !== origin || !origin.startsWith('https://')) throw new Error('CMS_PUBLIC_ORIGIN must be an HTTPS origin.');
const local = process.argv.includes('--local-cms');
const source = 'node_modules/decap-cms/dist';
const vendor = 'public/admin/assets';
await Promise.all(['public/admin/assets','public/icons'].map((path) => mkdir(path, { recursive: true })));
const cmsFiles = (await readdir(source)).filter((name) => /(?:\.js|\.wasm|\.LICENSE\.txt)$/.test(name));
const previous = await readdir(vendor, { withFileTypes:true });
await Promise.all(previous.filter((file) => file.isFile() && !cmsFiles.includes(file.name)).map((file) => unlink(join(vendor,file.name))));
await Promise.all(cmsFiles.map((name) => copyFile(join(source,name), join(vendor,name))));
await writeFile('public/admin/config.yml', stringify(cmsConfig({ origin, local })));
await writeFile('public/admin/mode.js', 'window.localCms = ' + JSON.stringify(local) + ';\n');
for (const [name,width,height] of [['icon-192',192,192],['icon-512',512,512],['share',1200,630]]) {
  const path = 'public/icons/' + name + '.png';
  try { await readFile(path); }
  catch { await writeFile(path, iconPng(width,height)); }
}
