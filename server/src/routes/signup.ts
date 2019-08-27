import express = require("express");
import bcrypt = require("bcrypt");
import AWS from "aws-sdk";

import chalk from 'chalk';
import Handler from "../types/handler";
import { inject, injectable } from "inversify";
import DynamoDbInterface from "../database/proxy/DynamoDbInterface";
import { TYPES } from "../config/types";
import jwt from "jsonwebtoken";
import { bool } from "aws-sdk/clients/signer";

const uuid = require('uuid');

const saltRounds: number = 14;
const ERROR: number = -1;

const SECRET: string = process.env.SECRET!;

@injectable()
class SignUpHandler implements Handler {

    private ddbClient: DynamoDbInterface;

    constructor(@inject(TYPES.DDBProxy) ddbProxy: DynamoDbInterface) {
        this.ddbClient = ddbProxy;
    }

    queryEmailMatches = async (email: string) => {
        const params: AWS.DynamoDB.Types.QueryInput = {
            TableName: "acm-connect",
            KeyConditionExpression: "#resourceType = :type",
            ExpressionAttributeValues: {
                ":eaddress": { S: email },
                ":type": { S: "student" }
            },
            ExpressionAttributeNames: {
                "#resourceType": "resource-type",
                "#email": "email"
            },
            FilterExpression: "#email = :eaddress",
            ProjectionExpression: "#email"
        };

        const data: AWS.DynamoDB.AttributeMap[] | undefined = await this.ddbClient.query(params);

        return data === undefined ? ERROR : data.length;
    };

    tokenValid = async (token: string) => {
        const tokenQuery: AWS.DynamoDB.Types.QueryInput =
        {
            TableName: "acm-connect",
            KeyConditionExpression: "#resourceType = :type AND #id = :id",
            ExpressionAttributeValues: {
                ":consumed": { BOOL: false },
                ":type": { S: "token" },
                ":id": { S: token }
            },
            ExpressionAttributeNames: {
                "#consumed": "consumed",
                "#resourceType": "resource-type",
                "#id": "id"
            },
            FilterExpression: "#consumed = :consumed",
        }

        const data: AWS.DynamoDB.AttributeMap[] | undefined = await this.ddbClient.query(tokenQuery);

        return data === undefined || data.length == 0 || data[0]['consumed'].BOOL == true ? false : true;
    }

    addUser = async (resourceType: string, email: string, passwordHash: string, uid: string, resumeUrl: string, token: string) => {
        const params: AWS.DynamoDB.Types.PutItemInput = {
            TableName: "acm-connect",
            Item: {
                id: { S: uid },
                "resource-type": { S: resourceType },
                "email": { S: email },
                "password": { S: passwordHash },
                "token": { S: token },
                "resume-url": { S: resumeUrl }
            }
        };
        const result: boolean = await this.ddbClient.put(params);

        return result;
    }

    consumeToken = async (token: string) => {
        const keyUpdate: AWS.DynamoDB.Types.UpdateItemInput = {
            TableName: "acm-connect",
            Key: {
                "resource-type": { S: "token" },
                "id": { S: token }
            },
            UpdateExpression: "set #consumed = :consumed, #dateUsed = :dateUsed",
            ExpressionAttributeNames: {
                "#consumed": "consumed",
                "#dateUsed": "dateUsed"
            },
            ExpressionAttributeValues: {
                ":consumed": { BOOL: true },
                ":dateUsed": { S: Date.now().toLocaleString() }
            }
        };

        const result = await this.ddbClient.update(keyUpdate);

        return result;
    }

    handle = async (request: express.Request, response: express.Response) => {
        const body = request.body;

        const email: string = body.email;
        const password: string = body.password;
        const token: string = body.token;

        const passwordHash: string = bcrypt.hashSync(password, saltRounds);

        const isEmailAvailable: Number = await this.queryEmailMatches(email);
        const tokenValidAndUnconsumed: Boolean = await this.tokenValid(token);

        if (!tokenValidAndUnconsumed) {
            console.log(chalk.blue(`Token ${token} either invalid or used.`))
            response.sendStatus(403)
        } else if (isEmailAvailable === ERROR) {
            console.log(chalk.red('Error accessing DynamoDB instance.'));
            response.sendStatus(500);
        } else if (isEmailAvailable !== 0) {
            console.log(chalk.blue(`Not creating another account with email: ${email}`));
            response.sendStatus(403);
        } else {
            console.log(chalk.green(`Creating new account with email: ${email}`));

            const uid: string = uuid.v1();

            const result: Boolean = await this.addUser("student", email, passwordHash, uid, '/', token);
            const consumeTokenResult: Boolean = await this.consumeToken(token);

            if (result && consumeTokenResult) {
                const payload = { email: email, uid: uid };
                const token = jwt.sign(payload, SECRET, {
                    expiresIn: '1h'
                });
                response.cookie('token', token, { httpOnly: true })
                    .status(200).json({ email: email });
            } else {
                response.sendStatus(500);
            }
        }
    };

}


export default SignUpHandler;