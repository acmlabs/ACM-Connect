import multiparty from 'multiparty';
import express from 'express'
import { S3Interface } from "../s3/proxy/S3Interface";
import AWS from 'aws-sdk';

import Handler from '../types/handler'
import { inject, injectable, named } from "inversify";

import { TYPES } from '../config/types'
import DynamoDbInterface from "../database/proxy/DynamoDbInterface";

@injectable()
class UploadResumeHandler implements Handler {

    private s3Proxy: S3Interface;
    private ddbProxy: DynamoDbInterface;
    private readonly s3Bucket: string;

    constructor(@inject(TYPES.S3Interface) s3Proxy: S3Interface,
        @inject(TYPES.DDBProxy) ddbProxy: DynamoDbInterface,
        @inject(TYPES.string) @named("S3Bucket") s3Bucket: string) {
        console.log('upload ctor')
        this.s3Proxy = s3Proxy;
        this.ddbProxy = ddbProxy;
        this.s3Bucket = s3Bucket;

        console.log(this.s3Bucket)
    }

    updateResumeLink = async (uid: string, s3Url: string) => {
        const params: AWS.DynamoDB.Types.UpdateItemInput = {
            TableName: "acm-connect",
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

        await this.ddbProxy.update(params);
    };


    handle = async (request: express.Request, response: express.Response) => {
        const form: multiparty.Form = new multiparty.Form();

        console.log('initiating new form upload');

        const uid: string = response.locals.uid!;
        const resumeKey: string = `${uid}.pdf`;

        form.on('part', async (part: multiparty.Part) => {
            console.log("Received part of file");
            const addPartRequest: AWS.S3.PutObjectRequest = {
                Bucket: this.s3Bucket,
                Key: resumeKey,
                ACL: 'public-read',
                Body: part,
                ContentLength: part.byteCount,
            }


            this.s3Proxy.put(addPartRequest).then(
                async success => {
                    if (success) {
                        console.log(this.s3Proxy.constructFilename(this.s3Bucket, resumeKey))
                        await this.updateResumeLink(uid, this.s3Proxy.constructFilename(this.s3Bucket, resumeKey));

                        console.log(`Uploaded resume for ${uid}`);

                        response.status(200).json({ url: this.s3Proxy.constructFilename(this.s3Bucket, resumeKey) });
                    } else {
                        console.log(`Success ${success}`);
                        response.sendStatus(500);
                    }
                }
            )
        });

        form.on('close', () => {
            console.log("should be done uploading")
        });

        form.parse(request);
    }
}

export default UploadResumeHandler;