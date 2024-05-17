import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { createWriteStream, promises as fsPromises } from 'fs';
import { config as dotenvConfig } from 'dotenv';

// Load environment variables from .env file
dotenvConfig();

const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
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
  const { Body } = await s3Client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const fileStream = createWriteStream(downloadPath);
  await fsPromises.mkdir('C:/tmp', { recursive: true }); // Make sure the directory exists
  return new Promise((resolve, reject) => {
    Body.pipe(fileStream);
    fileStream.on('finish', () => {
   
      resolve(downloadPath);
    });
    fileStream.on('error', reject);
  });
}
