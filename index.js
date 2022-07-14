const express = require("express");
require('dotenv').config({ path: __dirname+'.env' });
const pup = require("puppeteer");
const user = "gregory.engraf@informa.com";
const password = "ANAluiza12";

const checkPoint = async () => {
    const browser = await pup.launch({headless: false});
    const page = await browser.newPage();

    const context = browser.defaultBrowserContext();
    await context.overridePermissions("https://app2.pontomais.com.br/registrar-ponto", ['geolocation'])

    await page.setGeolocation({latitude:-25.495198, longitude:-49.2415078})
    await page.setViewport({ width: 1280, height: 650 })
    await page.goto("https://app2.pontomais.com.br");


    await page.waitForSelector('input[type=text]');
    await page.type('input[type=text]', user);
    await page.type('input[type=password]', password);

    await page.waitForTimeout(500);

    await Promise.all([
        page.waitForNavigation(),
        page.keyboard.press('Enter'),
    ])

    await page.waitForSelector('.btn-register');
    await page.waitForTimeout(2000);

    // await page.mouse.click(990, 578);
    await page.mouse.click(1009, 514);

    await page.waitForTimeout(500);
    await browser.close();
};

const app = express();

app.get('/', function (req, res) {
    res.send(`Hello ${JSON.stringify(process.env)}`)
});
app.listen(3000, () => console.log("Server is running"));
// Mouse: 990 x 578
