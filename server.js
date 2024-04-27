// Import the express library
const express = require('express');
const { WebSocketServer } = require('ws')

// Create an express application
const app = express();

// Define a port for the server to listen on
const PORT = process.env.PORT || 4000;  // You can choose any port that is free on your system

// Define a route handler for the root path
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

const wss = new WebSocketServer({
    port: 8080
})

wss.on('connection', function connection(ws) {
    console.log('Connected to client via WebSocket');

    // Use websocket-stream to handle stream easily
    const stream = wsStream(ws);

    // Here you could save the stream to a file, for example:
    stream.pipe(fs.createWriteStream('output_audio.webm'));

    ws.on('close', () => {
        console.log('Connection closed');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
