"use client";

import { db, auth } from "@/config/firebase/config";
import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Modal from "@/components/failedloginmodal";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { Link } from "@nextui-org/react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => { }, []);

  const handleSignup = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        //revalidatePath('/dashboard') // Update cached posts
        router.replace(`/dashboard`)
      })
    } catch (error) {
      setError(error.message);
      setIsModalOpen(true);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSignup();
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  }

  return (
    <main className="flex justify-center inset-0 fixed items-center h-screen bg-gradient-to-r from-[#243c5a] to-[#056954]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Welcome to Notekan!
        </h2>
        <form onSubmit={handleSubmit}>
          <Input
            className="mt-4 w-full rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text caret-blue-500 animate-blink-wide"
            placeholder="Email"
            onKeyDown={handleKeyDown}
            value={email}
            onValueChange={setEmail}
            required
          />
          <Input
            className="mt-4 w-full rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text caret-blue-500 animate-blink-wide"
            placeholder="Password"
            type="password"
            onKeyDown={handleKeyDown}
            value={password}
            onValueChange={setPassword}
            required
          />
          <div className="flex justify-between items-center mb-4">
            <div>
              <input
                type="checkbox"
                id="remember"
                name="remember"
                className="mr-2"
              />
              <label htmlFor="remember" className="font-medium text-slate-900">
                Remember me
              </label>
            </div>
            <Link
              href="/forgotPassword"
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <Button onClick={handleSubmit} className="py-2 px-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 shadow-gray-500/50 font-bold">
            Login
          </Button>
        </form>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          message={error}
        />

        <div className="mt-4 text-center">
          <span className="mr-2 text-slate-900">Don't have an account?</span>
          <Link
            href="/signup"
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}