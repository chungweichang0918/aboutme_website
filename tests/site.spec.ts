import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = ['', 'about','projects','research','awards','skills','experience','blog','resume','contact','certifications','timeline','now'];

for (const lang of ['zh-tw','en','ja']) {
  test('public routes and metadata for ' + lang, async ({ page, request }) => {
    const codes = await Promise.all(pages.map(async (section) => {
      const path = '/' + lang + '/' + (section ? section + '/' : '');
      const response = await request.get(path);
      const body = await response.text();
      expect(body).toContain('rel="canonical" href="https://cwchang.me' + path + '"');
      return response.status();
    }));
    expect(codes).toEqual(pages.map(() => 200));
    await page.goto('/' + lang + '/');
    await expect(page.locator('html')).toHaveAttribute('lang',lang === 'zh-tw' ? 'zh-TW' : lang);
  });
}

test('language switch and persisted appearance work with keyboard navigation', async ({ page }) => {
  await page.goto('/en/projects/');
  const languages = page.getByLabel('Language', { exact:true });
  await languages.focus();
  await page.keyboard.press('Enter');
  await page.locator('header').getByRole('link',{name:'日本語'}).click();
  await expect(page).toHaveURL(/\/ja\/projects\/$/);
  expect(await page.evaluate(() => localStorage.getItem('language'))).toBe('ja');
  await page.locator('summary[aria-label="外観"]').click();
  await page.locator('#theme-control').selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await page.locator('summary[aria-label="外観"]').click();
  await expect(page.locator('[data-sound-control]')).not.toBeChecked();
  await page.locator('#theme-control').selectOption('light');
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
});

test('small screens have no horizontal overflow and have working navigation', async ({ page }) => {
  for (const width of [320,390,768,1440]) {
    await page.setViewportSize({width,height:850});
    await page.goto('/zh-tw/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
  await page.setViewportSize({width:320,height:720});
  await page.locator('.mobile-nav summary').click();
  await page.locator('.mobile-nav').getByRole('link',{name:'工程作品'}).click();
  await expect(page).toHaveURL(/\/zh-tw\/projects\/$/);
  await expect(page.getByRole('heading',{level:1})).toHaveText('工程作品');
});

test('Pagefind searches within the current language', async ({ page }) => {
  for (const [locale, query] of [['zh-tw','工程'],['ja','研究'],['en','engineering']]) {
    await page.goto('/' + locale + '/search/');
    await page.getByRole('searchbox').fill(query);
    await expect(page.locator('[data-search-results] a').first()).toBeVisible({ timeout:15000 });
    for (const link of await page.locator('[data-search-results] a').all()) await expect(link).toHaveAttribute('href',new RegExp('^/' + locale + '/'));
  }
  await page.getByRole('searchbox').fill('"zzzzqqxxww"');
  await expect(page.getByRole('status')).toHaveText('No matching results.');
});

test('static distribution exposes a real 404, manifest and disabled-by-default services', async ({ page, request }) => {
  expect((await page.goto('/nonexistent-test-route/'))?.status()).toBe(404);
  const manifest = await (await request.get('/manifest.webmanifest')).json();
  expect(manifest.icons.map((icon: {sizes:string}) => icon.sizes)).toEqual(['192x192','512x512']);
  await page.goto('/en/contact/');
  await expect(page.getByRole('status')).toContainText('currently unavailable');
  await page.goto('/admin/');
  await expect(page.getByRole('status')).toContainText('GitHub 登入尚未啟用');
});

test('representative pages pass automated accessibility checks', async ({ page }) => {
  for (const path of ['/zh-tw/', '/en/contact/', '/ja/research/']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
    expect(results.violations.map(({ id, nodes }) => ({ id, nodes: nodes.map((node) => node.target) })), path).toEqual([]);
  }
});

test('the main content is available with reduced motion and without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled:false, reducedMotion:'reduce' });
  try {
    const page = await context.newPage();
    await page.goto(new URL('/zh-tw/', process.env.TEST_BASE_URL || 'http://127.0.0.1:4321').href);
    await expect(page.getByRole('heading', {level:1})).toContainText('Wayne Chang');
    await expect(page.getByRole('link', {name:'探索工程作品'})).toBeVisible();
  } finally { await context.close(); }
});

test('PWA serves its offline page without caching admin or API requests', async ({ page, context }) => {
  await page.goto('/zh-tw/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBeTruthy();
  const cachePaths = await page.evaluate(async () => (await Promise.all((await caches.keys()).map(async (name) =>
    (await (await caches.open(name)).keys()).map((request) => new URL(request.url).pathname),
  ))).flat());
  expect(cachePaths).toContain('/offline/');
  expect(cachePaths.some((path) => /^\/(?:admin|api)\//.test(path))).toBeFalsy();
  await context.setOffline(true);
  await page.goto('/en/about/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('目前離線');
});
