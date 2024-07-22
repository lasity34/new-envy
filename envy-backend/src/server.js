import express from 'express';
import cors from 'cors';
import { config as dotenvConfig } from 'dotenv';
import bodyParser from 'body-parser';
import multer from 'multer';
import { connectDatabase } from '../db/database.js';
import { getSecret, downloadFileFromS3, uploadFileToS3 } from '../services/aws-services.js';
import authRoutes from '../routes/authRoutes.js';
import productRoutes from '../routes/productRoutes.js';
import cartRoutes from '../routes/cartRoutes.js';
import checkoutRoutes from '../routes/checkoutRoutes.js';
import { authenticate, authenticateAdmin } from '../middleware/auth.js';

dotenvConfig();

const requiredEnvVariables = [
  'AWS_REGION', 'S3_BUCKET_NAME', 'SECRETS_ARN', 'USE_SSL', 'KEY',
  'DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER'
];

for (const varName of requiredEnvVariables) {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage });

async function initializeApp() {
  try {
    const secrets = await getSecret();
    
    console.log('Retrieved secrets:', Object.keys(secrets));

    // Set sensitive environment variables from secrets
    process.env.DB_PASSWORD = secrets.DB_PASSWORD;
    process.env.JWT_SECRET = secrets.JWT_SECRET;
    process.env.SENDGRID_API_KEY = secrets.SENDGRID_API_KEY;

    // Check for SendGrid API key
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith("SG.")) {
      console.log("SendGrid API key set successfully");
    } else {
      console.warn("Warning: Invalid or missing SendGrid API key in secrets. Email functionality may not work.");
    }

    // Log database connection details (excluding password)
    console.log('Database connection details:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER
    });

    // Ensure DB_PORT is a number
    const dbPort = parseInt(process.env.DB_PORT, 10);
    if (isNaN(dbPort)) {
      throw new Error(`Invalid DB_PORT: ${process.env.DB_PORT}`);
    }

    let sslCertPath = null;
    if (process.env.USE_SSL === 'true') {
      try {
        sslCertPath = await downloadFileFromS3(process.env.S3_BUCKET_NAME, process.env.KEY, '/tmp/global-bundle.pem');
      } catch (error) {
        console.warn('Warning: Error downloading SSL certificate. SSL may not be enabled.', error);
      }
    }

    await connectDatabase({
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: dbPort,
      dbname: process.env.DB_NAME
    }, sslCertPath);

    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize the application:', error);
    process.exit(1);
  }
}

app.get('/', (req, res) => {
  res.send('Hello from Envy backend!');
});

app.post('/api/products/upload', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
   
    if (!file) {
      return res.status(400).send({ error: 'No file uploaded' });
    }

    const imageUrl = await uploadFileToS3(file);
    res.status(200).send({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send({ error: 'Failed to upload image' });
  }
});

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);

app.get('/api/protected', authenticate, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

app.get('/api/admin/protected', authenticateAdmin, (req, res) => {
  res.json({ message: 'This is an admin protected route' });
});

initializeApp().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error('Failed to start the server:', error);
  process.exit(1);
});