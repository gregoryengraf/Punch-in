const pup      = require("puppeteer");
const aws      = require("aws-sdk");
const user     = process.env.PONTO_USER;
const password = process.env.PONTO_PASS;
const { sendPointMessage } = require("./telegram");

const s3 = new aws.S3({
    endpoint: process.env.VULTR_ENDPOINT,
    accessKeyId: process.env.VULTR_ACCESS_KEY,
    secretAccessKey: process.env.VULTR_SECRET_KEY,
    region: process.env.VULTR_REGION
});

let pointTries = 0;
exports.makePoint = async function() {
    point();
};

const point = async function() {
    console.log(`Tentativas: ${pointTries}`);
    if (pointTries > 3) {
        sendPointMessage(`Esquece, tentei por ${pointTries} vezes bater o ponto e não consegui...faça manualmente!`);
        pointTries = 0;
        return;
    }
    const browser = await pup.launch({headless: true});
    const page = await browser.newPage();

    console.log("Inicia");
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(`${process.env.PONTO_URL}/registrar-ponto`, ['geolocation'])

    await page.setGeolocation({latitude:-25.495198, longitude:-49.2415078})
    await page.setViewport({ width: 1280, height: 700 })
    await page.goto(process.env.PONTO_URL);

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
    await page.waitForTimeout(20000);

    console.log("Clica no ponto");
    // Coordenadas do botao de bater ponto
    await page.mouse.click(822, 598);

    // Coordenadas de teste
    // await page.mouse.click(1092, 479);

    await page.waitForTimeout(2000);

    // const pointSuccess = await page.evaluate(() => window.find('Ponto registrado com sucesso!'));

    console.log("Gera print do ponto");
    const screenshot1 = await page.screenshot();

    let pointSuccess = await page.evaluate(() => window.find('Ponto registrado com sucesso!'));
    console.log('pointSuccess ', pointSuccess);
    if (!pointSuccess) {
        // Tenta jogar o endereço na mao
        await page.mouse.click(1092, 479);

        // Seleciona o endereço pré cadastrado
        await page.mouse.click(878, 387);

        // Coordenadas do botao de bater ponto
        await page.mouse.click(822, 598);

        // Tenta jogar o endereço na mao
        pointSuccess = await page.evaluate(() => window.find('Ponto registrado com sucesso!'));
        if (!pointSuccess) {
            pointTries +=1;
            sendPointMessage(`${pointTries}..: Não consegui bater o ponto, estou tentando novamente...`, screenshot1);
            point();
            return;
        }
    }

    await page.waitForTimeout(500);
    console.log("Finaliza");

    const screenshot = await page.screenshot();
    uploadScreenshot(screenshot)
    await browser.close();
}

const uploadScreenshot = function(screenshot){
    console.log("Faz upload do print");
    const dateNow = new Date().getTime();
    const params = {Bucket: process.env.VULTR_BUCKET, Key: `${process.env.ENVIROMENT_NAME}_${dateNow}_ponto.png`, ACL: 'public-read', Body: screenshot};
    s3.upload(params, (err, data) => {
        console.log("Notificar ação no telegram");
        sendPointMessage("Processo finalizado!", data.Location);
    });
};
