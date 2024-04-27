// Import the express library
const express = require('express');
const { WebSocketServer } = require('ws')
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const OpenAI = require("openai");

//turn into enviroment variable
const openai = new OpenAI({ apiKey: 'sk-proj-0CwNwWN0Po6pi6EU857tT3BlbkFJNHIJrbixJn5QZZbHo0LJ' });
// Create an express application
const app = express();

var currentFile = 0;

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

    const fileStream = fs.createWriteStream('output_audio_' + currentFile + '.webm');
    currentFile++;

    ws.on('message', function incoming(message) {
        console.log('Received message');
        fileStream.write(message);
    });

    ws.on('metadata', function incoming(metadata) {
        console.log('Received metadata');
    });

    ws.on('close', async () => {
        console.log('Connection closed');
        fileStream.end();

        await performTranscription();

    });
});

async function performTranscription() {
    try {
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream("output_audio_" + (currentFile - 1) + ".webm"),
            model: "whisper-1",
        });

        console.log(transcription.text);
    } catch (error) {
        console.log('Failed to transcribe: ', error);
    }
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
