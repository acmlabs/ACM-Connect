import express = require("express");

import bcrypt = require("bcrypt");
import DynamoDBProxyImpl from '../database/DynamoDbInterfaceImpl';
import DynamoDbClient from '../config/modules/DynamoModule';
import AWS, {DynamoDB} from "aws-sdk";

import chalk from 'chalk';

import jwt from 'jsonwebtoken';
import DynamoDbInterface from "../database/proxy/DynamoDbInterface";

const uuid = require('uuid');

const SECRET: string = process.env.SECRET!;

const saltRounds: number = 14;

const ERROR: Number = -1;
const MISMATCH: Number = 0;

const ddbClient: DynamoDbInterface = new DynamoDBProxyImpl(DynamoDbClient);

const attemptLogin = async (email: string, password: string) => {
    const params: AWS.DynamoDB.Types.QueryInput = {
        TableName: "acm-connect",
        KeyConditionExpression: "#resourceType = :type",
        ExpressionAttributeValues: {
            ":eaddress": {S: email},
            ":type": {S: "student"}
        },
        ExpressionAttributeNames: {
            "#resourceType": "resource-type",
            "#email": "email",
            "#password": "password",
            "#id": "id"
        },
        FilterExpression: "#email = :eaddress",
        ProjectionExpression: "#email, #password, #id"
    };

    const data: DynamoDB.AttributeMap[] | undefined = await ddbClient.query(params);

    if (!data) {
        return ERROR;
    } else {
        const account: DynamoDB.AttributeMap = data[0];

        if (!account ||
            !(account.hasOwnProperty('email') && account.hasOwnProperty('password') && account.hasOwnProperty('id'))) {
            console.log('No matching accounts');
            return MISMATCH;
        }


        const dbEmail: string | undefined = account['email'].S;
        const dbPasswordHash: string | undefined = account['password'].S;
        const uid: string | undefined = account['id'].S;

        if (dbEmail === undefined || dbPasswordHash === undefined || uid == undefined) {
            console.log(chalk.red(`Malformed search or document on ${dbEmail}`));
            return ERROR;
        }

        const passwordMatch: boolean = bcrypt.compareSync(password, dbPasswordHash);
        console.log(chalk.yellow(`Login with ${dbEmail}, pwd ${password} -> ${passwordMatch}`));

        return passwordMatch ? uid : MISMATCH;
    }
};

const signIn = async (request: express.Request, response: express.Response) => {
    const body = request.body;

    let {email, password} = body;
    email = email.toLowerCase();

    const userIdOrErrorMessage: string | Number = await attemptLogin(email, password);

    console.log(userIdOrErrorMessage + ` ${userIdOrErrorMessage instanceof Number}`);

    if (typeof (userIdOrErrorMessage) === "number") {
        const errorCode: Number = <Number>userIdOrErrorMessage;
        if (errorCode === ERROR) {
            console.log(chalk.red('Error accessing DynamoDB instance.'));
            response.status(500)
                .json({
                    error: 'Internal database error. Please try again later.'
                });
        } else if (errorCode === MISMATCH) {
            // Invalid login
            console.log(chalk.blue(`Incorrect email / password ${email}`));
            response.status(401)
                .json({
                    error: 'Incorrect email and/or password.'
                });
        }
    } else { // isEmailAvailable instanceof string
        const userId: string = <string>userIdOrErrorMessage;
        // Valid login
        console.log(chalk.green(`Successful login: ${email}`));
        const payload = {email: email, uid: userId};
        const token = jwt.sign(payload, SECRET, {
            expiresIn: '1h'
        });
        response.cookie('token', token, {httpOnly: true})
            .status(200)
            .json({email: email});
    }
};


module.exports = signIn;