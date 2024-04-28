"use client";

import { db, auth } from "@/config/firebase/config";
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

export default function Archive() {
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
        collection(db, "transcriptions"),
        where("userID", "==", userID)
      );
      const querySnapshot = await getDocs(q);
      setRawDocs(querySnapshot.docs);
      setItems(querySnapshot.docs);
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
    <div className="flex w-screen min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="container justify-center mx-auto py-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-white">
          NoteKan Archive
        </h1>

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
              <Button className="rounded-md px-4 py-2 text-black">
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

        <div className="overflow-x-auto">
          <table className="w-full max-w-3xl border-collapse mx-auto bg-white rounded-lg shadow-lg">
            <thead>
              <tr className="bg-gray-200 text-center">
                <th
                  className="py-2 px-4 text-black rounded-tl-lg"
                  style={{ width: "80%" }}
                >
                  Title
                </th>
                <th
                  className="py-2 px-4 text-black rounded-tr-lg"
                  style={{ width: "20%" }}
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-b hover:bg-gray-100 transition-colors duration-300"
                >
                  <td className="pb-2 pt-2 pr-4" style={{ width: "80%" }}>
                    <a
                      href={"/dashboard/archive/transcriptcontent?id=" + doc.id}
                      className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                    >
                      {doc.data().title}
                    </a>
                  </td>
                  <td
                    className="text-black pb-2 pt-2 pl-4"
                    style={{ width: "20%" }}
                  >
                    {new Date(doc.data().time).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
