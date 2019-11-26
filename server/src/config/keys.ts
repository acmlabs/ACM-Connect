interface Keys{
    AWS_ACCESS_KEY: string,
    AWS_SECRET_KEY: string,
    S3_BUCKET_NAME:string,
    JWT_SECRET:string,
    AWS_DYNAMODB_TABLE_NAME: string
}

let keys: Keys;

if(process.env.NODE_ENV === 'production'){
    keys = {
        AWS_ACCESS_KEY: process.env.PROD_AWS_ACCESS_KEY!,
        AWS_DYNAMODB_TABLE_NAME: process.env.PROD_AWS_DYNAMODB_TABLE_NAME!,
        AWS_SECRET_KEY: process.env.PROD_AWS_ACCESS_KEY!,
        JWT_SECRET: process.env.PROD_JWT_SECRET!,
        S3_BUCKET_NAME: process.env.PROD_AWS_S3_BUCKET_NAME!
    }
}else{
    keys = {
        AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY!,
        AWS_DYNAMODB_TABLE_NAME: process.env.AWS_DYNAMODB_TABLE_NAME!,
        AWS_SECRET_KEY: process.env.AWS_SECRET_KEY!,
        JWT_SECRET: process.env.JWT_SECRET!,
        S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME!
    }
}



export {Keys, keys}