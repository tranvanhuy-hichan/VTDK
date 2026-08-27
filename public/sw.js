// Service Worker for Dong Kha Admin Web Push Notifications & PWA

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle incoming Web Push notifications
self.addEventListener("push", (event) => {
  let data = {
    title: "🔔 Đơn Hàng Mới Tại Vật Tư Đông Kha!",
    body: "Bạn có đơn hàng mới vừa được đặt.",
    url: "/admin/orders",
    icon: "/images/logo.png",
    badge: "/images/logo.png",
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch {
      data.body = event.data.text() || data.body;
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || "/images/logo.png",
    badge: data.badge || "/images/logo.png",
    vibrate: [200, 100, 200],
    data: {
      url: data.url || "/admin/orders",
      dateOfArrival: Date.now(),
    },
    actions: [
      { action: "explore", title: "Xem đơn hàng" },
      { action: "close", title: "Đóng" },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Handle clicking on the notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/admin/orders";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there is already a window open with this URL
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url.includes("/admin/orders") && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});
