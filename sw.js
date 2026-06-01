const CACHE_NAME = 'licores-v1';
const ASSETS = [
  '/login.html',
  '/dashboard.html',
  '/catalogo.html',
  '/inventario.html',
  '/movimientos.html',
  '/reportes.html'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // addAll individual para que un fallo no rompa todo
      return Promise.allSettled(
        ASSETS.map(url => cache.add(url).catch(err => console.warn('No se pudo cachear:', url, err)))
      );
    })
  );
  self.skipWaiting(); // ← fuerza activación inmediata
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim()); // ← toma control inmediato
});

self.addEventListener('fetch', e => {
  // Solo intercepta GET, ignora el resto
  if (e.request.method !== 'GET') return;
  
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});