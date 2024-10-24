const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const cors = require('cors'); // Import the cors package

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('src')); // Serve static files (like JavaScript)

// Route to serve recommendations.js
app.get('/recommendations.js', (req, res) => {
    res.sendFile(path.join(__dirname,'src', 'Recommendations.js'));
});

// Route to handle search requests
app.post('/search', (req, res) => {
    const searchTerm = req.body.searchTerm; // Capture input
    const terms = searchTerm.split(',').map(term => term.trim()); // Split input into array and trim spaces
    const results = [];

    fs.createReadStream('udemy_courses.csv')
        .pipe(csv())
        .on('data', (row) => {
            // Check if all terms are present in any field of the row
            const matchFound = terms.every(term =>
                Object.values(row).some(value =>
                    value.toString().toLowerCase().includes(term.toLowerCase())
                )
            );
            if (matchFound) {
                results.push(row); // Store the entire row if all terms match
            }
        })
        .on('end', () => {
            res.json(results); // Send the complete row data back to the client
        });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
