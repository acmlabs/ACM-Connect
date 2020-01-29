import AWS, { DynamoDB } from 'aws-sdk';
import bcrypt = require('bcrypt');
import chalk from 'chalk';
import express = require('express');
import jwt from 'jsonwebtoken';

import { keys } from '../config/keys';
import DynamoDbClient from '../config/modules/DynamoModule';
import DynamoDBProxyImpl from '../database/DynamoDbInterfaceImpl';
import DynamoDbInterface from '../database/proxy/DynamoDbInterface';

const SECRET: string = keys.JWT_SECRET;

const ERROR: number = -1;
const MISMATCH: number = 0;

const ddbClient: DynamoDbInterface = new DynamoDBProxyImpl(DynamoDbClient, keys.AWS_DYNAMODB_TABLE_NAME);

type accountType = 'student' | 'recruiter' | null

const attemptLogin = async (email: string, password: string): Promise<[number | string, accountType]> => {
    let accType: accountType = 'student'

    const studentLogin: AWS.DynamoDB.Types.QueryInput = {
        TableName: ddbClient.ddbTableName,
        KeyConditionExpression: "#resourceType = :type",
        ExpressionAttributeValues: {
            ":eaddress": { S: email },
            ":type": { S: "student" }
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

    let data: DynamoDB.AttributeMap[] | undefined = await ddbClient.query(studentLogin);

    if (!data || data.length === 0) {
        console.log(`Didn't find an student account for ${email}, looking for recruiters.`)
        const recruiterLogin: AWS.DynamoDB.Types.QueryInput = {
            TableName: ddbClient.ddbTableName,
            KeyConditionExpression: "#resourceType = :type",
            ExpressionAttributeValues: {
                ":eaddress": { S: email },
                ":type": { S: "recruiter" }
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
        accType = 'recruiter'
        data = await ddbClient.query(recruiterLogin)
    }

    if (!data) {
        return [ERROR, null];
    }

    const account: DynamoDB.AttributeMap = data[0];

    if (!account || !(account.hasOwnProperty('email') && account.hasOwnProperty('password') && account.hasOwnProperty('id'))) {
        console.log('No matching accounts');
        return [MISMATCH, null];
    }

    return [checkLogin(account, password), accType];
};

const checkLogin = (account: DynamoDB.AttributeMap, password: string): number | string => {
    const dbEmail: string | undefined = account['email'].S;
    const dbPasswordHash: string | undefined = account['password'].S;
    const uid: string | undefined = account['id'].S;

    if (dbEmail === undefined || dbPasswordHash === undefined || uid == undefined) {
        console.log(chalk.red(`Malformed search or document on ${dbEmail}`));
        return ERROR;
    }

    const passwordMatch: boolean = bcrypt.compareSync(password, dbPasswordHash);
    console.log(chalk.yellow(`Login with ${dbEmail} -> ${passwordMatch}`));

    return passwordMatch ? uid : MISMATCH;
}

const signIn = async (request: express.Request, response: express.Response) => {
    const body = request.body;

    let { email, password } = body;
    email = email.toLowerCase();

    const loginResult = await attemptLogin(email, password);

    const [userIdOrErrorMessage, accType]: [string | Number, accountType] = loginResult

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
        const payload = { email: email, uid: userId };
        const token = jwt.sign(payload, SECRET, {
            expiresIn: '1h'
        });

        console.log(accType)

        response.cookie('token', token, { httpOnly: true })
            .status(200)
            .json({
                email: email,
                token,
                type: accType
            });
    }
};


module.exports = signIn;