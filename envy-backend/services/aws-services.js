import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { createWriteStream, promises as fsPromises } from 'fs';
import { config as dotenvConfig } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Load environment variables from .env file
dotenvConfig();

const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !S3_BUCKET_NAME) {
  console.error("Missing AWS configuration environment variables");
  process.exit(1);
}

const credentials = {
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
};

export async function getSecret(secretId, region = AWS_REGION) {
  const client = new SecretsManagerClient({ region, credentials });
  const data = await client.send(new GetSecretValueCommand({ SecretId: secretId }));
  return JSON.parse(data.SecretString);
}

export async function downloadFileFromS3(bucket, key, downloadPath, region = AWS_REGION) {
  const s3Client = new S3Client({ region, credentials });

  // Ensure the download directory exists
  const downloadDir = path.dirname(downloadPath);
  await fsPromises.mkdir(downloadDir, { recursive: true });

  const { Body } = await s3Client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const fileStream = createWriteStream(downloadPath);
  return new Promise((resolve, reject) => {
    Body.pipe(fileStream);
    fileStream.on('finish', () => {
      resolve(downloadPath);
    });
    fileStream.on('error', reject);
  });
}

export async function uploadFileToS3(file) {
  const s3Client = new S3Client({ region: AWS_REGION, credentials });
  const fileName = `${uuidv4()}-${file.originalname}`;
  const uploadParams = {
    Bucket: S3_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };


  try {
    await s3Client.send(new PutObjectCommand(uploadParams));
    const imageUrl = `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${fileName}`;
    console.log('Uploaded image URL:', imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}
