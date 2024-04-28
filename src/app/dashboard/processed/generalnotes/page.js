"use client";

import { db, auth } from "@/config/firebase/config";


export default function Home() {
  return (
    <div className="flex flex-col pt-10 inset-0 w-screen min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <h1 className="text-center">Welcome to General Notes</h1>
    </div>
  );
}
