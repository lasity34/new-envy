import express from 'express';
import 'dotenv/config';
import { fetchExample } from './db/database.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello from Envy backend!');
});

app.get('/test-db', async (req, res) => {
    try {
        const dbResponse = await fetchExample();
        res.send(`Database response: ${JSON.stringify(dbResponse.rows[0])}`);
    } catch (error) {
        res.status(500).send('Failed to connect to the database');
        console.error('Database connection error:', error);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
