import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION!
const bucket = process.env.S3_BUCKET_NAME!

if(!region || !bucket){
    throw new Error("Please set up AWS_REGION and S3_BUCKET_NAME in .nv.local")
}

const s3 = new S3Client({
    region,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
})

export async function getPresignedUploadUrl(key:string, contentType:string,expiresIn = 900){
    const command = new PutObjectCommand({
        Bucket:bucket,
        Key:key,
        ContentType:contentType
    })
    const url = await getSignedUrl(s3, command, {expiresIn})
    return url
}

export async function getPresignedDownloadUrl(key:string, expiresIn = 900){
    const command = new GetObjectCommand({
        Bucket:bucket,
        Key:key
    })
    const url = await await getSignedUrl(s3,command,{expiresIn})
    return url
}

export async function deleteS3Object(key:string){
    const command = new DeleteObjectCommand({
        Bucket:bucket,
        Key:key
    })
    return s3.send(command)
}


