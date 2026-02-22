const webpush = require("web-push");

// 🔐 VAPID (env এ রাখাই best)
webpush.setVapidDetails(
  "mailto:admin@site.com",
  process.env.VAPID_PUBLIC,
  process.env.VAPID_PRIVATE
);

// 🔔 Admin subscriptions (DB হলে ভালো)
const adminSubs = [];

exports.saveAdminSub = sub => {
  adminSubs.push(sub);
};

exports.notifyAdmins = async payload => {
  const msg = JSON.stringify(payload);

  for (const sub of adminSubs) {
    try {
      await webpush.sendNotification(sub, msg);
    } catch (err) {
      console.error("Push failed", err.statusCode);
    }
  }
};