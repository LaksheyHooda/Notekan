"use client";

import { db, auth } from "@/config/firebase/config";
import { Link } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

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
        <div className="flex flex-col items-center justify-center min-h-screen w-full">
            {dataDoc != null ? (
                <div className="max-w-3xl p-8 bg-white rounded-lg shadow-lg">
                    <h1 className="text-3xl text-cyan-800 font-bold text-center mb-4">{dataDoc.title}</h1>
                    <h2 className="text-xl text-cyan-800 font-semibold text-center mb-6">
                        {new Date(dataDoc.time).toDateString()}
                    </h2>
                    <p className="text-lg text-cyan-800 leading-relaxed mb-8">{dataDoc.data}</p>
                    <Link href="/dashboard/archivedTranscripts" className="fixed bottom-4 left-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Back
                    </Link>
                </div>
            ) : (
                <div className="flex items-center justify-center h-screen">
                    <h1 className="text-2xl font-bold">Loading...</h1>
                </div>
            )}
        </div>
    );
}