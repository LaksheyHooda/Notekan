import { NextResponse } from "next/server";
import fs from "fs";
import OpenAI from "openai";
import { db } from "@/config/firebase/config";
import {
  addDoc,
  setDoc,
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  arrayUnion,
  updateDoc,
} from "firebase/firestore";
import { patch } from "request";
import path from "path";

const openai = new OpenAI({
  apiKey: "sk-proj-0CwNwWN0Po6pi6EU857tT3BlbkFJNHIJrbixJn5QZZbHo0LJ",
});

async function performGeneralSummaryTemplate(data, userID, type) {
  if (type === "general") {
    const completion = await openai.chat.completions
      .create({
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant designed to summerize meetings with a title and with a bulleted summary that returns JSON. Make sure the title accurately represents the content of the meeting.",
          },
          { role: "user", content: data.text },
        ],
        model: "gpt-3.5-turbo-0125",
        response_format: { type: "json_object" },
      })
      .then(async (response) => {
        console.log(response.choices[0].message.content);
        await saveRawAndProcessedTranscriptions(
          data,
          userID,
          response.choices[0].message.content,
          type
        );
      });
  } else if (type === "kanban") {
    const completion = await openai.chat.completions
      .create({
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant designed to create user stories, requirments, and validation metrics based of the meeting, with a title in json. Make sure the title accurately represents the content of the meeting. Make sure the user stories are in the format of 'As a [role], I want [feature] so that [reason]' and the requirements are in the format of 'Given [context], when [action], then [outcome]' and make the validation metric in a testable format. Add the user_stories, requirments, and validation metrics inside the a data key in json",
          },
          { role: "user", content: data.text },
        ],
        model: "gpt-3.5-turbo-0125",
        response_format: { type: "json_object" },
      })
      .then(async (response) => {
        console.log(response.choices[0].message.content);
        await saveRawAndProcessedTranscriptions(
          data,
          userID,
          response.choices[0].message.content,
          type
        );
      });
  }
  //console.log(completion.choices[0].message.content);
}

async function saveRawAndProcessedTranscriptions(
  data,
  userID,
  processedData,
  type
) {
  const transcription = data.text;
  try {
    const newDocData = {
      userID: userID,
      title: JSON.parse(processedData).title,
      data: JSON.parse(processedData).summary,
      time: new Date().getTime(),
      type: type,
    };
    await addDoc(collection(db, "processedDocuments"), newDocData).then(
      async (docRef) => {
        await addNewRawAndProcessedTranscriptionToUser(
          userID,
          docRef.id,
          false
        );
      }
    );
  } catch (error) {
    console.error("Error parsing JSON: ", error);
  }

  const docData = {
    userID: userID,
    title: JSON.parse(processedData).title,
    data: transcription,
    time: new Date().getTime(),
  };
  try {
    await addDoc(collection(db, "transcriptions"), docData).then(
      async (docRef) => {
        await addNewRawAndProcessedTranscriptionToUser(userID, docRef.id, true);
      }
    );
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}

async function addNewRawAndProcessedTranscriptionToUser(userID, docID, isRaw) {
  try {
    const q = query(collection(db, "users"), where("uid", "==", userID));
    const querySnapshot = await getDocs(q);

    const docSnap = querySnapshot.docs[0];
    if (docSnap) {
      if (isRaw) {
        await updateDoc(doc(db, "users", docSnap.id), {
          rawDocsIDs: arrayUnion(docID),
        });
        console.log("Document updated with rawDocsIDs: ", docID);
      } else {
        await updateDoc(doc(db, "users", docSnap.id), {
          processedDocsIDs: arrayUnion(docID),
        });
        console.log("Document updated with processedDocsIDs: ", docID);
      }
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
}

export async function POST(req) {
  const body = await req.json();
  const base64Audio = body.audio;
  const userID = body.userid;
  const type = body.type;
  const audio = Buffer.from(base64Audio, "base64");
  const filePath = path.join(process.cwd(), "audio.wav");

  try {
    fs.writeFileSync(filePath, audio);
    const readStream = fs.createReadStream(filePath);
    const data = await openai.audio.transcriptions.create({
      file: readStream,
      model: "whisper-1",
    });
    // Remove the file after use
    fs.unlinkSync(filePath);
    await performGeneralSummaryTemplate(data, userID, type);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error processing audio:", error);
    return NextResponse.error();
  }
}
