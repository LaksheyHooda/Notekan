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

export default function Processed() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Date");
  const [items, setItems] = useState([]);
  const [rawDocs, setRawDocs] = useState([]);
  const [dropdownEnabled, setDropdownEnables] = useState(true);

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

  const handleSwitchTerm = (e) => {
    setSortBy(e);

    if (e === "Date") {
      setItems(
        [...rawDocs].sort(
          (a, b) => new Date(b.data().time) - new Date(a.data().time)
        )
      );
    } else if (e === "Title") {
      setItems(
        [...rawDocs].sort((a, b) =>
          a.data().title.localeCompare(b.data().title)
        )
      );
    }
  };

  useEffect(() => {
    const filteredItems = rawDocs.filter((doc) =>
      doc.data().title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setItems(filteredItems);
  }, [searchTerm, rawDocs]);

  return (
    <div className="flex flex-col pt-10 inset-0 w-screen min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <header>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg-px:6">
          <h1 className="text-3xl font-bold text-white">
            NoteKan File Storage
          </h1>
        </div>
      </header>

      <div className="mb-6 flex justify-center space-x-4">
          <Input
            type="text"
            placeholder="Search..."
            className="rounded-md px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text caret-blue-500 animate-blink-wide"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Dropdown isDisabled={!dropdownEnabled}>
            <DropdownTrigger>
              <Button className="mt-2 rounded-md px-4 py-2 text-black">
                Sort By: {sortBy}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Sort Options"
              variant="flat"
              selectionMode="single"
              className="text-black"
              onAction={(e) => handleSwitchTerm(e)}
            >
              <DropdownItem key="Date">Date</DropdownItem>
              <DropdownItem key="Title">Title</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((doc) => (
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
  );
}
