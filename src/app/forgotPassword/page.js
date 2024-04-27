"use client";

import Image from "next/image";
import { db, auth } from "@/config/firebase/config";
import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Link } from "@nextui-org/react";

export default function ForgotPassword() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {}, []);

  const handleEmail = async () => {
    try {
      await sendPasswordResetEmail(auth, email).then(() => {
        router.replace(`/login`);
      });
    } catch (error) {
      setError(error.message);
      setIsModalOpen(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleEmail();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  return (
    <div className="flex justify-center inset-0 fixed items-center h-screen bg-gradient-to-r from-[#000000] to-[#243c5a]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Forgot Password
        </h2>
        <p className="text-slate-900 mb-4">
          Enter your email address to reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          <Input
            className="mt-4 w-full rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text caret-blue-500 animate-blink-wide"
            placeholder="Email"
            onKeyDown={handleKeyDown}
            value={email}
            onValueChange={setEmail}
            required
          />
          <Button
            onClick={handleSubmit}
            className="py-2 px-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 shadow-gray-500/50 font-bold mt-4"
          >
            Send Reset Link
          </Button>
        </form>

        <Button
          onClick={() => router.replace(`/login`)}
          className="py-2 px-4 w-full bg-white hover:bg-gray-200 text-blue-500 hover:text-blue-700 shadow-gray-500/50 font-bold mt-4"
        >
          Back to Login
        </Button>
      </div>
    </div>
  );
}
