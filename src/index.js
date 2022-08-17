require("dotenv").config();
const express  = require("express");
const Bree     = require("bree");
const Graceful = require("@ladjs/graceful");
const Cabin    = require("cabin");
const TelegramBot = require("node-telegram-bot-api");
const { makePoint } = require("./point");
const { s3 } = require("./services");
const bree = new Bree({
    logger: new Cabin(),
    jobs: [
        {
            name: 'point',
            cron: '30 08 ? * 1,2,3,4,5',
            cronValidate: {
                override: {
                  useBlankDay: true
                }
            }
        },
        {
            name: 'point 2',
            cron: '35 17 ? * 1,2,3,4,5',
            path: './jobs/point.js',
            cronValidate: {
                override: {
                  useBlankDay: true
                }
            }
        }
    ]
})

const graceful = new Graceful({ brees: [bree] });
graceful.listen();

bree.start();

const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});

bot.on('message', (msg) => {
    const message = msg.text.toString().toLowerCase();
    if (message.indexOf("ponto") === 0) {
        bot.sendMessage(msg.chat.id,"Ok, vou bater o seu ponto agora!");
        makePoint();
    }
    if (message.indexOf("dev") === 0) {
        bot.sendMessage(msg.chat.id,"Ok, estamos em DEV hein!");
    }
    if (message.indexOf("ta vivo") === 0 || message.indexOf("tá vivo") === 0) {
        bot.sendMessage(msg.chat.id,`Fala ${msg.chat.first_name}, estou ligadão aqui, a data agora é: ${new Date().toString()}`);
    }
});

const app = express();

app.get('/', function (req, res) {
    res.send(`Olá ${process.env.NAME} hoje é ${new Date().toString()}`);
});

app.get('/list-files', function(req, res) {
    res.json({msg: 'Teste files'}).status(200);
});

app.listen(3000, () => console.log(`Server "${process.env.ENVIROMENT_NAME}" is running on: localhost:3000`));
