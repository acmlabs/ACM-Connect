import {DocumentClient} from 'aws-sdk/clients/dynamodb';
import DynamoDbInterface from './proxy/DynamoDbInterface';
import AWS, {DynamoDB, Response} from 'aws-sdk';
import chalk from 'chalk'
import {TYPES} from "../config/types";
import {inject, injectable} from "inversify";

type PromiseResult<D, E> = D & { $response: Response<D, E> };

@injectable()
class DynamoDBProxyImpl implements DynamoDbInterface {

    clientConn: AWS.DynamoDB;

    constructor(@inject(TYPES.DDB)ddb: AWS.DynamoDB) {
        this.clientConn = ddb;
    }

    async put(document: DocumentClient.PutItemInput) {
        const errorCallback = (err: AWS.AWSError, data: AWS.DynamoDB.Types.PutItemOutput) => {
            if (err) {
                console.log(chalk.red(`[DynamoDbInterfaceImpl::PUT] Error: ${err}`));
            } else {
                console.log(chalk.blue(`[DynamoDbInterfaceImpl::PUT] ${JSON.stringify(data)}`));
            }
        };

        const actionAsPromise: Promise<PromiseResult<DynamoDB.PutItemOutput, AWS.AWSError>> = this.clientConn.putItem(document, errorCallback).promise();

        const result: PromiseResult<DynamoDB.PutItemOutput, AWS.AWSError> = await actionAsPromise;

        return Promise.resolve(result.$response.error === null);
    }

    async get(params: AWS.DynamoDB.Types.GetItemInput) {
        const errorCallback = (err: AWS.AWSError, data: AWS.DynamoDB.Types.PutItemOutput) => {
            if (err) {
                console.log(chalk.red(`[DynamoDbInterfaceImpl::GET] Error: ${err}`));
            } else {
                console.log(chalk.blue(`[DynamoDbInterfaceImpl::GET] ${JSON.stringify(data)}`));
            }
        };

        const actionAsPromise: Promise<PromiseResult<DynamoDB.GetItemOutput, AWS.AWSError>> = this.clientConn.getItem(params, errorCallback).promise();

        const result: PromiseResult<DynamoDB.GetItemOutput, AWS.AWSError> = await actionAsPromise;

        return Promise.resolve(result.Item);
    }

    async update(params: AWS.DynamoDB.Types.UpdateItemInput) {
        const errorCallback = (err: AWS.AWSError, data: AWS.DynamoDB.Types.PutItemOutput) => {
            if (err) {
                console.log(chalk.red(`[DynamoDbInterfaceImpl::UPDATE] Error: ${err}`));
            } else {
                console.log(chalk.blue(`[DynamoDbInterfaceImpl::UPDATE] ${JSON.stringify(data)}`));
            }
        };

        const actionAsPromise: Promise<PromiseResult<DynamoDB.UpdateItemOutput, AWS.AWSError>> = this.clientConn.updateItem(params, errorCallback).promise();

        const result: PromiseResult<DynamoDB.UpdateItemOutput, AWS.AWSError> = await actionAsPromise;

        return Promise.resolve(result.$response.error === null);
    }

    async delete(params: AWS.DynamoDB.Types.DeleteItemInput) {
        const errorCallback = (err: AWS.AWSError, data: AWS.DynamoDB.Types.PutItemOutput) => {
            if (err) {
                console.log(chalk.red(`[DynamoDbInterfaceImpl::DELETE] Error: ${err}`));
            } else {
                console.log(chalk.blue(`[DynamoDbInterfaceImpl::DELETE] ${JSON.stringify(data)}`));
            }
        };

        const actionAsPromise: Promise<PromiseResult<DynamoDB.DeleteItemOutput, AWS.AWSError>> = this.clientConn.deleteItem(params, errorCallback).promise();

        const result: PromiseResult<DynamoDB.DeleteItemOutput, AWS.AWSError> = await actionAsPromise;

        return Promise.resolve(result.$response.error === null);
    }

    async query(params: AWS.DynamoDB.Types.QueryInput) {
        const errorCallback = (err: AWS.AWSError, data: AWS.DynamoDB.Types.QueryOutput) => {
            if (err) {
                console.log(chalk.red(`[DynamoDbInterfaceImpl::QUERY] Error: ${err}`));
            } else {
                console.log(chalk.blue(`[DynamoDbInterfaceImpl::QUERY] ${JSON.stringify(data)}`));
            }
        };

        const actionAsPromise: Promise<PromiseResult<DynamoDB.QueryOutput, AWS.AWSError>> = this.clientConn.query(params, errorCallback).promise();

        const result: PromiseResult<DynamoDB.QueryOutput, AWS.AWSError> = await actionAsPromise;

        return Promise.resolve(result.Items);
    }

}

export default DynamoDBProxyImpl;