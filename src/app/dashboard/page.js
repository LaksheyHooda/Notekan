"use client";

import { useEffect, useState, useRef } from "react";
import { db, auth } from "@/config/firebase/config";
import { Button } from "@nextui-org/react";
import { useRecordVoice } from "@/hooks/useRecordVoice";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Dashboard() {
    const [isRecording, setIsRecording] = useState(false);
    const [fileText, setFileText] = useState("");
    const mediaRecorderRef = useRef(null);
    const webSocketRef = useRef(null);
    const { startRecording, stopRecording, text } = useRecordVoice();
    const fileInputRef = useRef(null);

    useEffect(() => {

    }, []);

    const handleButtonClick = () => {
        console.log("clicked");
        if (isRecording) {
            stopRecording();
            setIsRecording(false);
        } else {
            startRecording();
            setIsRecording(true);
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const textFromFile = await file.text();

            const user = auth.currentUser;
            try {
                const response = await fetch("/api/handleTextConversion", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        data: textFromFile,
                        userid: user.uid,
                    }),
                }).then((res) => res.json());
                const { text } = response;
                setText(text);
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <div className="flex justify-center inset-0 fixed items-center h-screen bg-gradient-to-r from-blue-500 to-purple-500">
            <Button
                onClick={handleButtonClick}
                className={
                    "w-20 h-20 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${isRecording ? 'animate-pulse' : ''}"
                }
            >
                {isRecording ? (
                    <FontAwesomeIcon className="h-6 w-6" icon={faSquare} />
                ) : (
                    <FontAwesomeIcon className="h-6 w-6" icon={faMicrophone} />
                )}
            </Button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".txt"
                style={{ marginTop: '20px' }}
            />
            <p>{fileText}</p>
            <p>{text}</p>
        </div>
    );
}
