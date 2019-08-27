import { Container } from "inversify";

import "reflect-metadata";
import { TYPES } from './types';
import { S3Interface } from "../s3/proxy/S3Interface";
import S3InterfaceImpl from "../s3/S3InterfaceImpl";
import AWS from 'aws-sdk';

import S3 from './modules/S3Module'
import DynamoDB from './modules/DynamoModule';

import UploadResumeHandler from "../routes/upload";
import ResumeLinkRequestHandler from '../routes/resumeURLRequest';
import DynamoDbInterface from "../database/proxy/DynamoDbInterface";
import DynamoDBProxyImpl from "../database/DynamoDbInterfaceImpl";
import SignUpHandler from "../routes/signup";
import RemoveResumeHandler from "../routes/removeResume";

import KeyGen from '../tools/keys/KeyGen';

const Injector = new Container();

// S3 implementation binding
Injector.bind<S3Interface>(TYPES.S3Interface).to(S3InterfaceImpl);

// Constant string binding
Injector.bind<string>(TYPES.string).toConstantValue(process.env.S3_BUCKET_NAME!)
    .whenTargetNamed("S3Bucket");
Injector.bind<AWS.S3>(TYPES.S3).toConstantValue(S3);

Injector.bind<UploadResumeHandler>(TYPES.UploadResumeHandler).to(UploadResumeHandler);

Injector.bind<AWS.DynamoDB>(TYPES.DDB).toConstantValue(DynamoDB);

Injector.bind<DynamoDbInterface>(TYPES.DDBProxy).to(DynamoDBProxyImpl);

Injector.bind<SignUpHandler>(TYPES.SignUpHandler).to(SignUpHandler);
Injector.bind<ResumeLinkRequestHandler>(TYPES.ResumeLinkRequestHandler).to(ResumeLinkRequestHandler);
Injector.bind<RemoveResumeHandler>(TYPES.RemoveResumeHandler).to(RemoveResumeHandler);

Injector.bind<KeyGen>(TYPES.KeyGen).to(KeyGen);

export { Injector };