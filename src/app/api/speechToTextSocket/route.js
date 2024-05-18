// pages/api/socket.js
import { Server } from 'ws';
import { parse } from 'url';
import { NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const wss = new Server({ noServer: true });

wss.on('connection', function connection(ws) {
    ws.on('message', async function incoming(base64data) {
        const audioBuffer = Buffer.from(base64data, 'base64');
        try {
            const response = await openai.audio.transcriptions.create({
                buffer: audioBuffer,
                model: "whisper-1"
            });
            const transcription = response.data; // Adapt based on actual response format
            ws.send(JSON.stringify({ transcription }));
        } catch (error) {
            console.error('Error processing audio:', error);
            ws.send(JSON.stringify({ error: 'Error processing audio' }));
        }
    });
});

export default function handler(req, res) {
    if (req.url.startsWith('/api/socket')) {
        if (req.method === 'GET') {
            req.socket.setTimeout(0);
            res.socket.server.on('upgrade', (request, socket, head) => {
                wss.handleUpgrade(request, socket, head, (websocket) => {
                    wss.emit('connection', websocket, request);
                });
            });
            res.end();
        }
    } else {
        return NextResponse.next();
    }
}