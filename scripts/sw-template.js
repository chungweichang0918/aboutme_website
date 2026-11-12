const CACHE = 'cwchang-__BUILD__';
const publicFiles = ['/offline/', '/offline.css', '/icons/icon-192.png', '/icons/icon-512.png'];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(publicFiles)));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then(async (keys) => {
    await Promise.all(keys.filter((key) => key.startsWith('cwchang-') && key !== CACHE).map((key) => caches.delete(key)));
    await self.clients.claim();
  }));
});
self.addEventListener('message', (event) => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin ||
    !/^\/(?:$|(?:zh-tw|en|ja)(?:\/|$)|_astro\/|icons\/|offline[/.])/.test(url.pathname)) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(async () => (await caches.match('/offline/')) ?? Response.error()));
    return;
  }
  if (!url.pathname.startsWith('/_astro/') && !publicFiles.includes(url.pathname)) return;
  event.respondWith(caches.open(CACHE).then(async (cache) => {
    const cached = await cache.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok && response.type === 'basic' && !response.redirected && !response.headers.get('Cache-Control')?.includes('no-store')) {
      await cache.put(request, response.clone());
    }
    return response;
  }));
});
