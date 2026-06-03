const CACHE = 'proveed-v1';
const ASSETS = [
  '/',
  '/dashboard-emp.html',
  '/explorar.html',
  '/carrito.html',
  '/chat-emprendedor.html',
  '/perfil-emprendedor.html',
  '/login.html'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Ignorar peticiones externas (Supabase, Google Fonts, etc.)
  if(e.request.method !== 'GET') return;
  if(e.request.url.includes('supabase.co')) return;
  if(e.request.url.includes('googleapis.com')) return;

  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      // Si está en caché, lo devolvemos al instante
      const fetchPromise = fetch(e.request).then(networkResponse => {
        // Actualizamos el caché en segundo plano
        caches.open(CACHE).then(cache => {
          cache.put(e.request, networkResponse.clone());
        });
        return networkResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
