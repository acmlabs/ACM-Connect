import express = require("express");
import bcrypt = require("bcrypt");
import AWS from "aws-sdk";

import chalk from 'chalk';
import Handler from "../types/handler";
import {inject, injectable} from "inversify";
import DynamoDbInterface from "../database/proxy/DynamoDbInterface";
import {TYPES} from "../config/types";
import jwt from "jsonwebtoken";

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
                ":eaddress": {S: email},
                ":type": {S: "student"}
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


    handle = async (request: express.Request, response: express.Response) => {
        const body = request.body;

        const {email, password, token} = body;

        const passwordHash: string = bcrypt.hashSync(password, saltRounds);

        const isEmailAvailable: Number = await this.queryEmailMatches(email);

        if (isEmailAvailable === ERROR) {
            console.log(chalk.red('Error accessing DynamoDB instance.'));
            response.sendStatus(500);
        } else if (isEmailAvailable !== 0) {
            console.log(chalk.blue(`Not creating another account with email: ${email}`));
            response.sendStatus(403);
        } else {
            console.log(chalk.green(`Creating new account with email: ${email}`));

            const uid: string = uuid.v1();

            const params: AWS.DynamoDB.Types.PutItemInput = {
                TableName: "acm-connect",
                Item: {
                    id: {S: uid},
                    "resource-type": {S: "student"},
                    "email": {S: email},
                    "password": {S: passwordHash},
                    "token": {S: token},
                    "resume-url": {S: "/"}
                }
            };
            const result: boolean = await this.ddbClient.put(params);

            if (result) {
                const payload = {email: email, uid: uid};
                const token = jwt.sign(payload, SECRET, {
                    expiresIn: '1h'
                });
                response.json({email: email}).cookie('token', token, {httpOnly: true})
                    .sendStatus(200);
            } else {
                response.sendStatus(500);
            }
        }
    };

}


export default SignUpHandler;