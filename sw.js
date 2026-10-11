// Cache hors ligne. Incrémenter CACHE à chaque mise à jour du contenu pour forcer le rafraîchissement.
const CACHE = 'edge-v2';
const FICHIERS = [
  './', 'index.html', 'styles.css', 'app.js', 'manifest.webmanifest',
  'data/lecons.js', 'data/fiches.js', 'data/cartes.js', 'data/quiz.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(cles => Promise.all(cles.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Réseau d'abord pour avoir le contenu frais, cache si hors ligne. Le script Google n'est jamais mis en cache.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req)
      .then(rep => {
        const copie = rep.clone();
        caches.open(CACHE).then(c => c.put(req, copie));
        return rep;
      })
      .catch(() => caches.match(req).then(r => r || caches.match('index.html')))
  );
});
