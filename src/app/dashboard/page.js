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
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Tooltip} from "@nextui-org/react";
import { set } from "firebase/database";
import {Spinner} from "@nextui-org/react";

export default function Dashboard() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [fileText, setFileText] = useState("");
  const mediaRecorderRef = useRef(null);
  const webSocketRef = useRef(null);
  const { startRecording, stopRecording, text, status } = useRecordVoice();
  const fileInputRef = useRef(null);
  const [selectedKeys, setSelectedKeys] = useState(new Set(["general"]));
  const [selectedKeyText, setSelectedKeyText] = useState("general"); 
  const [dropdownEnabled, setDropdownEnables] = useState(true);
  const [processing, setProcessing] = useState(true);

  const handleButtonClick = () => {
    console.log("clicked");
    if (isRecording) {
      stopRecording();
      setIsRecording(false);
      setDropdownEnables(true);
    } else {
      startRecording(selectedKeyText);
      setIsRecording(true);
      setDropdownEnables(false)
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
      setProcessing(false);
      try {
        const response = await fetch("/api/handleTextConversion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: textFromFile,
            userid: user.uid,
            type: selectedKeyText,
          }),
        }).then((res) => res.json());
        console.log(response);
        setFileText(response);
        setProcessing(true)
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleClick = () => {
    // When the label is clicked, trigger the input click
      fileInputRef.current.click();
  };

  const handleKeyChanged = (key) => {
    setSelectedKeys(key);
    setSelectedKeyText(key.currentKey);
  }

  return (
    <div className="flex flex-col items-center justify-center inset-0 fixed h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="mb-8">
        <h1 className="text-bold text-2xl h-16">NoteKan</h1>
      </div>
      {status && processing ? 
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
      : <div><Spinner /></div>}
      

      <div className="mt-8 max-w-3xl">
        <p>{fileText}</p>
        <p>{text}</p>
      </div>
      
      <Dropdown className="" isDisabled={!dropdownEnabled}>
        <DropdownTrigger>
          <Button 
            className="capitalize absolute top-10 right-10"
          >
            {selectedKeys}
          </Button>
        </DropdownTrigger>
        <DropdownMenu 
          className="text-black"
          aria-label="Single selection example"
          variant="flat"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={selectedKeys}
          onSelectionChange={handleKeyChanged}
        >
          <DropdownItem key="kanban">
            <Tooltip content="Creates a kanban board with user stories and requirments" placement="left">
              Kanban
            </Tooltip>
          </DropdownItem>
          <DropdownItem key="general">
            <Tooltip content="Creates general meeting notes and summary with a relevent title" placement="left">
              General
            </Tooltip>
          </DropdownItem>
          <DropdownItem key="Custom">
            <Tooltip content="Creates general meeting notes and summary with a relevent title" placement="left">
              Custom
            </Tooltip>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <div className="absolute bottom-10 right-10">
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
