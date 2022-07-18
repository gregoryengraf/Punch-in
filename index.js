require("dotenv").config();
const express  = require("express");
const Bree     = require("bree");
const Graceful = require("@ladjs/graceful");
const Cabin    = require("cabin");
// cron: '30 08 ? * MON,TUE,WED,THU,FRI',

const bree = new Bree({
    logger: new Cabin(),
    jobs: [
        {
            name: 'point',
            cron: '30 08 ? * MON,TUE,WED,THU,FRI',
        },
        {
            name: 'point',
            cron: '40 17 ? * MON,TUE,WED,THU,FRI',
        }
    ]
})

const graceful = new Graceful({ brees: [bree] });
graceful.listen();

bree.start();

const app = express();
app.get('/', function (req, res) {
    res.send(`Olá ${process.env.NAME} hoje é ${new Date().toString()}`);
});

app.listen(3000, () => console.log("Server is running on: localhost:3000"));
