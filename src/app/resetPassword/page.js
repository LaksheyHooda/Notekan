"use client";

import { auth } from "@/config/firebase/config";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { updatePassword } from "firebase/auth";

export default function ForgotPassword() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {}, []);

  const handlePasswords = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsModalOpen(true);
      return;
    }
    try {
      const user = auth.currentUser;
      await updatePassword(user, confirmPassword).then(() => {
        router.replace(`/login`);
      });
    } catch (error) {
      setError(error.message);
      setIsModalOpen(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handlePasswords();
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
          Reset Password
        </h2>
        <form onSubmit={handleSubmit}>
          <Input
            className="mt-4 w-full rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text caret-blue-500 animate-blink-wide"
            placeholder="Password"
            onKeyDown={handleKeyDown}
            value={password}
            onValueChange={setPassword}
            required
          />
          <Input
            className="mt-4 w-full rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text caret-blue-500 animate-blink-wide"
            placeholder="Confirm Password"
            onKeyDown={handleKeyDown}
            value={confirmPassword}
            onValueChange={setConfirmPassword}
            required
          />
          <Button
            onClick={handleSubmit}
            className="py-2 px-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 shadow-gray-500/50 font-bold mt-4"
          >
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}
