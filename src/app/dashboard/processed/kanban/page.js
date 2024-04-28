"use client";

import { db, auth } from "@/config/firebase/config";
import { Input } from "@nextui-org/react";
import Link from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import IndexDragable from "@/pages/kanbanIndex";

export default function KanBan() {
  const [dataDoc, setDataDoc] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [currentBoardId, setCurrentBoardId] = useState("board1");

  const [lists, setLists] = useState([
    { id: "list1", title: "To Do", boardId: "board1", cards: [] },
    { id: "list2", title: "In Progress", boardId: "board1", cards: [] },
    { id: "list3", title: "Done", boardId: "board1", cards: [] },
  ]);

  const [cards, setCards] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        assignData();
      } else {
        router.replace(`/login`);
      }
    });
  }, []);

  const assignData = async () => {
    try {
      const docRef = doc(db, "processedDocuments", id);
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
  };

  return (
    <div className="flex flex-col pt-10 inset-0 w-screen min-h-screen bg-gradient-to-r from-pink-500 to-blue-500">
      <IndexDragable documentData={dataDoc}/>
    </div>);
}
