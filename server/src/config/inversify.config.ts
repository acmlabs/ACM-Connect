import 'reflect-metadata';

import AWS from 'aws-sdk';
import { Container } from 'inversify';

import DynamoDBProxyImpl from '../database/DynamoDbInterfaceImpl';
import DynamoDbInterface from '../database/proxy/DynamoDbInterface';
import RemoveResumeHandler from '../routes/removeResume';
import ResumeLinkRequestHandler from '../routes/resumeURLRequest';
import SignUpHandler from '../routes/signup';
import UploadResumeHandler from '../routes/upload';
import { S3Interface } from '../s3/proxy/S3Interface';
import S3InterfaceImpl from '../s3/S3InterfaceImpl';
import KeyGen from '../tools/keys/KeyGen';
import { keys } from './keys';
import DynamoDB from './modules/DynamoModule';
import S3 from './modules/S3Module';
import { TYPES } from './types';

const Injector = new Container();

// Constant string binding
console.log(keys.S3_BUCKET_NAME)
Injector.bind<string>(TYPES.string).toConstantValue(keys.S3_BUCKET_NAME)
    .whenTargetNamed("S3Bucket");

// S3 implementation binding
Injector.bind<S3Interface>(TYPES.S3Interface).to(S3InterfaceImpl);


Injector.bind<string>(TYPES.string).toConstantValue(keys.AWS_DYNAMODB_TABLE_NAME)
    .whenTargetNamed("DynamoDB")
Injector.bind<AWS.S3>(TYPES.S3).toConstantValue(S3);

Injector.bind<UploadResumeHandler>(TYPES.UploadResumeHandler).to(UploadResumeHandler);

Injector.bind<AWS.DynamoDB>(TYPES.DDB).toConstantValue(DynamoDB);

Injector.bind<DynamoDbInterface>(TYPES.DDBProxy).to(DynamoDBProxyImpl);

Injector.bind<SignUpHandler>(TYPES.SignUpHandler).to(SignUpHandler);
Injector.bind<ResumeLinkRequestHandler>(TYPES.ResumeLinkRequestHandler).to(ResumeLinkRequestHandler);
Injector.bind<RemoveResumeHandler>(TYPES.RemoveResumeHandler).to(RemoveResumeHandler);

Injector.bind<KeyGen>(TYPES.KeyGen).to(KeyGen);

export { Injector };