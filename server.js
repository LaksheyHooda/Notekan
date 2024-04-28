// Import the express library
const express = require("express");
const { WebSocketServer } = require("ws");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const OpenAI = require("openai");

//turn into enviroment variable
const openai = new OpenAI({
  apiKey: "sk-proj-0CwNwWN0Po6pi6EU857tT3BlbkFJNHIJrbixJn5QZZbHo0LJ",
});
// Create an express application
const app = express();

var currentFile = 0;

// Define a port for the server to listen on
const PORT = process.env.PORT || 4000; // You can choose any port that is free on your system

// Define a route handler for the root path
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

const wss = new WebSocketServer({
  port: 8080,
});

wss.on("connection", function connection(ws) {
  console.log("Connected to client via WebSocket");
  const filePath = "output_audio_" + currentFile + ".webm";
  const fileStream = fs.createWriteStream(filePath);
  currentFile++;

  ws.on("message", function incoming(message) {
    console.log("Received message");
    if (fileStream.writable) {
      fileStream.write(message);
    }
  });

  ws.on("end", function () {
    console.log("end");
  });

  ws.on("close", async () => {
    console.log("Connection closed");
    fileStream.end(null, null, async () => {
      try {
        await performTranscription(filePath);
      } catch (error) {
        console.error("Error in transcription:", error);
      }
    });
  });

  ws.on("error", (error) => {
    console.log("WebSocket error:", error);
    fileStream.end();
  });

  fileStream.on("error", (error) => {
    console.error("FileStream error:", error);
  });
});

async function performTranscription(filePath) {
  console.log(filePath);
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      fileFormat: "webm",
      model: "whisper-1",
    });

    console.log(transcription.text);
  } catch (error) {
    console.log("Failed to transcribe: ", error);
  }
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
