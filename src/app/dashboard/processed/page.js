"use client";

import { db, auth } from "@/config/firebase/config";
import { Link } from "@nextui-org/react";
import { Button, DropdownTrigger, Input } from "@nextui-org/react";
import { Dropdown, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
} from "firebase/firestore";

export default function Home() {
  const [rawDocs, setRawDocs] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getItems(user.uid);
      } else {
        router.replace(`/login`);
      }
    });
  }, []);

  const getItems = async (userID) => {
    try {
      const q = query(
        collection(db, "processedDocuments"),
        where("userID", "==", userID)
      );
      const querySnapshot = await getDocs(q);
      setRawDocs(querySnapshot.docs);
      console.log("Query Snapshot: ", querySnapshot.docs);
    } catch (error) {
      console.error("Error: ", error);
      return null;
    }
  };

  return (
    <div className="flex flex-col pt-10 inset-0 w-screen min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <header>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg-px:6">
          <h1 className="text-3xl font-bold text-white">
            NoteKan File Storage
          </h1>
        </div>
      </header>

      <div>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

              {rawDocs.map((doc) => (
                 <Link
                 key={doc.id}
                 href="#"
                 className="bg-white shadow rounded-lg overflow-hidden"
               >
                 <div className="h-40 bg-cover bg-center"></div>
                 <div className="p-4">
                   <h3 className="text-lg font-medium text-gray-900">
                     {doc.data().title}
                   </h3>
                   <p className="text-sm text-gray-500">
                     Date Added: {new Date(doc.data().time).toLocaleString()}
                   </p>
                   <p className="text-md text-gray-500">
                     Type: {doc.data().type}
                   </p>
                 </div>
               </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
