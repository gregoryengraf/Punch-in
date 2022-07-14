require("dotenv").config();
const express = require("express");
const Bree = require("bree");

// cron: '30 08 ? * MON,TUE,WED,THU,FRI',
// cronValidate: {
//     override: {
//         useBlankDay: true
//     }
// }
const bree = new Bree({
    jobs: [
        {
            name: 'point',
            cron: '*/1 * * * *',
        }
    ]
})

bree.start();

const app = express();
app.get('/', function (req, res) {
    res.send(`Olá ${process.env.NAME} hoje é ${new Date().toString()}`);
});
app.listen(3000, () => console.log("Server is running on: localhost:3000"));
// Mouse: 990 x 578
// checkPoint();
