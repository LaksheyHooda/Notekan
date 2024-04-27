'use client'

import Image from "next/image";
import { db } from "@/config/firebase/config";
import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";

const signuop = async () => {
    const docRef = await addDoc(collection(db, "users"), {
        first: "Ada",
        last: "Lovelace",
        born: 1815
    }).then((doc) => {
        console.log("Document written with ID: ", doc.id);
    }).catch((error) => {
        console.error("Error adding document: ", error);
    });
}

export default function Signup() {

    useEffect(() => {
        const sinup_async = async () => {
            await signuop();
        }

        sinup_async();

    }, []);

    return (
        <div className="flex min-h-screen flex-col items-center p-24">
            Sign up!
        </div>
    );
}
