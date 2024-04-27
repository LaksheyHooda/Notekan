const OpenAI = require("openai");

//turn into enviroment variable
const openai = new OpenAI({ apiKey: 'sk-proj-0CwNwWN0Po6pi6EU857tT3BlbkFJNHIJrbixJn5QZZbHo0LJ' });

const fs = require("fs");

async function main() {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream("output_audio.webm"),
    model: "whisper-1",
  });

  console.log(transcription.text);
}
main();