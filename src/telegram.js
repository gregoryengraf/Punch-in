const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: false});

exports.sendPointMessage = function(message, imageUrl = null) {
    bot.sendMessage(process.env.BOT_CHAT_ID, message);
    if (imageUrl) {
        bot.sendPhoto(process.env.BOT_CHAT_ID, imageUrl);
    }
};
