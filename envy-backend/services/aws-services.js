import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";
import { createWriteStream, promises as fsPromises } from 'fs';
import { config as dotenvConfig } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Load environment variables from .env file
dotenvConfig();

const AWS_REGION = process.env.AWS_REGION;
const AWS_ROLE_ARN = process.env.AWS_ROLE_ARN;
const AWS_ROLE_SESSION_NAME = process.env.AWS_ROLE_SESSION_NAME;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

if (!AWS_REGION || !AWS_ROLE_ARN || !AWS_ROLE_SESSION_NAME || !S3_BUCKET_NAME) {
  console.error("Missing AWS configuration environment variables");
  process.exit(1);
}

let cachedCredentials = null;

async function assumeRole() {
  if (cachedCredentials) {
    return cachedCredentials;
  }

  const stsClient = new STSClient({ region: AWS_REGION });
  const params = {
    RoleArn: AWS_ROLE_ARN,
    RoleSessionName: AWS_ROLE_SESSION_NAME
  };

  try {
    const data = await stsClient.send(new AssumeRoleCommand(params));
    cachedCredentials = {
      accessKeyId: data.Credentials.AccessKeyId,
      secretAccessKey: data.Credentials.SecretAccessKey,
      sessionToken: data.Credentials.SessionToken
    };
    return cachedCredentials;
  } catch (err) {
    console.error('Error assuming role:', err);
    throw err;
  }
}

export async function getSecret(secretId) {
  const credentials = await assumeRole();
  const client = new SecretsManagerClient({ region: AWS_REGION, credentials });
  try {
    const data = await client.send(new GetSecretValueCommand({ SecretId: secretId }));
    return JSON.parse(data.SecretString);
  } catch (error) {
    console.error('Error getting secret:', error);
    throw error;
  }
}

export async function downloadFileFromS3(bucket, key, downloadPath) {
  const credentials = await assumeRole();
  const s3Client = new S3Client({ region: AWS_REGION, credentials });

  // Ensure the download directory exists
  const downloadDir = path.dirname(downloadPath);
  await fsPromises.mkdir(downloadDir, { recursive: true });

  try {
    const { Body } = await s3Client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const fileStream = createWriteStream(downloadPath);
    return new Promise((resolve, reject) => {
      Body.pipe(fileStream);
      fileStream.on('finish', () => {
        resolve(downloadPath);
      });
      fileStream.on('error', reject);
    });
  } catch (error) {
    console.error('Error downloading file from S3:', error);
    throw error;
  }
}

export async function uploadFileToS3(file) {
  const credentials = await assumeRole();
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
