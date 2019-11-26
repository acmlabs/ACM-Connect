import Handler from "../types/handler";
import express from 'express'
import DynamoDbInterface from "../database/proxy/DynamoDbInterface";
import { inject, injectable } from "inversify";
import { TYPES } from "../config/types";
import AWS from 'aws-sdk'

@injectable()
class ResumeLinkRequestHandler implements Handler {

    private ddbProxy: DynamoDbInterface;

    constructor(
        @inject(TYPES.DDBProxy) ddbProxy: DynamoDbInterface) {
        this.ddbProxy = ddbProxy;
    }


    handle = async (request: express.Request, response: express.Response) => {
        const id: string = response.locals.uid;

        const params: AWS.DynamoDB.Types.QueryInput = {
            TableName: this.ddbProxy.ddbTableName,
            KeyConditionExpression: "#resourceType = :type AND #id = :id",
            ExpressionAttributeValues: {
                ":id": { S: id },
                ":type": { S: "student" }
            },
            ExpressionAttributeNames: {
                "#resourceType": "resource-type",
                "#id": "id",
                "#resumeURL": "resume-url",
            },
            ProjectionExpression: "#resumeURL"
        };

        const results: AWS.DynamoDB.AttributeMap[] | undefined =
            await this.ddbProxy.query(params);

        if (results === undefined || results.length === 0) {
            console.log('undefined results');
            response.sendStatus(500);
        } else {
            const profile: AWS.DynamoDB.AttributeMap = results[0];

            console.log(profile)
            const resumeURL: string | undefined = profile['resume-url'].S;

            if (resumeURL === undefined) {
                response.sendStatus(500);
            } else {
                console.log(resumeURL)
                response.status(200)
                    .json({ url: resumeURL })
            }
        }
    }
}

export default ResumeLinkRequestHandler;