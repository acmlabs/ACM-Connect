import AWS = require("aws-sdk");

const uuid = require("uuid");

AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
});

const s3Module: AWS.S3 = new AWS.S3({apiVersion: "2012-08-10"});

export default s3Module;
