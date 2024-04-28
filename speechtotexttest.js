const OpenAI = require("openai");

//turn into enviroment variable
const openai = new OpenAI({
  apiKey: "sk-proj-0CwNwWN0Po6pi6EU857tT3BlbkFJNHIJrbixJn5QZZbHo0LJ",
});

const fs = require("fs");

async function main() {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream("output_audio.webm"),
    model: "whisper-1",
  });

  console.log(transcription.text);
}
//main();

const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath("/opt/homebrew/bin/ffmpeg"); // Set this to the correct path

ffmpeg("output_audio.webm")
  .fromFormat("webm")
  .toFormat("mp3")
  .audioCodec("libmp3lame")
  .on("error", function (err) {
    console.log("An error occurred: " + err.message);
  })
  .on("end", function () {
    console.log("Conversion finished successfully.");
  })
  .save("output.mp3");
