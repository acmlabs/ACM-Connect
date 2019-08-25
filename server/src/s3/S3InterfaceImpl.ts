import {S3Interface} from "./proxy/S3Interface";
import AWS, {Response} from "aws-sdk";
import {inject, injectable, named} from "inversify";
import {TYPES} from '../config/types'

type PromiseResult<D, E> = D & { $response: Response<D, E> };

@injectable()
class S3InterfaceImpl implements S3Interface {
    clientConn: AWS.S3;
    S3_BUCKET: string;

    constructor(@inject(TYPES.S3) s3: AWS.S3,
                @inject(TYPES.string) @named("S3Bucket") S3_BUCKET: string) {
        console.log('Logging s3 bucket ' + S3_BUCKET);

        this.clientConn = s3;
        this.S3_BUCKET = S3_BUCKET;
    }


    async put(object: AWS.S3.PutObjectRequest) {
        try {
            const response: AWS.S3.ManagedUpload.SendData = await this.clientConn.upload(object).promise();
            return true;
        } catch (e) {
            return false;
        }
    }

    async delete(object: AWS.S3.DeleteObjectRequest){
        try{
            const response = await this.clientConn.deleteObject(object).promise();
            return true;
        }catch(e)
        {
            return false;
        }
    }

    constructFilename = (s3Filename: string) => {
        return `https://${process.env.S3_URL}/${s3Filename}`;
    }

}

export default S3InterfaceImpl;