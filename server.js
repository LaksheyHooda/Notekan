// Import the express library
const express = require('express');
const { WebSocketServer } = require('ws')
const fs = require('fs');
const OpenAI = require("openai");
const {Readable} = require('stream')
const os = require('os');
const path = require('path');

//turn into enviroment variable

const openai = new OpenAI({ apiKey: 'sk-proj-0CwNwWN0Po6pi6EU857tT3BlbkFJNHIJrbixJn5QZZbHo0LJ' });

// Create an express application
const app = express();

let audioBuffer = Buffer.alloc(5096);

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

    ws.on('message', function incoming(message) {
        console.log('Received message');
        audioBuffer = Buffer.concat([audioBuffer, message]);
    });

    ws.on('close', async () => {
        console.log('Connection closed');

        const tempFilePath = path.join(os.tmpdir(), 'temp_audio.webm');
        fs.writeFileSync(tempFilePath, audioBuffer);

        // Reset the buffer
        audioBuffer.fill(0);

        audioBuffer = Buffer.alloc(0);

        // Create a stream from the temporary file
        const audioStream = fs.createReadStream(tempFilePath);

        try {
            const transcription = await openai.audio.transcriptions.create({
                file: audioStream,
                model: "whisper-1",
                response_format: "text",
            });

            console.log(transcription);
            fs.unlinkSync(tempFilePath); // Clean up the temporary file
        } catch (error) {
            console.error("Error transcribing audio:", error);
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

