"use client";

import { db, auth } from "@/config/firebase/config";
import { Input } from "@nextui-org/react";
import Link from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where, getDoc, doc } from "firebase/firestore";

export default function Archive() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("date");
    const [items, setItems] = useState([]);
    const [rawDocs, setRawDocs] = useState([]);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                getItems(user.uid)
            } else {
                router.replace(`/login`);
            }
        });
    }, []);

    const getItems = async (userID) => {
        try {
            const q = query(collection(db, "transcriptions"), where("userID", "==", userID));
            const querySnapshot = await getDocs(q);
            setRawDocs(querySnapshot.docs);
        } catch (error) {
            console.error("Error: ", error);
            return null;
        }
    }

    const handleSwitchTerm = (e) => {
        console.log(e.target.value);
        setSortBy(e.target.value);

        if(e.target.value === "date") {
            setItems([...rawDocs].sort((a, b) => new Date(b.data().time) - new Date(a.data().time)));
        } else if(e.target.value === "title") {
            setItems([...rawDocs].sort((a, b) => a.data().title.localeCompare(b.data().title)));
        }
    };

    return (
        <div className="flex w-screen min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
            <div className="container justify-center mx-auto py-8">
                <h1 className="text-4xl font-bold mb-6">NoteKan Archive</h1>

                <div className="mb-6 justify-center">
                    <Input
                        type="text"
                        placeholder="Search..."
                        className="rounded-md mx-auto justify-center max-w-3xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text caret-blue-500 animate-blink-wide"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <label className="mr-2">Sort By:</label>
                    <select
                        className="rounded-md px-4 py-2 text-black"
                        value={sortBy}
                        onChange={handleSwitchTerm}
                    >
                        <option className="text-black" value="date">
                            Date
                        </option>
                        <option className="text-black" value="title">
                            Title
                        </option>
                    </select>
                </div>

                <table className="w-full max-w-3xl border-collapse mx-auto">
                    <thead>
                        <tr className="bg-gray-200 text-center">
                            <th className="py-2 px-4 text-black" style={{ width: "80%" }}>Title</th>
                            <th className="py-2 px-4 text-black" style={{ width: "20%" }}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rawDocs.map((doc) => (
                            <tr key={doc.id} className="border-b">
                                <td className="pb-2 pt-2 pr-4" style={{ width: "80%" }}>
                                    <a href={"/dashboard/archive/transcriptcontent?id=" + doc.id}>{doc.data().title}</a>
                                </td>
                                <td className="pb-2 pt-2 pl-4" style={{ width: "20%" }}>{new Date(doc.data().time).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    );
}
