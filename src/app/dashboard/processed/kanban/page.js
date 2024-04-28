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

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (source.droppableId !== destination.droppableId) {
      const sourceList = lists.find((list) => list.id === source.droppableId);
      const destinationList = lists.find(
        (list) => list.id === destination.droppableId
      );

      const card = cards.find((card) => card.id === result.draggableId);

      const updatedCards = cards.filter(
        (card) => card.id !== result.draggableId
      );
      updatedCards.splice(destination.index, 0, {
        ...card,
        listId: destination.droppableId,
      });

      setCards(updatedCards);

      const updatedLists = lists.map((list) => {
        if (list.id === source.droppableId) {
          return {
            ...list,
            cards: list.cards.filter((card) => card.id !== result.draggableId),
          };
        }
        if (list.id === destination.droppableId) {
          return {
            ...list,
            cards: [
              ...list.cards.slice(0, destination.index),
              card,
              ...list.cards.slice(destination.index),
            ],
          };
        }
        return list;
      });

      setLists(updatedLists);
    }
  };

  const addCard = (listId) => {
    const newCard = {
      id: uuidv4(),
      title: "New Card",
      description: "",
      dueDate: "",
      labels: [],
      boardId: currentBoardId,
      listId,
    };
    setCards([...cards, newCard]);
    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        return { ...list, cards: [...list.cards, newCard] };
      }
      return list;
    });
    setLists(updatedLists);
  };

  return (
    <div className="flex flex-col pt-10 inset-0 w-screen min-h-screen bg-gradient-to-r from-white to-purple-500">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex space-x-4">
          {lists.map((list) => (
            <div
              key={list.id}
              className="bg-white rounded-lg shadow-md p-4 w-64 flex-shrink-0"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-gray-800">
                  {list.title}
                </h3>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-sm"
                  onClick={() => addCard(list.id)}
                >
                  + Add Card
                </button>
              </div>
              <Droppable droppableId={list.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2"
                  >
                    {list.cards.map((card, index) => (
                      <Draggable
                        key={card.id}
                        draggableId={card.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white rounded-md shadow-sm p-4 cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                          >
                            <h4 className="text-lg font-bold mb-2 text-gray-800">
                              {card.title}
                            </h4>
                            <p className="mb-2 text-gray-600">
                              {card.description}
                            </p>
                            <p className="text-gray-500 mb-2 text-sm">
                              Due Date: {card.dueDate}
                            </p>
                            <div className="flex flex-wrap space-x-2">
                              {card.labels.map((label) => (
                                <span
                                  key={label}
                                  className={`px-2 py-1 rounded-full text-white text-xs ${
                                    label === "label1"
                                      ? "bg-blue-500"
                                      : "bg-green-500"
                                  }`}
                                >
                                  {label}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
