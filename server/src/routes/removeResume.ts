import AWS from 'aws-sdk';
import express = require('express');
import { inject, injectable, named } from 'inversify';

import { TYPES } from '../config/types';
import DynamoDbInterface from '../database/proxy/DynamoDbInterface';
import { S3Interface } from '../s3/proxy/S3Interface';
import Handler from '../types/handler';

const uuid = require('uuid');

const saltRounds: number = 14;
const ERROR: number = -1;

@injectable()
class RemoveResumeHandler implements Handler {

    private readonly ddbProxy: DynamoDbInterface;
    private readonly s3Proxy: S3Interface;
    private readonly s3Bucket: string;

    constructor(@inject(TYPES.DDBProxy) ddbProxy: DynamoDbInterface,
        @inject(TYPES.S3Interface) s3Interface: S3Interface,
        @inject(TYPES.string) @named("S3Bucket") Bucket: string) {
        this.ddbProxy = ddbProxy;
        this.s3Proxy = s3Interface;
        this.s3Bucket = Bucket;
    }

    updateResumeLink = async (uid: string, s3Url: string) => {
        const params: AWS.DynamoDB.Types.UpdateItemInput = {
            TableName: this.ddbProxy.ddbTableName,
            Key: {
                "resource-type": { S: "student" },
                "id": { S: uid }
            },
            UpdateExpression: "set #resumeUrl = :url",
            ExpressionAttributeNames: {
                "#resumeUrl": "resume-url"
            },
            ExpressionAttributeValues: {
                ":url": { S: s3Url }
            }
        };

        return await this.ddbProxy.update(params);
    };

    queryId = async (email: string) => {
        const params: AWS.DynamoDB.Types.QueryInput = {
            TableName: this.ddbProxy.ddbTableName,
            KeyConditionExpression: "#resourceType = :type",
            ExpressionAttributeValues: {
                ":eaddress": { S: email },
                ":type": { S: "student" }
            },
            ExpressionAttributeNames: {
                "#resourceType": "resource-type",
                "#email": "email",
                "#resumeURL": "resume-url"
            },
            FilterExpression: "#email = :eaddress",
            ProjectionExpression: "#email, #resumeURL"
        };

        const data: AWS.DynamoDB.AttributeMap[] | undefined = await this.ddbProxy.query(params);

        if (data === undefined) return null;

        const profile: AWS.DynamoDB.AttributeMap = data[0];
        return (profile['resume-url'].S !== '/');
    };

    deleteFromS3 = async (s3Id: string) => {
        const deleteRequest: AWS.S3.DeleteObjectRequest = {
            Bucket: this.s3Bucket,
            Key: s3Id,
        };

        return await this.s3Proxy.delete(deleteRequest);
    };

    handle = async (request: express.Request, response: express.Response) => {
        const body = request.body;

        const uid: string = response.locals.uid!;
        const email: string = response.locals.email!;

        const isValidRecord: boolean | null = await this.queryId(email);

        console.log('Is valid in ddb: ' + isValidRecord);

        if (isValidRecord === null) {
            response.sendStatus(500);
        } else if (!isValidRecord) {
            response.sendStatus(401);
        }

        await this.updateResumeLink(uid, "/");

        const s3DeleteResult = await this.deleteFromS3(`${uid}.pdf`);

        console.log('delete ' + s3DeleteResult);

        response.sendStatus(200);
    };

}


export default RemoveResumeHandler;