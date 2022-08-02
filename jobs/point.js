const { makePoint } = require("../src/point");
(async () => {
    const timeout = Math.floor(Math.random() * (15 - 1 + 1) + 1) * 60 * 1000;
    console.log(`Job chamou---> ${timeout}`);
    setTimeout(() => {
        makePoint();
    }, timeout);
})();
