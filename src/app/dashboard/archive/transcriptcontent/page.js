"use client";

import { db, auth } from "@/config/firebase/config";
import { Input } from "@nextui-org/react";
import Link from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where, getDoc, doc } from "firebase/firestore";
import { set } from "firebase/database";

export default function Home() {
    const [dataDoc, setDataDoc] = useState(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');


    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                assignData()
            } else {
                router.replace(`/login`);
            }
        });
    }, []);

    const assignData = async () => {
        try {
            const docRef = await doc(db, "transcriptions", id)
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                setDataDoc(docSnap.data());
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    return (
        <div className="flex mt-20 justify-center h-screen w-screen">
            {
                dataDoc ? (
                    <div>
                        <h1 className="text-center text-2xl font-bold">{dataDoc.title}</h1>

                        <p>{dataDoc.data}</p>
                    </div>
                ) : (
                    <h1>Loading...</h1>
                )
            }
        </div>
    );
}