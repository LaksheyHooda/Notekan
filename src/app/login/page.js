'use client'

import Image from "next/image";
import { db, auth } from "@/config/firebase/config";
import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Modal from "@/components/failedloginmodal";
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { useRouter } from 'next/navigation'

export default function Signup() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const router = useRouter()

    useEffect(() => {

    }, []);

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
        <div className="flex min-h-screen flex-col items-center p-24">
            Login!
            <form onSubmit={handleSubmit}>
                <Input
                    className="mt-4 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text caret-blue-500 animate-blink-wide"
                    placeholder="Email"
                    onKeyDown={handleKeyDown}
                    value={email}
                    onValueChange={setEmail}
                />
                <Input
                    className="mt-4 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text caret-blue-500 animate-blink-wide"  
                    placeholder="Password"
                    type="password"
                    onKeyDown={handleKeyDown}
                    value={password}
                    onValueChange={setPassword}
                />
                <Button className="mt-4">
                    Login
                </Button>
            </form>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} message={error} />
        </div>
    );
}
