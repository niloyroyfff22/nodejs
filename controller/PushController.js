const pushService = require("../helper/push");

exports.subscribe = (req, res) => {
  pushService.saveAdminSub(req.body);
  res.json({ ok: true });
};


exports.sendpush = async (req, res) => {
  //const { title } = req.body;

  // 🗄️ Save post (DB logic এখানে)
 // console.log("Post saved:", title);

  // 🔔 Notify admins
  pushService.notifyAdmins({
    title: "🆕 New Post",
    body: "Nikhil"
  });

  res.json({ ok: true, data: "sucess"});
};