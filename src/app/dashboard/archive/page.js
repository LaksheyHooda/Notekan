"use client";

import { db, auth } from "@/config/firebase/config";
import { Input } from "@nextui-org/react";
import Link from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function Archive() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [items, setItems] = useState([
    { id: 1, title: "Item 1", date: "2023-04-01" },
    { id: 2, title: "Item 2", date: "2023-04-15" },
    { id: 3, title: "Item 3", date: "2023-05-01" },
    { id: 4, title: "Item 4", date: "2023-05-20" },
    { id: 5, title: "Item 5", date: "2023-06-01" },
  ]);

  const filteredItems = items.filter((item) => {
    item.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sortedItems = filteredItems.sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else {
      return a.category.localeCompare(b.category);
    }
  });

  return (
    <div className="flex justify-center inset-0 fixed items-center h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-6">NoteKan Archive</h1>

        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search..."
            className="rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text caret-blue-500 animate-blink-wide"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <label className="mr-2">Sort By:</label>
          <select
            className="rounded-md px-4 py-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option className="text-black" value="date">
              Date
            </option>
            <option className="text-black" value="title">
              Title
            </option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {sortedItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-2">{item.title}</h2>
              <p className="text-black mb-2">{item.date}</p>
              <p className="text-black mb-4">{item.category}</p>
            </div>
          ))}
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 text-left text-black">Title</th>
              <th className="py-2 px-4 text-left text-black">Date</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2 px-4">{item.title}</td>
                <td className="py-2 px-4">{item.date}</td>
                <td className="py-2 px-4">{item.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
