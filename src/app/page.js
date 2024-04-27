"use client";

import { Button } from "@nextui-org/react";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 animate-[pulse_4s_cubic-bezier(0.4,_0,_0.6,_1)_infinite]">
        Welcome to Notekan!
      </h1>
      <p className="text-lg md:text-xl text-white mb-8">
        We hate Confluence too.
      </p>
      <Button className="bg-white hover:bg-gray-200 text-blue-500 font-bold py-2 px-4 rounded">
        Get Started
      </Button>
    </main>
  );
}