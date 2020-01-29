require('dotenv')
import AWS from 'aws-sdk';
import { inject, injectable } from "inversify";
import DynamoDbInterface from '../../database/proxy/DynamoDbInterface';
import { TYPES } from "../../config/types";

import chalk from 'chalk'
import bcrypt, { compare } from 'bcrypt'
import { keys } from "../../config/keys";

const uuid = require('uuid');

export type Recruiter = {
    email: string,
    password: string,
    dateCreated: string,
    company: string
}

export type Payload = {
    id: string,
    success: boolean
}

@injectable()
class RecruiterCreator {
    private readonly ddb: DynamoDbInterface;

    constructor(@inject(TYPES.DDBProxy) ddbProxy: DynamoDbInterface) {
        this.ddb = ddbProxy;
    }

    addRecruiterProfile = async (profile: Recruiter): Promise<Payload> => {
        const profileId: string = uuid.v4();

        const passwordHash: string = bcrypt.hashSync(profile.password, 16);

        const recruiterSchema: AWS.DynamoDB.Types.PutItemInput = {
            TableName: keys.AWS_DYNAMODB_TABLE_NAME,
            Item: {
                id: { S: profileId },
                "resource-type": { S: "recruiter" },
                "email": { S: profile.email },
                "password": { S: passwordHash },
                "company": { S: profile.company },
                "dateCreated": { S: profile.dateCreated }
            }
        };

        const result: boolean = await this.ddb.put(recruiterSchema);


        if (result === true) {
            const payload: Payload = {
                success: true,
                id: profileId
            };

            return payload
        } else {
            const payload: Payload = {
                success: true,
                id: ""
            };

            console.log(chalk.bgRed(`Something went wrong, unable to create recruiter profile ${profileId}.`))
            return payload
        }
    }
}

export default RecruiterCreator;