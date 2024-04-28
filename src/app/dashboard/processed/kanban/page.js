"use client";

import { db, auth } from "@/config/firebase/config";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <h1 className="text-center">Welcome to kanban</h1>
    </div>
  );
}
