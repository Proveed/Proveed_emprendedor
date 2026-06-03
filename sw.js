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
  // Solo cachear GET, no requests a Supabase
  if(e.request.method !== 'GET') return;
  if(e.request.url.includes('supabase.co')) return;
  if(e.request.url.includes('googleapis.com')) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});