import AWS, { DynamoDB } from 'aws-sdk';
import express from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../config/types';
import DynamoDbInterface from '../database/proxy/DynamoDbInterface';
import Handler from '../types/handler';




@injectable()
class ProfileRoute implements Handler {

    private ddbClient: DynamoDbInterface;

    constructor(@inject(TYPES.DDBProxy) ddbProxy: DynamoDbInterface) {
        this.ddbClient = ddbProxy;
    }

    handle = async (request: express.Request, response: express.Response): Promise<void> => {
        const resumeUrlQuery: AWS.DynamoDB.Types.QueryInput =
        {
            TableName: this.ddbClient.ddbTableName,
            KeyConditionExpression: "#resourceType = :type",
            ExpressionAttributeValues: {
                ":type": { S: "student" },

            },
            ProjectionExpression: "#resumeUrl",
            ExpressionAttributeNames: {
                "#resourceType": "resource-type",
                "#resumeUrl": "resume-url"

            },

        }

        const results: DynamoDB.AttributeMap[] | undefined = await this.ddbClient.query(resumeUrlQuery);

        // something wrong with the server request, try again later
        if (results === undefined) {
            response.status(500).json({});
            return;
        }

        const resumes: string[] = results.map((result) => {
            console.log(result['resume-url'].S)
            return result['resume-url'].S!
        });

        console.log(resumes)

        response.status(200).json({ data: resumes });
    }
}


export default ProfileRoute;