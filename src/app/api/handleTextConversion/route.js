import { NextResponse } from "next/server";
import fs from "fs";
import OpenAI from "openai";
import { db } from "@/config/firebase/config";
import { addDoc, setDoc, collection, doc, getDoc, query, where, getDocs, arrayUnion, updateDoc } from "firebase/firestore";


const openai = new OpenAI({
    apiKey: 'sk-proj-0CwNwWN0Po6pi6EU857tT3BlbkFJNHIJrbixJn5QZZbHo0LJ',
});

async function performGeneralSummaryTemplate(data, userID) {
    //console.log(data);
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant designed to summerize meetings with a title and with a bulleted summary that returns JSON. Make sure the title acuratley represents the content of the meeting. Make sure to create the json in proper format, with key value pairs.",
            },
            { role: "user", content: data },
        ],
        model: "gpt-3.5-turbo-0125",
        response_format: { type: "json_object" },
    }).then(async (response) => {
        console.log(response.choices[0].message.content);
        await saveRawAndProcessedTranscriptions(data, userID, response.choices[0].message.content);
    });
}

async function saveRawAndProcessedTranscriptions(data, userID, processedData) {
    const transcription = data;
    try {
        const newDocData = {
            userID: userID,
            title: JSON.parse(processedData).title,
            data: JSON.parse(processedData).summary,
            time: new Date().getTime(),
            type: "general"
        };
        await addDoc(collection(db, "processedDocuments"), newDocData).then(async (docRef) => {
            await addNewRawAndProcessedTranscriptionToUser(userID, docRef.id, false);
        });
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
        await addDoc(collection(db, "transcriptions"), docData).then(async (docRef) => {
            await addNewRawAndProcessedTranscriptionToUser(userID, docRef.id, true);
        });
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
                    rawDocsIDs: arrayUnion(docID)
                });
                console.log("Document updated with rawDocsIDs: ", docID);
            } else {
                await updateDoc(doc(db, "users", docSnap.id), {
                    processedDocsIDs: arrayUnion(docID)
                });
                console.log("Document updated with processedDocsIDs: ", docID);
            }
            //return docSnap;
        } else {
            console.log("No such document!");
            //return null;
        }

        // if (docSnap.exists()) {
        //     console.log("Document data:", docSnap.data());
        //     return docSnap;
        // } else {
        //     console.log("No such document!");
        //     return null;
        // }
    } catch (error) {
        console.error("Error: ", error);
        return null;
    }
}

export async function POST(req) {
    const body = await req.json();
    const userID = body.userid;
    const data = body.data;

    try {
        await performGeneralSummaryTemplate(data, userID)
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error processing text:", error);
        return NextResponse.error();
    }
}