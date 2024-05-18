"use client";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useEffect, useState, useRef } from "react";
import { blobToBase64 } from "@/utils/blobToBase64";
import { createMediaStream } from "@/utils/createMediaStream";
import { db, auth } from "@/config/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

export const useRecordVoice = () => {
  const [text, setText] = useState("");
  const [rawDocId, setRawDocId] = useState("");
  const [processedDocId, setProcessedDocId] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState(true);
  const isRecording = useRef(false);
  const recordingType = useRef("");
  const chunks = useRef([]);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const startRecording = (recordType) => {
    recordingType.current = recordType;
    if (mediaRecorder) {
      isRecording.current = true;
      mediaRecorder.start();
      setRecording(true);
      setRawDocId("");
      setProcessedDocId("");
      SpeechRecognition.startListening();
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      isRecording.current = false;
      mediaRecorder.stop();
      setRecording(false);
      SpeechRecognition.stopListening();
    }
  };

  const getText = async (base64data) => {
    const user = auth.currentUser;
    console.log(recordingType);
    try {
      setStatus(false);
      const response = await fetch("/api/speechToText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audio: base64data,
          userid: user.uid,
          type: recordingType.current,
        }),
      }).then((res) => res.json());
      //console.log(response)
      const { text } = response.text;
      setText(text);

      if (response.docIds && response.docIds.length > 0) {
        console.log(response.docIds);
        setProcessedDocId(response.docIds[0]);
        setRawDocId(response.docIds[1]);
      }

      resetTranscript();
      setStatus(true);
    } catch (error) {
      console.log(error);
    }
  };

  const initialMediaRecorder = (stream) => {
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.onstart = () => {
      createMediaStream(stream);
      chunks.current = [];
    };

    mediaRecorder.ondataavailable = (ev) => {
      chunks.current.push(ev.data);
      console.log(chunks.current)
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
      blobToBase64(audioBlob, getText);
    };

    setMediaRecorder(mediaRecorder);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(initialMediaRecorder);
    }
  }, []);

  return { recording, startRecording, stopRecording, text, status, transcript, listening, browserSupportsSpeechRecognition, processedDocId, rawDocId };
};