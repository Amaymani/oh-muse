import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    }
});

async function getObjectURL(key) {
    try {
        const command = new GetObjectCommand({
            Bucket: "ohmuse-pohsts",
            Key: key,
        });

        const url = await getSignedUrl(s3Client, command);
        
        return url;
    } catch (error) {
        console.error("Error getting signed URL:", error);
        throw error;
    }
}

async function putObject(username, filename, contentType){
    const command = new PutObjectCommand({
        Bucket: "ohmuse-pohsts",
        Key: `pohsts/${username}/${filename}`,
        ContentType: contentType
    })
    const url = await getSignedUrl(s3Client, command,{ expiresIn:120});
    
    return url; 
}

async function deleteObject(key){
    const command = new DeleteObjectCommand({
        Bucket: "ohmuse-pohsts",
        Key: key
    });
    await s3Client.send(command);
}

export { s3Client, getObjectURL, putObject, deleteObject };
