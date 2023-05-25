const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

// Create a SQLite database connection
const dbPath = path.join(__dirname, 'populationweb.db');
const db = new sqlite3.Database(dbPath);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to retrieve all data
app.get('/population', (req, res) => {
    const query = 'SELECT * FROM Population';

    db.all(query, (error, rows) => {
        if (error) {
            console.error('Error retrieving data:', error);
            res.status(500).json({ error: 'An error occurred' });
        } else {
            res.json(rows);
        }
    });
});

// API endpoint to retrieve data by CountryName
app.get('/population/:country', (req, res) => {
    const country = req.params.country;
    const query = 'SELECT * FROM Population WHERE CountryName = ?';

    db.all(query, [country], (error, rows) => {
        if (error) {
            console.error('Error retrieving data:', error);
            res.status(500).json({ error: 'An error occurred' });
        } else {
            res.json(rows);
        }
    });
});

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch-all route handler for undefined routes
app.get('*', (req, res) => {
    res.status(404).send('404: Page not found');
});

// Start the server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});


