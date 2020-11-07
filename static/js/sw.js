const CACHE_NAME = "TODO-cache-v1";

const urlsToCache = [
  "/",
  "/static/css/index.css",
  "/static/js/main.js",
  "/static/js/local.js",
  "/static/site.webmanifest",
  "/static/images/favicon-32x32.png",
  "/static/images/favicon-16x16.png",
  "/static/images/android-chrome-192x192.png",
  "/static/images/android-chrome-512x512.png",
  "/static/images/apple-touch-icon.png",
  "/static/images/favicon.ico",
  "https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css",
  "https://code.jquery.com/jquery-3.5.1.slim.min.js",
  "https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js",
  "https://use.fontawesome.com/releases/v5.15.1/css/all.css",
  "https://kit.fontawesome.com/2ede387783.js",
];

self.addEventListener("install", function (event) {
  // debugger;
  console.log("service worker installing");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("push", (event) => {
  const title = "Yay! New Notification";
  const body = "We have received a push message";
  const icon = "/static/images/favicon-32x32.png";
  const tag = "simple-push-example-tag";
  try {
    event.waitUntil(
      self.registration.showNotification(title, {
        body: body,
        icon: icon,
        tag: tag,
      })
    );
  } catch (error) {
    return;
  }
});
