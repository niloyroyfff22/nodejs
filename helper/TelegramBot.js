const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

module.exports = (app) => {
  const BOT_TOKEN = "8279159750:AAF8aHh3P2BdpvUu9P76o34wilwTcTSgzTs";
// ✅ User state রাখার জন্য
  const userState = {};
  // ✅ Webhook mode (polling বন্ধ)
  const bot = new TelegramBot(BOT_TOKEN, { polling: false });
  
  

  // ✅ Telegram Webhook route
  app.post('/telegram-webhook', (req, res) => {
    console.log("📩 Telegram webhook hit!");
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });

  // ✅ Command: /start
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `👋 হ্যালো ${msg.from.first_name}! Bot চলছে ✅`);
  });

  // ✅ Command: /backup
  bot.onText(/\/backup/, async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "📦 Backup শুরু হয়েছে...");

    // ফাইল তৈরি করে পাঠানো
    const filePath = path.join(__dirname, 'backup.txt');
    fs.writeFileSync(filePath, "Sample database backup data...");
    await bot.sendDocument(chatId, filePath);
    fs.unlinkSync(filePath);
  });
  
  // ✅ /number command → next step: ask for number
  bot.onText(/\/number/, (msg) => {
    const chatId = msg.chat.id;
    userState[chatId] = "WAITING_FOR_NUMBER"; // State save
    bot.sendMessage(chatId, "📩 অনুগ্রহ করে আপনার মোবাইল নাম্বার লিখুন:");
  });

  // ✅ সাধারণ মেসেজ হ্যান্ডলার
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text.trim();
    bot.sendMessage(chatId, "<b>Choose an option:</b>", {
  parse_mode: 'HTML',
  reply_markup: {
    inline_keyboard: [
      [
        { text: '📥 Download Backup', callback_data: 'backup' },
        { text: '👥 User List', callback_data: 'users' }
      ],
      [
        { text: 'ℹ️ About', url: 'https://yourwebsite.com' }
      ]
    ]
  }
});

bot.sendMessage(chatId, `manu kala: ${text}`);
    // যদি user /number কমান্ডের পরে number পাঠায়
    if (userState[chatId] === "WAITING_FOR_NUMBER" && !text.startsWith("/")) {
      userState[chatId] = null; // state clear

      bot.sendMessage(chatId, `🔍 নম্বর যাচাই করা হচ্ছে: ${text}`);

      try {
        // 👉 এখানে API call করা যায় (উদাহরণস্বরূপ static data)
        const info = {
          country: "Bangladesh",
          carrier: "Grameenphone Ltd.",
          line_type: "mobile"
        };

        const reply = `
📱 **Number Info**
━━━━━━━━━━━━━━━
📞 নম্বর: ${text}
🌍 দেশ: ${info.country}
🏢 অপারেটর: ${info.carrier}
📶 টাইপ: ${info.line_type}
        `;

        bot.sendMessage(chatId, reply, { parse_mode: "Markdown" });
      } catch (err) {
        bot.sendMessage(chatId, "❌ তথ্য আনতে ব্যর্থ, আবার চেষ্টা করুন।");
        console.error(err);
      }
    }
  });

// 📌 নিচে দেখানোর জন্য command সেট করা
bot.setMyCommands([
  { command: '/start', description: 'Start the bot' },
  { command: '/help', description: 'Get help menu' },
  { command: '/backup', description: 'Download database backup' },
  { command: '/users', description: 'Show total users' },
  { command: '/about', description: 'About this bot' }
]);

  // ✅ Webhook সেট করা (HTTPS URL)
  const webhookURL = "https://ngag-bd.onrender.com/telegram-webhook";
  bot.setWebHook(webhookURL)
    .then(() => console.log("✅ Telegram Webhook set to:", webhookURL))
    .catch(err => console.error("❌ Webhook set failed:", err.message));

  return bot;
};