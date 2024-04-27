import { NextResponse } from "next/server";
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: 'sk-proj-0CwNwWN0Po6pi6EU857tT3BlbkFJNHIJrbixJn5QZZbHo0LJ',
});

async function performGeneralSummaryTemplate(data) {
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant designed to summerize meetings with a title and with a bulleted summary that returns JSON.",
            },
            { role: "user", content: data.text },
        ],
        model: "gpt-3.5-turbo-0125",
        response_format: { type: "json_object" },
    });
    console.log(data.text);
    console.log(completion.choices[0].message.content);
}

export async function POST(req) {
    const body = await req.json();
    const base64Audio = body.audio;
    const audio = Buffer.from(base64Audio, "base64");
    const filePath = "tmp/input.wav";

    try {
        fs.writeFileSync(filePath, audio);
        const readStream = fs.createReadStream(filePath);
        const data = await openai.audio.transcriptions.create({
            file: readStream,
            model: "whisper-1",
        });
        // Remove the file after use
        fs.unlinkSync(filePath);
        await performGeneralSummaryTemplate(data)
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error processing audio:", error);
        return NextResponse.error();
    }
}