require('dotenv')
import AWS from 'aws-sdk';
import { inject, injectable } from "inversify";
import DynamoDbInterface from '../../database/proxy/DynamoDbInterface';
import { TYPES } from "../../config/types";

import chalk from 'chalk'
import { keys } from "../../config/keys";

const uuid = require('uuid');

export interface Payload {
    token: string,
    success: boolean
};

@injectable()
class KeyGen {
    private readonly ddb: DynamoDbInterface;

    constructor(@inject(TYPES.DDBProxy) ddbProxy: DynamoDbInterface) {
        this.ddb = ddbProxy;
    }

    generateKey = async () => {
        const tokenValue: string = uuid.v4();

        const keySchema: AWS.DynamoDB.Types.PutItemInput = {
            TableName: keys.AWS_DYNAMODB_TABLE_NAME,
            Item: {
                id: { S: tokenValue },
                "resource-type": { S: "token" },
                "token": { S: tokenValue },
                "dateCreated": { S: Date.now().toLocaleString() },
                "dateUsed": { S: "/" },
                "consumed": { BOOL: false }
            }
        };
        const result: boolean = await this.ddb.put(keySchema);


        if (result === true) {
            const payload: Payload = {
                success: true,
                token: tokenValue
            };

            return payload
        } else {
            const payload: Payload = {
                success: true,
                token: ""
            };

            console.log(chalk.bgRed(`Something went wrong, unable to create token ${tokenValue}.`))
            return payload
        }
    }
}
export default KeyGen;