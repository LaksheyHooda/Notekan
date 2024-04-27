import Image from "next/image";
import { Link } from "@nextui-org/react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex-col inline-block">
        <p className="mb-4">Welcome to Notekan</p>
        <div>
          <Link href="/signup" className="mb-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Sign Up
            </button>
          </Link>
        </div>
        <div>
          <Link href="/login" className="mb-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Login
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}