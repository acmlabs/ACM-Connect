import AWS from 'aws-sdk'

export interface S3Interface {
    put: (params: AWS.S3.PutObjectRequest) => Promise<Boolean>,
    delete: (params: AWS.S3.DeleteObjectRequest) => Promise<Boolean>
    constructFilename: (s3Bucket: string, s3Filename: string) => string,
}