self.addEventListener("push", e => {

  const notification = e.data.json();
  console.log(notification)
  self.registration.showNotification(notification.title, {
    body: notification.body,
    icon: notification.icon,
    data: {
      url: notification.link
    }
  });
});

self.addEventListener('notificationclick', function (event) {
  let url = 'https://cogoport.com';
  event.notification.close(); // Android needs explicit close.
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        // If so, just focus it.
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients && clients.openWindow) {
        console.log(clients, "clients")
        return clients.openWindow(url);
      }
    })
  );
});


