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
            cron: '30 08 ? * 1,2,3,4,5,6',
            cronValidate: {
                override: {
                  useBlankDay: true
                }
            }
        },
        {
            name: 'point 2',
            cron: '58 17 ? * 1,2,3,4,5,6',
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

const app = express();
app.get('/', function (req, res) {
    res.send(`Olá ${process.env.NAME} hoje é ${new Date().toString()}`);
});

app.listen(3000, () => console.log("Server is running on: localhost:3000"));
