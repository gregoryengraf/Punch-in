const aws = require("aws-sdk");

const s3 = new aws.S3({
    endpoint: process.env.VULTR_ENDPOINT,
    accessKeyId: process.env.VULTR_ACCESS_KEY,
    secretAccessKey: process.env.VULTR_SECRET_KEY,
    region: process.env.VULTR_REGION
});

module.exports = Object.freeze({
    s3: s3
});
