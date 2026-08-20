/* =============================================================================
   Service worker — Quiz Minecraft 2026
   Objectif : le jeu doit se lancer instantanement et rester jouable hors ligne
   une fois installe sur le telephone. Strategie : cache d'abord pour les
   ressources du jeu, reseau ensuite, avec repli sur index.html pour toute
   navigation.
   Pense-bete : bumper CACHE a chaque mise en ligne pour forcer le rafraichissement.
   ============================================================================= */
var CACHE = 'mcq2026-v13';

/* chemins relatifs au scope : marche a la racine comme dans un sous-dossier
   GitHub Pages (ex. /QUIZ/) sans rien reconfigurer */
var ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/css/app.css',
  './assets/js/app.js',
  './assets/js/quiz-data.js',
  './assets/js/quiz-gameplay.js',
  './assets/js/quiz-defis.js',
  './assets/js/quiz-moteurs.js',
  './assets/js/quiz-flash.js',
  './assets/js/quiz-music.js',
  './assets/fonts/press-start-2p-latin.woff2',
  './assets/fonts/press-start-2p-latin-ext.woff2',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/maskable-192.png',
  './assets/icons/maskable-512.png',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/favicon-64.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      /* addAll echoue en bloc si un seul fichier manque : on tolere l'unite */
      return Promise.all(ASSETS.map(function (u) {
        return c.add(new Request(u, { cache: 'reload' })).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        return k === CACHE ? null : caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

/* Le code de l'appli (js, css, manifeste) passe par le reseau d'abord.
   Servi depuis le cache, il donnait des versions melangees : le nouveau HTML
   avec l'ancien JS, donc des boutons qui ne repondent plus. Le cache reste le
   filet de securite hors ligne, avec trois secondes de patience. */
var CODE = /\.(?:js|css)$|manifest\.webmanifest$/;

function reseauDabord(req) {
  return new Promise(function (resolve) {
    var rendu = false;
    function rendreCache() {
      caches.match(req).then(function (hit) {
        if (hit && !rendu) { rendu = true; resolve(hit); }
      });
    }
    var minuteur = setTimeout(rendreCache, 3000);
    fetch(req).then(function (res) {
      clearTimeout(minuteur);
      if (res && res.ok) {
        var copie = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copie); });
      }
      if (!rendu) { rendu = true; resolve(res); }
    }).catch(function () {
      clearTimeout(minuteur);
      caches.match(req).then(function (hit) {
        if (!rendu) { rendu = true; resolve(hit || Response.error()); }
      });
    });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  /* le code de l'appli : toujours la derniere version si le reseau repond */
  if (CODE.test(url.pathname)) { e.respondWith(reseauDabord(req)); return; }

  /* navigation : on sert la coquille du jeu, meme sans reseau */
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put('./index.html', copy); });
        return res;
      }).catch(function () {
        return caches.match('./index.html').then(function (hit) {
          return hit || caches.match('./');
        });
      })
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) {
        /* rafraichissement silencieux en arriere-plan */
        fetch(req).then(function (res) {
          if (res && res.ok) caches.open(CACHE).then(function (c) { c.put(req, res); });
        }).catch(function () {});
        return hit;
      }
      return fetch(req).then(function (res) {
        if (res && res.ok && res.type === 'basic') {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      });
    })
  );
});
