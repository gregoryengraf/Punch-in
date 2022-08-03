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
            cron: '30 08 ? * 1,2,3,4,5,6',
            cronValidate: {
                override: {
                  useBlankDay: true
                }
            }
        },
        {
            name: 'point 2',
            cron: '35 17 ? * 1,2,3,4,5,6',
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
    if (msg.text.toString().toLowerCase().indexOf("ponto") === 0) {
        bot.sendMessage(msg.chat.id,"Ok, vou bater o seu ponto agora!");
        makePoint();
    }
    if (msg.text.toString().toLowerCase().indexOf("dev") === 0) {
        bot.sendMessage(msg.chat.id,"Ok, estamos em DEV hein!");
    }
});

const app = express();

app.get('/', function (req, res) {
    res.send(`Olá ${process.env.NAME} hoje é ${new Date().toString()}`);
});

app.get('/list-files', function(req, res) {
    // s3.deleteObject({Bucket: process.env.VULTR_BUCKET}, function(err, data) {
    //     console.log("dados: ", data);
    // });
    res.json({msg: 'Teste files'}).status(200);
});

app.listen(3000, () => console.log(`Server "${process.env.ENVIROMENT_NAME}" is running on: localhost:3000`));
