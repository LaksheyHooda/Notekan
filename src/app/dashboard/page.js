"use client";

import { useEffect, useState, useRef } from "react";
import { db, auth } from "@/config/firebase/config";
import { Button } from "@nextui-org/react";
import { useRecordVoice } from "@/hooks/useRecordVoice";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/react";



export default function Dashboard() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [fileText, setFileText] = useState("");
  const mediaRecorderRef = useRef(null);
  const webSocketRef = useRef(null);
  const { startRecording, stopRecording, text } = useRecordVoice();
  const fileInputRef = useRef(null);
  const [selectedKeys, setSelectedKeys] = useState("text");

  function DropdownMenu() {
    return (
      <Dropdown>
      <DropdownTrigger>
        <Button 
          variant="bordered" 
          className="capitalize"
        >
          {selectedValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="Single selection example"
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <DropdownItem key="text">Text</DropdownItem>
        <DropdownItem key="number">Number</DropdownItem>
        <DropdownItem key="date">Date</DropdownItem>
        <DropdownItem key="single_date">Single Date</DropdownItem>
        <DropdownItem key="iteration">Iteration</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    );
  }

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

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {

            } else {
                router.replace(`/login`);
            }
        });
    }, []);

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
        console.log(response);
        setFileText(response);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleClick = () => {
    // When the label is clicked, trigger the input click
      fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center justify-center inset-0 fixed h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="mb-8">
        <h1 className="text-bold text-2xl h-16">NoteKan</h1>
      </div>

      <div className="flex items-center justify-center">
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
      </div>

      <div className="mt-8 max-w-3xl">
        <p>{fileText}</p>
        <p>{text}</p>
      </div>

      <div className="absolute bottom-4 right-4">
        <div className="file-upload-container">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".txt"
                style={{ display: 'none' }} // Hide the actual input element
            />
            <label
                onClick={handleClick}
                className="bg-green-500 w-20 hover:bg-green-600 text-white rounded-full p-2 flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
            >
                <FontAwesomeIcon className="h-6 w-6" icon={faFileUpload} />
            </label>
        </div>
      </div>
    </div>
  );
}
