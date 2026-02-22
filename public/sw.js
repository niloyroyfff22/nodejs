self.addEventListener("push", event => {
  const data = event.data?.json() || {};

  event.waitUntil(
    self.registration.showNotification(
      data.title || "New Notification",
      {
        body: data.body || "You have a new update",
        icon: "/icon.png"
      }
    )
  );
});