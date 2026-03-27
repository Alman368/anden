const CACHE_NAME = "carnet-uma-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./vendor/qrcode.min.js",
  "./assets/fonts/OpenSans-Regular.ttf",
  "./assets/fonts/OpenSans-SemiBold.ttf",
  "./assets/fonts/OpenSans-Bold.ttf",
  "./assets/images/UMA_logo_marca.png",
  "./assets/images/euro_student.png",
  "./assets/images/fondo-carnet-vertical-blue.png",
  "./assets/images/fondo-carnet-vertical.png",
  "./assets/images/foto_desconocida.png",
  "./assets/images/photo-placeholder.svg",
  "./assets/images/student-portrait.svg",
  "./assets/pwa/apple-touch-icon.png",
  "./assets/pwa/favicon-32.png",
  "./assets/pwa/icon-192.png",
  "./assets/pwa/icon-512.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(APP_SHELL);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) {
          return key !== CACHE_NAME;
        }).map(function (key) {
          return caches.delete(key);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  var request = event.request;

  if (request.method !== "GET") {
    return;
  }

  var url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).then(function (networkResponse) {
        if (networkResponse && networkResponse.status === 200) {
          var responseClone = networkResponse.clone();
          event.waitUntil(
            caches.open(CACHE_NAME).then(function (cache) {
              return cache.put("./index.html", responseClone);
            })
          );
        }
        return networkResponse;
      }).catch(function () {
        return caches.match("./index.html");
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(function (cachedResponse) {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then(function (networkResponse) {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
          return networkResponse;
        }
        var responseClone = networkResponse.clone();
        event.waitUntil(
          caches.open(CACHE_NAME).then(function (cache) {
            return cache.put(request, responseClone);
          })
        );
        return networkResponse;
      });
    })
  );
});
