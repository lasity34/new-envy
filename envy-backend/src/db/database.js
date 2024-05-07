import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import pg from 'pg';
const { Pool } = pg;

async function getDatabaseCredentials() {
  const client = new SecretsManagerClient({ region: "eu-north-1" });
  const data = await client.send(
    new GetSecretValueCommand({
      SecretId: "rds!db-55acf308-c8fc-4010-b51c-20ea08f79d85",
      VersionStage: "AWSCURRENT",
    })
  );
  return JSON.parse(data.SecretString);
}

export async function connectToDatabase() {
  const credentials = await getDatabaseCredentials();
  
  const pool = new Pool({
    user: credentials.username,
    host: credentials.host,
    database: credentials.dbname,
    password: credentials.password,
    port: credentials.port,
    ssl: {
      rejectUnauthorized: true,
      ca: credentials.sslrootcert
    }
  });

  const res = await pool.query('SELECT NOW()');
  return res;
}
