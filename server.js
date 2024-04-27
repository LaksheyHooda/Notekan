// Import the express library
const express = require('express');

// Create an express application
const app = express();

// Define a port for the server to listen on
const PORT = process.env.PORT || 4000;  // You can choose any port that is free on your system

// Define a route handler for the root path
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
