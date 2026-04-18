/* EduMakers Service Worker */
const VERSION = "v1";
const RUNTIME = `edumakers-runtime-${VERSION}`;
const PRECACHE = `edumakers-precache-${VERSION}`;
const PRECACHE_URLS = ["/", "/offline", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  const current = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => !current.includes(k)).map((k) => caches.delete(k)),
      ),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith("/api/")) return; // no caching for API

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/offline")),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((resp) => {
          if (!resp || resp.status !== 200 || resp.type !== "basic") return resp;
          const clone = resp.clone();
          caches.open(RUNTIME).then((cache) => cache.put(request, clone));
          return resp;
        })
        .catch(() => cached);
    }),
  );
});

/* Web Push */
self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title ?? "EduMakers", {
      body: data.body,
      icon: "/logo-icon.svg",
      badge: "/logo-icon.svg",
      data: { url: data.url ?? "/" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clis) => {
      const existing = clis.find((c) => "focus" in c);
      if (existing) return existing.focus().then(() => existing.navigate(url));
      return clients.openWindow(url);
    }),
  );
});
