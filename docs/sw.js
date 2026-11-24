'use strict';
// A new explicit version installs the whole game before replacing its cache.
const VERSION = '20261124-3';
const CACHE_PREFIX = 'doa-dongu-';
const CACHE_NAME = CACHE_PREFIX + VERSION;
const BASE = new URL('./', self.location.href);
const FILES = [
  './', 'index.html', 'engine.js', 'renderer.js', 'progress.js', 'app.js',
  'style.css', 'expansion.css', 'mobile.css', 'images.png', 'favicon.svg',
  'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png',
  'icons/icon-512.png', 'icons/icon-maskable-512.png'
];
const ASSET_URLS = new Set(FILES.map(file => new URL(file, BASE).href));

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(
    FILES.map(file => new Request(new URL(file, BASE), { cache: 'reload' }))
  )));
  // Do not replace the running game. The page may activate this update at a menu.
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data && event.data.type === 'GET_VERSION' && event.ports && event.ports[0]) event.ports[0].postMessage({ version: VERSION });
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== BASE.origin || !url.pathname.startsWith(BASE.pathname)) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(request);
        if (response.ok) {
          // Keep the canonical entry point available even when started with a query.
          await cache.put(new URL('index.html', BASE).href, response.clone());
          return response;
        }
        return (await cache.match(new URL('index.html', BASE).href)) || response;
      } catch (_) {
        const offline = await cache.match(new URL('index.html', BASE).href);
        return offline || new Response('İlk açılış için internet gerekiyor. Bağlanıp yeniden dene.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      }
    })());
    return;
  }

  url.search = ''; url.hash = '';
  if (!ASSET_URLS.has(url.href)) return;
  const requestedVersion = new URL(request.url).searchParams.get('v');
  if (requestedVersion && requestedVersion !== VERSION) {
    // A newer HTML shell must not receive scripts from an older worker's cache.
    event.respondWith(fetch(request));
    return;
  }
  // Local assets are immediately usable offline; successful responses refresh them.
  const refresh = (async () => {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(url.href, response.clone());
    }
    return response;
  })();
  event.waitUntil(refresh.catch(() => {}));
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    return (await cache.match(url.href)) || refresh;
  })());
});
