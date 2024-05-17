import express from 'express';
import { config as dotenvConfig } from 'dotenv';
import bodyParser from 'body-parser';
import { connectDatabase, getProducts } from '../db/database.js';
import { getSecret, downloadFileFromS3 } from '../services/aws-services.js';
import authRoutes from '../routes/authRoutes.js';

// Load environment variables from .env file
dotenvConfig();

const requiredEnvVariables = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION', 'DB_SECRET_ID', 'BUCKET', 'KEY', 'USE_SSL', 'JWT_SECRET'];

for (const varName of requiredEnvVariables) {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

async function initializeApp() {
  try {
    const credentials = await getSecret(process.env.DB_SECRET_ID);
    console.log('Database credentials:', credentials);

    const sslCertPath = process.env.USE_SSL === 'true' ? 
      await downloadFileFromS3(process.env.BUCKET, process.env.KEY, 'C:/tmp/global-bundle.pem') : 
      null;

    await connectDatabase(credentials, sslCertPath);
  } catch (error) {
    console.error('Failed to initialize the application:', error);
    process.exit(1); // Stop the server if initialization fails
  }
}

app.get('/', (req, res) => {
  res.send('Hello from Envy backend!');
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Use authentication routes
app.use('/api/auth', authRoutes);

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await initializeApp();
});
