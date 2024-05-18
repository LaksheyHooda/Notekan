"use client";

import { useEffect, useState, useRef, use } from "react";
import { db, auth } from "@/config/firebase/config";
import 'regenerator-runtime/runtime'
import { Button } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import { useRecordVoice } from "@/hooks/useRecordVoice";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Tooltip } from "@nextui-org/react";
import { set } from "firebase/database";
import { Spinner } from "@nextui-org/react";

export default function Dashboard() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [textFileModalOpen, setTextFileModalOpen] = useState(false);
  const [fileText, setFileText] = useState("");
  const mediaRecorderRef = useRef(null);
  const webSocketRef = useRef(null);
  const { startRecording, stopRecording, text, status,
    transcript, listening, browserSupportsSpeechRecognition,
    processedDocId, rawDocId } = useRecordVoice();
  const fileInputRef = useRef(null);
  const [selectedKeys, setSelectedKeys] = useState(new Set(["general"]));
  const [selectedKeyText, setSelectedKeyText] = useState("general");
  const [dropdownEnabled, setDropdownEnables] = useState(true);
  const [processing, setProcessing] = useState(true);
  const [rawId, setRawId] = useState("");
  const [processedId, setProcessedId] = useState("");
  const [processedType, setProcessedType] = useState("");
  const [textAreaText, setTextAreaText] = useState("");
  const fileUploadModalRef = useRef(null);

  const handleButtonClick = () => {
    console.log("clicked");
    if (isRecording) {
      setProcessedType(selectedKeyText)
      setTextFileModalOpen(false)
      stopRecording();
      setIsRecording(false);
      console.log(transcript);
      console.log(browserSupportsSpeechRecognition);
      setDropdownEnables(true);
    } else {
      setProcessedType("")
      setRawId("");
      setProcessedId("");
      startRecording(selectedKeyText);
      setIsRecording(true);
      setDropdownEnables(false)
    }
  };

  useEffect(() => {
    console.log("listening", listening);
  }, [listening])

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
      setProcessedType(selectedKeyText);
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
        setFileText(response.text);
        if (response.docIds && response.docIds.length > 0) {
          setProcessedId(response.docIds[0]);
          setRawId(response.docIds[1]);
        }
        setProcessing(true)
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleTextUploadClicked = async () => {
    setTextFileModalOpen(false);
    console.log(textAreaText);
    if (textAreaText) {
      const user = auth.currentUser;
      setProcessing(false);
      setProcessedType(selectedKeyText);
      try {
        const response = await fetch("/api/handleTextConversion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: textAreaText,
            userid: user.uid,
            type: selectedKeyText,
          }),
        }).then((res) => res.json());
        console.log(response);
        setFileText(response.text);
        if (response.docIds && response.docIds.length > 0) {
          setProcessedId(response.docIds[0]);
          setRawId(response.docIds[1]);
        }
        setProcessing(true)
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fileUploadModalRef.current && !fileUploadModalRef.current.contains(event.target)) {
        if (textFileModalOpen) {
          setTextFileModalOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handUploadFileClicked = () => {
    fileInputRef.current.click();
    setTextFileModalOpen(false);
  }

  const handleClick = () => {
    if (textFileModalOpen) {
      setTextFileModalOpen(false)
    } else {
      setTextFileModalOpen(true);
    }
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

      {rawDocId ? <Link className="text-white border border-slate-900 mt-4 bg-slate-900 w-60 text-center justify-center rounded-md" href={"dashboard/archivedTranscripts/transcriptcontent?id=" + rawDocId}>View Raw Transcript</Link> : null}
      {processedDocId ? <Link
        className="text-white border justify-center border-slate-900 mt-4 bg-slate-900 w-60 rounded-md"
        href={"dashboard/processed/" + (processedType === "general" ? "generalnotes" : (processedType === "kanban" ? "kanban" : "custom")) + "?id=" + processedDocId}>
        View Processed Document
      </Link> : null}

      {rawId ? <Link className="text-white border border-slate-900 mt-4 bg-slate-900 w-60 text-center justify-center rounded-md" href={"dashboard/archivedTranscripts/transcriptcontent?id=" + rawId}>View Raw Transcript</Link> : null}
      {processedId ? <Link
        className="text-white border justify-center border-slate-900 mt-4 bg-slate-900 w-60 rounded-md"
        href={"dashboard/processed/" + (processedType === "general" ? "generalnotes" : (processedType === "kanban" ? "kanban" : "custom")) + "?id=" + processedId}>
        View Processed Document
      </Link> : null}


      {textFileModalOpen && !isRecording ?

        <div ref={fileUploadModalRef} className="absolute bottom-[10vh] right-[25vw] bg-white border text-black rounded-lg w-[50vw] h-[80vh]">
          <h1 className="text-xl text-center mt-4">Type or paste text for notes</h1>
          <textarea className="h-[55vh] w-[45vw] mx-auto mt-2 border 
                              border-black resize-none cursor-text
                              bg-gray-50 pl-2 pr-2 pt-1 rounded-md" onChange={(e) => { setTextAreaText(e.target.value) }} value={textAreaText} />
          <Button className="w-[45vw] mt-3 bg-slate-900 text-white" onClick={handleTextUploadClicked}>
            Upload Text
          </Button>
          <Button className="w-[45vw] mt-5 bg-slate-900 text-white" onClick={handUploadFileClicked}>
            Upload File
          </Button>
        </div> : null}

      {/* {transcript ?
        <div className="mt-8 max-w-3xl h-[500px] overflow-y-auto">
          <p>{transcript}</p>
        </div> : null
      } */}

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
            <Tooltip className="text-black" content="Creates a kanban board with user stories and requirments" placement="left">
              Kanban
            </Tooltip>
          </DropdownItem>
          <DropdownItem key="general">
            <Tooltip className="text-black" content="Creates general meeting notes and summary with a relevent title" placement="left">
              General
            </Tooltip>
          </DropdownItem>
          <DropdownItem key="Custom" isReadOnly>
            <Tooltip className="text-black" content="Soon to be added custom not templates!" placement="left">
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
