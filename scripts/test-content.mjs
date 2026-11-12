import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile, stat, unlink, writeFile } from 'node:fs/promises';

const testId = 'verification-only-fixture';
const fixtures = [];
const page = (directory, filename, overrides = {}, body = '## Verification section\n\nIsolated test content.') => {
  const fields = {
    contentId:testId, slug:testId, locale:'en', title:'Verification fixture', summary:'Isolated test record.',
    date:'2025-01-15', draft:false, visibility:'public', ...overrides,
  };
  fixtures.push(['src/content/' + directory + '/' + filename,
    '---\n' + Object.entries(fields).map(([key,value]) => key + ': ' + (key === 'date' ? value : JSON.stringify(value))).join('\n') + '\n---\n\n' + body + '\n']);
};
page('posts', testId + '.mdx', { category:'Verification' },
  '## Verification section\n\nVerify $x^2$ and a fenced code block.\n\n~~~ts\nconst fixture = 1;\n~~~\n\n[Attachment](/documents/' + testId + '.csv)');
page('posts', testId + '-draft.mdx', { contentId:testId + '-draft', slug:testId + '-draft', category:'Verification', draft:true });
page('posts', testId + '-private.mdx', { contentId:testId + '-private', slug:testId + '-private', category:'Verification', visibility:'private' },
  '[Private attachment](/documents/' + testId + '-private.csv)');
page('projects', testId + '.md', { category:'Embedded Systems', status:'completed', featured:true });
page('projects', testId + '-ja.md', { slug:testId + '-ja', locale:'ja', title:'検証用', category:'Embedded Systems', status:'completed' });
page('research', testId + '.md', { category:'Verification', status:'unpublished', authors:[] });
fixtures.push(['src/content/documents/' + testId + '.csv','a,b\n1,2\n']);
fixtures.push(['src/content/documents/' + testId + '-private.csv','c,d\n3,4\n']);

const created = [];
const build = () => {
  const result = spawnSync(process.execPath, [process.env.npm_execpath, 'run', 'build'], {
    encoding:'utf8', env:{ ...process.env, ASTRO_TELEMETRY_DISABLED:'1' }, maxBuffer:8 * 1024 * 1024,
  });
  if (result.status !== 0) throw new Error((result.stdout ?? '').slice(-11000) + (result.stderr ?? '') + (result.error ?? ''));
};
try {
  for (const [path, data] of fixtures) {
    await writeFile(path,data,{flag:'wx'});
    created.push(path);
  }
  build();
  const file = (path) => readFile('dist/' + path,'utf8');
  const blog = await file('en/blog/' + testId + '/index.html');
  assert.match(blog,/class="katex"/);
  assert.match(blog,/astro-code/);
  const fallback = await file('ja/blog/~en-' + testId + '/index.html');
  assert.match(fallback,/noindex, follow/);
  assert.match(fallback,/rel="canonical" href="https:\/\/cwchang.me\/en\/blog\//);
  assert.doesNotMatch(fallback,/hreflang="ja"/);
  const project = await file('en/projects/' + testId + '/index.html');
  assert(project.includes('hreflang="ja" href="https://cwchang.me/ja/projects/' + testId + '-ja/'));
  assert.match(await file('en/research/' + testId + '/index.html'),/CreativeWork/);
  assert.match(await file('en/rss.xml'), new RegExp(testId));
  assert.doesNotMatch(await file('sitemap.xml'), /verification-only-fixture-(?:draft|private)/);
  for (const path of ['en/blog/' + testId + '-draft', 'en/blog/' + testId + '-private', 'documents/' + testId + '-private.csv']) {
    await assert.rejects(stat('dist/' + path), {code:'ENOENT'});
  }
  assert.equal(await file('documents/' + testId + '.csv'), 'a,b\n1,2\n');
  console.log('Verified MDX/LaTeX, real detail routes, translation fallback, RSS, draft/private exclusion and approved attachments.');
} finally {
  for (const path of created) await unlink(path);
  if (created.length) build();
}
