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
        <div className="flex justify-center inset-0 fixed items-center h-screen bg-gradient-to-r from-[#000000] to-[#243c5a]">
            Forgot Pasword!
        </div>
    );
}
