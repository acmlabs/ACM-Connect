import AWS = require('aws-sdk');

import { keys } from '../keys';

AWS.config.update({
    region: "us-east-1",
    accessKeyId: keys.AWS_ACCESS_KEY,
    secretAccessKey: keys.AWS_SECRET_KEY,
});

const s3Module: AWS.S3 = new AWS.S3({ apiVersion: "2012-08-10" });

export default s3Module;
