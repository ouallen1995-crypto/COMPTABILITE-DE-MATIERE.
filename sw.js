// Service worker minimal pour Comptabilité de matière.
// Met en cache la coquille de l'application (le fichier HTML lui-même) pour un
// démarrage plus rapide. Attention : les bibliothèques externes (React, Babel,
// Tailwind, polices) sont chargées depuis des CDN et nécessitent une connexion
// internet au premier lancement puis restent en cache navigateur ensuite.

const CACHE_NAME = 'comptabilite-matiere-v1';
const APP_SHELL = ['./', './index.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        APP_SHELL.map((url) => cache.add(url).catch(() => {}))
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Stratégie "network first, cache fallback" pour la page principale,
  // afin de toujours avoir la dernière version quand internet est disponible.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('./index.html'))
    );
  }
});
