import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const secretsManager = new AWS.SecretsManager();

const getSecret = async (secretId) => {
  try {
    console.log('Secret ID:', secretId); // Add this line to log the Secret ID
    const data = await secretsManager.getSecretValue({ SecretId: secretId }).promise();
    if (data.SecretString) {
      return JSON.parse(data.SecretString);
    }
    throw new Error('SecretString is not defined');
  } catch (error) {
    console.error('Error retrieving secret:', error);
    throw error;
  }
};

const main = async () => {
  const secretId = process.env.DB_SECRET_ID;
  console.log('Secret ID from .env:', secretId); // Add this line to log the Secret ID from .env
  try {
    const secret = await getSecret(secretId);
    console.log('Retrieved secret:', secret);
  } catch (error) {
    console.error('Failed to retrieve secret:', error);
  }
};

main();
