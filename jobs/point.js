const pup = require("puppeteer");
const aws = require("aws-sdk");
const user = process.env.PONTO_USER;
const password = process.env.PONTO_PASS;

const s3 = new aws.S3({
    endpoint: process.env.VULTR_ENDPOINT,
    accessKeyId: process.env.VULTR_ACCESS_KEY,
    secretAccessKey: process.env.VULTR_SECRET_KEY,
    region: process.env.VULTR_REGION
});

(async () => {
    const browser = await pup.launch({headless: true});
    const page = await browser.newPage();

    console.log("Inicia");
    const context = browser.defaultBrowserContext();
    await context.overridePermissions("https://app2.pontomais.com.br/registrar-ponto", ['geolocation'])

    await page.setGeolocation({latitude:-25.495198, longitude:-49.2415078})
    await page.setViewport({ width: 1280, height: 650 })
    await page.goto("https://app2.pontomais.com.br");

    await page.waitForSelector('input[type=text]');
    await page.type('input[type=text]', user);
    await page.type('input[type=password]', password);

    console.log("Preenche o login");
    await page.waitForTimeout(500);

    await Promise.all([
        page.waitForNavigation(),
        page.keyboard.press('Enter'),
    ])

    await page.waitForSelector('.btn-register');
    console.log("Espera o carregamento do endereço");
    await page.waitForTimeout(10000);

    console.log("Clica no ponto");
    // await page.mouse.click(1088, 543);
    await page.mouse.click(1092, 479);
    await page.waitForTimeout(2000);

    console.log("Gera print do ponto");
    const dateNow = new Date().getTime();
    const screenshot = await page.screenshot();
    const params = {Bucket: 'ponto', Key: `${dateNow}_ponto.png`, ACL: 'public-read', Body: screenshot};
    s3.upload(params, (err, data) => console.log(data.Location));

    await page.waitForTimeout(500);
    console.log("Finaliza");
    await browser.close();
})();
