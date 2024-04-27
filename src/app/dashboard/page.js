'use client'

import { useEffect, useState, useRef } from "react";
import { Button } from "@nextui-org/react";

export default function Dashboard() {

    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const webSocketRef = useRef(null);

    useEffect(() => {
        // Create WebSocket connection.
        webSocketRef.current = new WebSocket('ws://localhost:8080');

        // Commands for WebSocket events
        webSocketRef.current.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        webSocketRef.current.onclose = () => {
            console.log('WebSocket Client Disconnected');
        };

        return () => {
            webSocketRef.current.close();
        };

    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.start();

            // Collect audio data as it comes in
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (webSocketRef.current.readyState === WebSocket.OPEN) {
                    webSocketRef.current.send(event.data);
                }
            };

            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing audio devices.', error);
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        // Close the media stream
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    };

    return (
        <div className="flex justify-center inset-0 fixed items-center h-screen bg-gradient-to-r from-blue-500 to-purple-500">
            <Button onClick={isRecording ? stopRecording : startRecording}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
        </div>
    );
}
