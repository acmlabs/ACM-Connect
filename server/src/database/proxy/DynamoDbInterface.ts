import AWS, { DynamoDB } from 'aws-sdk'

export default interface DynamoDbInterface {
    clientConn: DynamoDB;
    ddbTableName: string;
    put: (params: AWS.DynamoDB.Types.PutItemInput) => Promise<boolean>,
    get: (params: AWS.DynamoDB.Types.GetItemInput) => Promise<AWS.DynamoDB.AttributeMap | undefined>,
    update: (params: AWS.DynamoDB.Types.UpdateItemInput) => Promise<boolean>,
    delete: (params: AWS.DynamoDB.Types.DeleteItemInput) => Promise<boolean>,
    query: (params: AWS.DynamoDB.Types.QueryInput) => Promise<AWS.DynamoDB.AttributeMap[] | undefined>
};
