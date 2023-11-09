self.addEventListener("push", e => {
  const notification = e.data.json();

  self.registration.showNotification(notification.title, {
    body: notification.body,
    icon: notification.icon
  });
});

self.addEventListener('notificationclick', function (e) {
  const notification = e.data.json();
  const data = JSON.parse(notification);
  e.waitUntil(
    clients.openWindow(data.link)
  );
});