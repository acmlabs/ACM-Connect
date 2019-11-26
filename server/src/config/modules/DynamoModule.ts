import AWS = require('aws-sdk');

import { keys } from '../keys';

console.log(keys)
console.log(`AccessKeyId ${keys.AWS_ACCESS_KEY}, SecretAccessKey ${keys.AWS_SECRET_KEY}.`)

AWS.config.update({
    region: "us-east-1",
    accessKeyId: keys.AWS_ACCESS_KEY!,
    secretAccessKey: keys.AWS_SECRET_KEY!,
});

const ddb: AWS.DynamoDB = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

export default ddb;
