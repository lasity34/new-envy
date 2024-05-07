import express from 'express';
import { connectToDatabase } from './db/database.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello from Envy backend!');
});

app.get('/test-db', async (req, res) => {
    try {
        const dbResponse = await connectToDatabase();  // This function now fetches credentials and queries the DB
        res.send(`Database response: ${JSON.stringify(dbResponse.rows[0])}`);
    } catch (error) {
        res.status(500).send('Failed to connect to the database');
        console.error('Database connection error:', error);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

