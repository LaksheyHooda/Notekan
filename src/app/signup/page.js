"use client";

import { db, auth } from "@/config/firebase/config";
import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"; // Removed empty import statement
import Modal from "@/components/failedloginmodal";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { Link } from "@nextui-org/react";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => { }, []);

    const handleSignup = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password).then(
                (userCredential) => {
                    router.replace(`/dashboard`);
                }
            );
        } catch (error) {
            if (error.message === "Firebase: Error (auth/invalid-email).") {
                setError("Invalid email.");
            } else if (error.message === "Firebase: Error (auth/wrong-password).") {
                setError("Invalid password.");
            } else {
                setError("An error occurred. Please try again.");
            }
            setIsModalOpen(true);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        handleSignup();
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSubmit(event);
        }
    };

    return (
        <main className="flex h-screen inset-0 fixed justify-center items-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-slate-900">Sign Up</h2>
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
                    <Button className="py-2 px-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 shadow-gray-500/50 font-bold">
                        Sign Up
                    </Button>
                </form>
                <div className="mt-4 text-center">
                    <span className="mr-2 text-slate-900">Already have an account?</span>
                    <Link
                        href="/login"
                        className="text-blue-500 hover:text-blue-700 font-medium"
                    >
                        Log in
                    </Link>
                </div>
            </div>
        </main>
    );
}
