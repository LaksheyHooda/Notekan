'use client'

import { useEffect, useState, useRef } from "react";
import { Button } from "@nextui-org/react";
import { useRecordVoice } from "@/hooks/useRecordVoice";

export default function Dashboard() {

    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const webSocketRef = useRef(null);
    const { startRecording, stopRecording, text } = useRecordVoice();

    useEffect(() => {
        // Create WebSocket connection.
        // webSocketRef.current = new WebSocket('ws://localhost:8080');

        // // Commands for WebSocket events
        // webSocketRef.current.onopen = () => {
        //     console.log('WebSocket Client Connected');
        // };
        // webSocketRef.current.onclose = () => {
        //     console.log('WebSocket Client Disconnected');
        // };

        // return () => {
        //     webSocketRef.current.close();
        // };

    }, []);

    const startRecordingWebsock = async () => {

        if (webSocketRef.current.readyState === WebSocket.CLOSED) {
            console.log('WebSocket is closed');
            webSocketRef.current = new WebSocket('ws://localhost:8080');
        }

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


            mediaRecorderRef.current.onstop = () => {
                console.log('MediaRecorder stopped');
                webSocketRef.current.close();
            }

            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing audio devices.', error);
        }
    };

    const stopRecordingWebsock = async () => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        // Close the media stream
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    };

    const handleButtonClick = () => {
        if (isRecording) {
            stopRecording();
            setIsRecording(false)
        } else {
            startRecording();
            setIsRecording(true)
        }
    };

    return (
        <div className="flex justify-center inset-0 fixed items-center h-screen bg-gradient-to-r from-blue-500 to-purple-500">
            <Button onClick={handleButtonClick}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            <p>{text}</p>
        </div>
    );
}