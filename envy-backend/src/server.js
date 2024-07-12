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
  'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION',
  'DB_SECRET_ID', 'S3_BUCKET_NAME', 'KEY', 'USE_SSL', 'JWT_SECRET',
  'EMAIL_USER',
];

for (const varName of requiredEnvVariables) {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000', // Adjust this to your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

async function initializeApp() {
  try {
    const credentials = await getSecret(process.env.DB_SECRET_ID);

    const sslCertPath = process.env.USE_SSL === 'true' ? 
      await downloadFileFromS3(process.env.S3_BUCKET_NAME, process.env.KEY, 'C:/tmp/global-bundle.pem') : 
      null;

    await connectDatabase(credentials, sslCertPath);
  } catch (error) {
    console.error('Failed to initialize the application:', error);
    process.exit(1);
  }
}

app.get('/', (req, res) => {
  res.send('Hello from Envy backend!');
});

// Use multer upload middleware for the upload endpoint
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

// Example admin route
app.get('/api/admin/protected', authenticateAdmin, (req, res) => {
  res.json({ message: 'This is an admin protected route' });
});

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await initializeApp();
});
