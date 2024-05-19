import { NextResponse } from "next/server";
import OpenAI from "openai";
import { db } from "@/config/firebase/config";
import {
  addDoc,
  collection,
  doc,
  query,
  where,
  getDocs,
  arrayUnion,
  updateDoc,
} from "firebase/firestore";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function performGeneralSummaryTemplate(data, userID, type) {
  let newDocIdArray;
  if (type === "general") {
    const completion = await openai.chat.completions
      .create({
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant designed to summerize meetings with a title and with a bulleted summary that returns JSON. Make sure the title accurately represents the content of the meeting. Format the json to have a title and a summary, and under the summary have as many key-value pairs as appropriate.",
          },
          { role: "user", content: data },
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
        ).then((newDocsIds) => {
          newDocIdArray = newDocsIds;
        });
      });
  } else if (type === "kanban") {
    const completion = await openai.chat.completions
      .create({
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant designed to create user stories, requirments, and validation metrics based of the meeting, with a acurate title in json, including the keyword Kanban in the title. Make sure the title accurately represents the content of the meeting. Make sure the user stories are in the format of 'As a [role], I want [feature] so that [reason]' and the requirements are in the format of 'Given [context], when [action], then [outcome]' and make the validation metric in a testable format. Add the user_stories, requirments, and validation metrics inside the data key in json. Make user_stories, requirments, and validation metrics are arrays of strings following the given format.",
          },
          { role: "user", content: data },
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
        ).then((newDocsIds) => {
          newDocIdArray = newDocsIds;
        });
      });
  }
  return newDocIdArray;
}

async function saveRawAndProcessedTranscriptions(
  data,
  userID,
  processedData,
  type
) {
  const transcription = data;
  let newDocIds = [];
  try {
    var translatedData;
    if (type === "kanban") {
      translatedData = JSON.parse(processedData).data;
    } else {
      translatedData = JSON.parse(processedData).summary;
    }

    const newDocData = {
      userID: userID,
      title: JSON.parse(processedData).title,
      data: translatedData,
      time: new Date().getTime(),
      type: type,
    };
    await addDoc(collection(db, "processedDocuments"), newDocData).then(
      async (docRef) => {
        await addNewRawAndProcessedTranscriptionToUser(
          userID,
          docRef.id,
          false
        ).then((newId) => {
          newDocIds.push(newId);
        });
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
        await addNewRawAndProcessedTranscriptionToUser(userID, docRef.id, true)
          .then((newId) => {
            newDocIds.push(newId);
          });
      }
    );
  } catch (error) {
    console.error("Error adding document: ", error);
  }

  return newDocIds;
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
        return docID;
      } else {
        await updateDoc(doc(db, "users", docSnap.id), {
          processedDocsIDs: arrayUnion(docID),
        });
        return docID;
      }
      //return docSnap;
    } else {
      console.log("No such document!");
      //return null;
    }
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
}

export async function POST(req) {
  const body = await req.json();
  const userID = body.userid;
  const data = body.data;
  const type = body.type;
  let docIds = [];

  console.log("Data: ", type);

  try {
    await performGeneralSummaryTemplate(data, userID, type).then((newDocsIds) => {
      docIds = newDocsIds;
      console.log("DocIds: ", newDocsIds);
    });
    const response = {
      text: data,
      docIds: docIds,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error processing text:", error);
    return NextResponse.error();
  }
}
